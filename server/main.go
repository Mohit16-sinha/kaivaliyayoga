package main

import (
	"fmt"
	"kaivaliyayoga/internal/handlers"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/glebarez/sqlite"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// DB setup placeholder
var db *gorm.DB

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		fmt.Println("No .env file found, using system env vars")
	}

	// Initialize Database
	var err error
	dbDriver := os.Getenv("DB_DRIVER")

	if dbDriver == "postgres" {
		dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=UTC",
			os.Getenv("DB_HOST"),
			os.Getenv("DB_USER"),
			os.Getenv("DB_PASSWORD"),
			os.Getenv("DB_NAME"),
			os.Getenv("DB_PORT"),
		)
		fmt.Println("Connecting to PostgreSQL...")
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	} else {
		// Fallback to SQLite
		dbPath := os.Getenv("DB_NAME")
		if dbPath == "" {
			dbPath = "yoga.db"
		}
		fmt.Println("Connecting to SQLite...")
		db, err = gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	}

	if err != nil {
		panic("failed to connect database: " + err.Error())
	}

	// Migrate Schema
	// Enhanced & New Models
	err = db.AutoMigrate(
		&User{},
		&Contact{},
		&Class{},
		&Booking{},
		&Payment{},
		&Membership{},
		&Program{},
		&ProgramEnrollment{},
		&PracticeSession{},
		// Marketplace Models
		&Professional{},
		&ProfessionalCertification{},
		&Service{},
		&ProfessionalAvailability{},
		&Appointment{},
		&Review{},
		&Message{},
		&ProfessionalApplication{},
	)
	if err != nil {
		fmt.Println("Migration Failed:", err)
	}

	// Data Migration Check
	if os.Getenv("MIGRATE_SQLITE") == "true" {
		MigrateFromSQLite(db)
	}

	// Seed Data
	SeedPrograms()

	// Initialize Router
	r := gin.Default()

	// CORS Configuration
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Basic Route
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
			"status":  "Backend is running!",
		})
	})
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	// Auth Routes
	r.POST("/signup", SignUp)
	r.POST("/signin", Login)

	// Public Class Routes
	r.GET("/classes", GetClasses)
	r.GET("/classes/:id", GetClass)

	// Public Program Routes
	r.GET("/api/programs", GetPrograms)
	r.GET("/api/programs/:id", GetProgram)

	// Protected Routes (User)
	userRoutes := r.Group("/user")
	userRoutes.Use(AuthMiddleware())
	{
		userRoutes.GET("/profile", GetProfile)
		userRoutes.PUT("/profile", UpdateProfile)

		// Booking Routes
		userRoutes.POST("/bookings", CreateBooking)
		userRoutes.GET("/bookings", GetMyBookings)
		userRoutes.DELETE("/bookings/:id", CancelBooking)
	}

	// Payment Routes (Protected)
	paymentRoutes := r.Group("/api/payments")
	paymentRoutes.Use(AuthMiddleware())
	{
		paymentRoutes.POST("/create-order", CreateOrder)
		paymentRoutes.POST("/verify", VerifyPayment)
		paymentRoutes.GET("/my", GetMyPayments)
	}

	// Membership Routes (Protected)
	membershipRoutes := r.Group("/api/memberships")
	membershipRoutes.Use(AuthMiddleware())
	{
		membershipRoutes.POST("/purchase", PurchaseMembership)
		membershipRoutes.GET("/my", GetMyMemberships)
		membershipRoutes.GET("/validate", ValidateMembership)
	}

	// Initialize Email Worker
	InitEmailService()

	// --- Routes ---
	r.POST("/api/emails/test", func(c *gin.Context) {
		// Admin only (should protect this in prod)
		var input struct {
			To string `json:"to"`
		}
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		SendWelcomeEmail(input.To, "Test User")
		c.JSON(http.StatusOK, gin.H{"message": "Test email queued"})
	})

	// Program Enrollment Routes (Protected)
	programRoutes := r.Group("/api/programs")
	programRoutes.Use(AuthMiddleware())
	{
		programRoutes.POST("/enroll", EnrollProgram)
		programRoutes.GET("/my", GetMyEnrollments)
	}

	// Start Background Job for Expiry
	go func() {
		for {
			// Update status of memberships that have passed their end date
			result := db.Model(&Membership{}).
				Where("status = ? AND end_date < ?", "active", time.Now()).
				Update("status", "expired")

			if result.RowsAffected > 0 {
				fmt.Printf("Background Job: Expired %d memberships\n", result.RowsAffected)
			}

			time.Sleep(1 * time.Hour) // Run every hour
			time.Sleep(1 * time.Hour) // Run every hour
		}
	}()

	// AI Practice Routes (Protected)
	aiRoutes := r.Group("/api/ai-practice")
	aiRoutes.Use(AuthMiddleware())
	{
		aiRoutes.POST("/sessions", SavePracticeSession)
		aiRoutes.GET("/history", GetPracticeHistory)
		aiRoutes.GET("/stats", GetPracticeStats)
	}

	// Currency Routes (Public)
	r.GET("/api/exchange-rates", GetExchangeRates)

	// Webhooks (Public)
	// r.POST("/api/payments/webhook", WebhookHandler) // Implement later if needed

	// Admin Routes
	adminRoutes := r.Group("/admin")
	adminRoutes.Use(AuthMiddleware(), AdminMiddleware())
	{
		adminRoutes.POST("/classes", CreateClass)
		adminRoutes.PUT("/classes/:id", UpdateClass)
		adminRoutes.DELETE("/classes/:id", DeleteClass)

		// Dashboard Stats
		adminRoutes.GET("/stats", GetAdminStats)
		adminRoutes.GET("/revenue", GetAdminRevenue)

		// Management
		adminRoutes.GET("/bookings", GetAdminBookings)
		adminRoutes.GET("/users", GetAdminUsers)
		adminRoutes.PUT("/users/:id/role", UpdateUserRole)

		// Contact
		adminRoutes.GET("/contact", GetAdminContact)
		adminRoutes.PUT("/contact/:id", UpdateContactStatus)

		// Program Admin
		adminRoutes.POST("/programs", CreateProgram)
	}

	// Contact Routes
	r.POST("/contact", SubmitContact)

	// Professional Application Routes (Public)
	r.POST("/api/apply/professional", handlers.SubmitApplication)

	// Admin Application Management
	adminRoutes.GET("/applications", handlers.GetApplications)
	adminRoutes.POST("/applications/:id/approve", handlers.ApproveApplication)
	adminRoutes.POST("/applications/:id/reject", handlers.RejectApplication)

	r.GET("/debug", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "I am the new server"})
	})

	// Run Server
	println("Starting server... v6 on 8080")
	fmt.Println("DEBUG: Handling routes registration...")
	for _, route := range r.Routes() {
		fmt.Printf("ROUTE: %s %s\n", route.Method, route.Path)
	}
	r.Run(":8080") // Listen and serve on 0.0.0.0:8080
}
