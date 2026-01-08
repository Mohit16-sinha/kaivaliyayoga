package main

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// --- Models ---

type Program struct {
	gorm.Model
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Duration    string    `json:"duration"` // e.g. "8 weeks"
	Price       float64   `json:"price"`
	Level       string    `json:"level"` // Beginner, Intermediate, Advanced
	StartDate   time.Time `json:"start_date"`
	MaxStudents int       `json:"max_students"`
}

type ProgramEnrollment struct {
	gorm.Model
	UserID         uint      `json:"user_id"`
	ProgramID      uint      `json:"program_id"`
	Program        Program   `json:"program" gorm:"foreignKey:ProgramID"`
	PaymentStatus  string    `json:"payment_status"` // "pending", "paid"
	PaymentID      uint      `json:"payment_id"`     // Link to internal Payment ID
	AmountPaid     float64   `json:"amount_paid"`
	EnrollmentDate time.Time `json:"enrollment_date"`
}

// --- Handlers ---

// Response struct
type ProgramResponse struct {
	Program
	CurrentStudents int64 `json:"current_students"`
	IsFull          bool  `json:"is_full"`
}

// GET /api/programs
func GetPrograms(c *gin.Context) {
	var programs []Program
	if err := db.Find(&programs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch programs"})
		return
	}

	var response []ProgramResponse
	for _, p := range programs {
		var count int64
		db.Model(&ProgramEnrollment{}).Where("program_id = ?", p.ID).Count(&count)
		response = append(response, ProgramResponse{
			Program:         p,
			CurrentStudents: count,
			IsFull:          count >= int64(p.MaxStudents),
		})
	}

	c.JSON(http.StatusOK, response)
}

// GET /api/programs/:id
func GetProgram(c *gin.Context) {
	id := c.Param("id")
	var program Program
	if err := db.First(&program, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Program not found"})
		return
	}
	c.JSON(http.StatusOK, program)
}

// POST /api/programs (Admin only)
func CreateProgram(c *gin.Context) {
	var input Program
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create program"})
		return
	}

	c.JSON(http.StatusCreated, input)
}

// POST /api/programs/enroll
// Body: { "program_id": 123, "payment_id": 45 }
func EnrollProgram(c *gin.Context) {
	userID, _ := c.Get("userID")

	var input struct {
		ProgramID uint        `json:"program_id" binding:"required"`
		PaymentID interface{} `json:"payment_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 1. Get Program
	var program Program
	if err := db.First(&program, input.ProgramID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Program not found"})
		return
	}

	// 2. Check Capacity
	var currentEnrollments int64
	db.Model(&ProgramEnrollment{}).Where("program_id = ?", program.ID).Count(&currentEnrollments)

	if int(currentEnrollments) >= program.MaxStudents {
		c.JSON(http.StatusConflict, gin.H{"error": "Program is full"})
		return
	}

	// 3. Check if already enrolled
	var existing ProgramEnrollment
	if err := db.Where("user_id = ? AND program_id = ?", userID, program.ID).First(&existing).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Already enrolled in this program"})
		return
	}

	// 4. Verify Payment logic...

	// Handle PaymentID type (frontend might send string or number)
	var finalPaymentID uint
	switch v := input.PaymentID.(type) {
	case float64:
		finalPaymentID = uint(v)
	case string:
		finalPaymentID = 0 // Or handle parsing
	case uint:
		finalPaymentID = v
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payment_id format"})
		return
	}

	// 5. Create Enrollment
	enrollment := ProgramEnrollment{
		UserID:         userID.(uint),
		ProgramID:      program.ID,
		PaymentStatus:  "paid",
		PaymentID:      finalPaymentID,
		AmountPaid:     program.Price,
		EnrollmentDate: time.Now(),
	}

	if err := db.Create(&enrollment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to enroll"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Enrollment successful", "enrollment": enrollment})
}

// GET /api/programs/my
func GetMyEnrollments(c *gin.Context) {
	userID, _ := c.Get("userID")
	var enrollments []ProgramEnrollment

	// Preload Program details
	if err := db.Preload("Program").Where("user_id = ?", userID).Find(&enrollments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch enrollments"})
		return
	}

	c.JSON(http.StatusOK, enrollments)
}

// --- Seeder ---

func SeedPrograms() {
	var count int64
	db.Model(&Program{}).Count(&count)
	if count > 0 {
		return // Already seeded
	}

	programs := []Program{
		{
			Name:        "Yoga Foundation Course",
			Description: "A comprehensive introduction to Hatha Yoga. Master the basics.",
			Duration:    "8 Weeks",
			Price:       8000,
			Level:       "Beginner",
			StartDate:   time.Now().AddDate(0, 0, 7), // Starts in 1 week
			MaxStudents: 20,
		},
		{
			Name:        "Sahaj Meditation Program",
			Description: "Discover the power of your breath and mind. Effortless meditation.",
			Duration:    "4 Weeks",
			Price:       5000,
			Level:       "All Levels",
			StartDate:   time.Now().AddDate(0, 1, 0), // Starts in 1 month
			MaxStudents: 30,
		},
		{
			Name:        "200Hr Teacher Training",
			Description: "Professional level training. Anatomy, philosophy, and teaching art.",
			Duration:    "6 Months",
			Price:       45000,
			Level:       "Advanced",
			StartDate:   time.Now().AddDate(0, 2, 0), // Starts in 2 months
			MaxStudents: 15,
		},
	}

	for _, p := range programs {
		db.Create(&p)
	}
	println("Programs seeded successfully.")
}
