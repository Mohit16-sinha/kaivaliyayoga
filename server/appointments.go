package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// --- Appointment DTOs ---

type CreateAppointmentInput struct {
	ProfessionalID string `json:"professional_id" binding:"required"`
	ServiceID      string `json:"service_id" binding:"required"`
	StartTime      string `json:"start_time" binding:"required"` // RFC3339
	EndTime        string `json:"end_time" binding:"required"`   // RFC3339
	ClientNotes    string `json:"client_notes"`
	PaymentID      *uint  `json:"payment_id"`
}

// --- Appointment Handlers ---

// CreateAppointment - Protected - Book with a professional
func CreateAppointment(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var input CreateAppointmentInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Parse UUIDs
	professionalID, err := uuid.Parse(input.ProfessionalID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid professional_id"})
		return
	}

	serviceID, err := uuid.Parse(input.ServiceID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid service_id"})
		return
	}

	// Parse times
	startTime, err := time.Parse(time.RFC3339, input.StartTime)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid start_time format, use RFC3339"})
		return
	}

	endTime, err := time.Parse(time.RFC3339, input.EndTime)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid end_time format, use RFC3339"})
		return
	}

	// Get client ID
	var clientID uint
	switch v := userID.(type) {
	case float64:
		clientID = uint(v)
	case uint:
		clientID = v
	case int:
		clientID = uint(v)
	default:
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID"})
		return
	}

	// Get service to get pricing (optional - use defaults if not found)
	var service Service
	var priceCents int = 5000 // Default $50
	var currency string = "USD"

	if err := db.Where("id = ?", serviceID).First(&service).Error; err == nil {
		priceCents = service.PriceCents
		currency = service.Currency
		if currency == "" {
			currency = "USD"
		}
	}
	// Note: We allow appointments even without matching service for demo/mock scenarios

	// Generate reference code
	referenceCode := fmt.Sprintf("APT-%s", uuid.New().String()[:8])

	// Create appointment
	appointment := Appointment{
		ReferenceCode:             referenceCode,
		ClientID:                  clientID,
		ProfessionalID:            professionalID,
		ServiceID:                 serviceID,
		StartTime:                 startTime,
		EndTime:                   endTime,
		Status:                    "pending",
		PriceChargedCents:         priceCents,
		CurrencyCharged:           currency,
		PaymentStatus:             "unpaid",
		ClientNotes:               input.ClientNotes,
		PlatformFeeCents:          int(float64(priceCents) * 0.10), // 10% platform fee
		ProfessionalEarningsCents: int(float64(priceCents) * 0.90),
		PaymentID:                 input.PaymentID,
	}

	if err := db.Create(&appointment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create appointment: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":        "Appointment created successfully",
		"appointment_id": appointment.ID,
		"reference_code": referenceCode,
	})
}

// GetMyAppointments - Protected - List user's appointments
func GetMyAppointments(c *gin.Context) {
	userID, _ := c.Get("userID")

	var clientID uint
	switch v := userID.(type) {
	case float64:
		clientID = uint(v)
	case uint:
		clientID = v
	case int:
		clientID = uint(v)
	}

	var appointments []Appointment
	if err := db.Where("client_id = ?", clientID).
		Preload("Professional").
		Preload("Service").
		Preload("Payment").
		Order("start_time desc").
		Find(&appointments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch appointments"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": appointments})
}

// GetAppointmentByID - Protected - Get single appointment
func GetAppointmentByID(c *gin.Context) {
	userID, _ := c.Get("userID")
	appointmentIDStr := c.Param("id")

	appointmentID, err := uuid.Parse(appointmentIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid appointment ID"})
		return
	}

	var clientID uint
	switch v := userID.(type) {
	case float64:
		clientID = uint(v)
	case uint:
		clientID = v
	case int:
		clientID = uint(v)
	}

	var appointment Appointment
	if err := db.Where("id = ? AND client_id = ?", appointmentID, clientID).
		Preload("Professional").
		Preload("Service").
		Preload("Payment").
		First(&appointment).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Appointment not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": appointment})
}

// CancelAppointment - Protected - Cancel an appointment
func CancelAppointment(c *gin.Context) {
	userID, _ := c.Get("userID")
	appointmentIDStr := c.Param("id")

	appointmentID, err := uuid.Parse(appointmentIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid appointment ID"})
		return
	}

	var clientID uint
	switch v := userID.(type) {
	case float64:
		clientID = uint(v)
	case uint:
		clientID = v
	case int:
		clientID = uint(v)
	}

	var appointment Appointment
	if err := db.Where("id = ? AND client_id = ?", appointmentID, clientID).First(&appointment).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Appointment not found"})
		return
	}

	if appointment.Status == "cancelled" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Appointment already cancelled"})
		return
	}

	if appointment.Status == "completed" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot cancel completed appointment"})
		return
	}

	appointment.Status = "cancelled"
	db.Save(&appointment)

	c.JSON(http.StatusOK, gin.H{"message": "Appointment cancelled successfully"})
}

// RescheduleAppointment - Protected - Reschedule an appointment
func RescheduleAppointment(c *gin.Context) {
	userID, _ := c.Get("userID")
	appointmentIDStr := c.Param("id")

	appointmentID, err := uuid.Parse(appointmentIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid appointment ID"})
		return
	}

	var input struct {
		StartTime string `json:"start_time" binding:"required"`
		EndTime   string `json:"end_time" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	startTime, err := time.Parse(time.RFC3339, input.StartTime)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid start_time format"})
		return
	}

	endTime, err := time.Parse(time.RFC3339, input.EndTime)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid end_time format"})
		return
	}

	var clientID uint
	switch v := userID.(type) {
	case float64:
		clientID = uint(v)
	case uint:
		clientID = v
	case int:
		clientID = uint(v)
	}

	var appointment Appointment
	if err := db.Where("id = ? AND client_id = ?", appointmentID, clientID).First(&appointment).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Appointment not found"})
		return
	}

	appointment.StartTime = startTime
	appointment.EndTime = endTime
	appointment.Status = "rescheduled"
	db.Save(&appointment)

	c.JSON(http.StatusOK, gin.H{"message": "Appointment rescheduled successfully"})
}
