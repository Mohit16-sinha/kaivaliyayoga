package main

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// --- Model ---
type Contact struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	Name      string         `json:"name"`
	Email     string         `json:"email"`
	Phone     string         `json:"phone"`
	Subject   string         `json:"subject"`
	Message   string         `json:"message"`
	Status    string         `json:"status" gorm:"default:'unread'"` // 'unread', 'read', 'replied'
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

// --- DTO ---
type ContactInput struct {
	Name    string `json:"name" binding:"required"`
	Email   string `json:"email" binding:"required,email"`
	Phone   string `json:"phone"`
	Subject string `json:"subject" binding:"required"`
	Message string `json:"message" binding:"required"`
}

// --- Controller ---
func SubmitContact(c *gin.Context) {
	var input ContactInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	contact := Contact{
		Name:    input.Name,
		Email:   input.Email,
		Phone:   input.Phone,
		Subject: input.Subject,
		Message: input.Message,
	}

	if result := db.Create(&contact); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save message"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Message sent successfully!", "contact": contact})
}
