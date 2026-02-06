package main

import (
	"fmt"
	"os"
	"time"

	"kaivaliyayoga/internal/config"
	"kaivaliyayoga/internal/handlers"
	"kaivaliyayoga/internal/middleware"
	"kaivaliyayoga/internal/models"
	"kaivaliyayoga/pkg/database"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// 1. Load Config
	config.LoadConfig()

	// 2. Connect Database
	database.Connect()

	// 3. Auto Migrate
	db := database.GetDB()
	db.AutoMigrate(
		&models.User{},
		&models.Professional{},
		&models.Service{},
		&models.Appointment{},
		&models.ProfessionalApplication{},
		&models.ProfessionalAvailability{},
		&models.ProfessionalCertification{},
	)

	// 4. Seed dummy data for testing
	database.SeedProfessionals()

	// 4. Setup Router
	r := gin.Default()

	// CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length", "Content-Disposition"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Application Route (Public)
	r.POST("/api/apply/professional", handlers.SubmitApplication)

	// Admin Routes for Applications
	r.GET("/admin/applications", handlers.GetApplications)
	r.POST("/admin/applications/:id/approve", handlers.ApproveApplication)
	r.POST("/admin/applications/:id/reject", handlers.RejectApplication)

	// 5. Register Routes
	authHandler := handlers.AuthHandler{}
	userHandler := handlers.UserHandler{}
	proHandler := handlers.ProfessionalHandler{}
	apptHandler := handlers.AppointmentHandler{}

	// Legacy Routes for Frontend Compatibility
	r.POST("/signup", authHandler.SignUp)
	r.POST("/signin", authHandler.Login)

	api := r.Group("/api/v1") // New versioned prefix
	{
		auth := api.Group("/auth")
		{
			auth.POST("/signup", authHandler.SignUp)
			auth.POST("/signin", authHandler.Login)
		}

		// Public - Professionals
		pros := api.Group("/professionals")
		{
			pros.GET("/search", proHandler.Search)
			pros.GET("/:id", proHandler.GetByID)
		}

		// Health Check
		api.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{"status": "ok", "version": "v1"})
		})

		// Protected Routes
		protected := api.Group("/")
		protected.Use(middleware.AuthMiddleware())
		{
			// User Profile
			protected.GET("/user/profile", userHandler.GetProfile)
			protected.PUT("/user/profile", userHandler.UpdateProfile)

			// Appointment Management
			protected.POST("/appointments", apptHandler.Create)
			protected.GET("/appointments", apptHandler.GetMy)
			protected.GET("/appointments/:id", apptHandler.GetByID)
			protected.PUT("/appointments/:id", apptHandler.Reschedule)
			protected.DELETE("/appointments/:id", apptHandler.Cancel)

			// Professional Management
			pro := protected.Group("/professional")
			{
				pro.POST("/profile", proHandler.CreateProfile)
			}
		}
	}

	// 6. Start Server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	fmt.Printf("Starting REST API Server on :%s...\n", port)
	r.Run(":" + port)
}
