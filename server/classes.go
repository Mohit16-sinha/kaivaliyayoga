package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// --- Model ---
type Class struct {
	ID          uint   `json:"id" gorm:"primaryKey"`
	Name        string `json:"name" binding:"required"`
	Description string `json:"description"`
	Teacher     string `json:"teacher" binding:"required"`
	Day         string `json:"day" binding:"required"`      // e.g., "Monday"
	Time        string `json:"time" binding:"required"`     // e.g., "08:00 AM"
	Duration    int    `json:"duration" binding:"required"` // in minutes
	Capacity    int    `json:"capacity" binding:"required"`
	Level       string `json:"level" binding:"required"` // Beginner, etc.

	// New Marketplace Fields
	ProfessionalID *uuid.UUID `json:"professional_id" gorm:"type:uuid;index"` // Optional link
	PriceCents     int        `json:"price_cents" gorm:"default:0"`
	Currency       string     `json:"currency" gorm:"default:'AUD'"`
	LocationType   string     `json:"location_type" gorm:"default:'online'"` // online, in-person, hybrid
	MeetingURL     string     `json:"meeting_url"`

	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

// --- Handlers ---

// Response struct for Public API
type ClassResponse struct {
	Class
	SlotsBooked int64 `json:"slots_booked"`
	IsFull      bool  `json:"is_full"`
}

// GetClasses - Public - List all classes
func GetClasses(c *gin.Context) {
	var classes []Class
	if err := db.Find(&classes).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch classes"})
		return
	}

	response := []ClassResponse{}
	for _, cls := range classes {
		var count int64
		// Count only confirmed bookings
		db.Model(&Booking{}).Where("class_id = ? AND status = ?", cls.ID, "confirmed").Count(&count)

		fmt.Printf("Debug: Class %d (%s) - bookings: %d\n", cls.ID, cls.Name, count)

		response = append(response, ClassResponse{
			Class:       cls,
			SlotsBooked: count,
			IsFull:      count >= int64(cls.Capacity),
		})
	}

	c.JSON(http.StatusOK, response)
}

// GetClass - Public - Get single class
func GetClass(c *gin.Context) {
	id := c.Param("id")
	var class Class
	if err := db.First(&class, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Class not found"})
		return
	}
	c.JSON(http.StatusOK, class)
}

// CreateClass - Admin - Create a new class
func CreateClass(c *gin.Context) {
	var input Class
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if result := db.Create(&input); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create class"})
		return
	}

	c.JSON(http.StatusCreated, input)
}

// UpdateClass - Admin - Update existing class
func UpdateClass(c *gin.Context) {
	id := c.Param("id")
	var class Class
	if err := db.First(&class, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Class not found"})
		return
	}

	var input Class
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update fields
	class.Name = input.Name
	class.Description = input.Description
	class.Teacher = input.Teacher
	class.Day = input.Day
	class.Time = input.Time
	class.Duration = input.Duration
	class.Capacity = input.Capacity
	class.Level = input.Level

	db.Save(&class)
	c.JSON(http.StatusOK, class)
}

// DeleteClass - Admin - Delete class
func DeleteClass(c *gin.Context) {
	id := c.Param("id")
	var class Class
	if err := db.First(&class, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Class not found"})
		return
	}

	db.Delete(&class)
	c.JSON(http.StatusOK, gin.H{"message": "Class deleted successfully"})
}
