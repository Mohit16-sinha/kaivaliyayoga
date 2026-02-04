package services

import (
	"errors"
	"time"

	"kaivaliyayoga/internal/models"
	"kaivaliyayoga/pkg/database"

	"github.com/google/uuid"
)

type AppointmentService struct{}

func (s *AppointmentService) CreateAppointment(userID uint, input models.Appointment) (*models.Appointment, error) {
	// 1. Verify Professional & Service
	var service models.Service
	if err := database.DB.First(&service, "id = ?", input.ServiceID).Error; err != nil {
		return nil, errors.New("service not found")
	}

	// 2. Check Availability (Simplified for now)
	// TODO: Check against ProfessionalAvailability table

	// 3. Create Booking
	input.ClientID = userID
	input.ProfessionalID = service.ProfessionalID
	input.ReferenceCode = uuid.New().String()[:8] // Short ref
	input.Status = "pending"
	input.PriceChargedCents = service.PriceCents
	input.CurrencyCharged = service.Currency

	if err := database.DB.Create(&input).Error; err != nil {
		return nil, err
	}

	return &input, nil
}

func (s *AppointmentService) GetMyAppointments(userID uint, userType string) ([]models.Appointment, error) {
	var appointments []models.Appointment
	db := database.DB.Preload("Professional.User").Preload("Service").Preload("Client")

	if userType == "professional" {
		// Need to find pro ID first
		var pro models.Professional
		if err := database.DB.Where("user_id = ?", userID).First(&pro).Error; err != nil {
			return nil, errors.New("professional profile not found")
		}
		db = db.Where("professional_id = ?", pro.ID)
	} else {
		db = db.Where("client_id = ?", userID)
	}

	if err := db.Order("start_time desc").Find(&appointments).Error; err != nil {
		return nil, err
	}
	return appointments, nil
}

// GetByID returns a single appointment, ensuring the user has access
func (s *AppointmentService) GetByID(appointmentID uuid.UUID, userID uint) (*models.Appointment, error) {
	var appointment models.Appointment
	err := database.DB.
		Preload("Professional.User").
		Preload("Service").
		Preload("Client").
		Where("id = ? AND (client_id = ? OR professional_id IN (SELECT id FROM professionals WHERE user_id = ?))", appointmentID, userID, userID).
		First(&appointment).Error

	if err != nil {
		return nil, errors.New("appointment not found or access denied")
	}
	return &appointment, nil
}

// Cancel marks an appointment as cancelled
func (s *AppointmentService) Cancel(appointmentID uuid.UUID, userID uint, reason string) error {
	// First verify the user owns this appointment
	var appointment models.Appointment
	err := database.DB.Where("id = ? AND client_id = ?", appointmentID, userID).First(&appointment).Error
	if err != nil {
		return errors.New("appointment not found or access denied")
	}

	if appointment.Status == "cancelled" {
		return errors.New("appointment is already cancelled")
	}

	if appointment.Status == "completed" {
		return errors.New("cannot cancel a completed appointment")
	}

	// Update status
	appointment.Status = "cancelled"
	appointment.CancellationReason = reason
	return database.DB.Save(&appointment).Error
}

// Reschedule updates the appointment time
func (s *AppointmentService) Reschedule(appointmentID uuid.UUID, userID uint, newStartTime, newEndTime time.Time) error {
	var appointment models.Appointment
	err := database.DB.Where("id = ? AND client_id = ?", appointmentID, userID).First(&appointment).Error
	if err != nil {
		return errors.New("appointment not found or access denied")
	}

	if appointment.Status == "cancelled" || appointment.Status == "completed" {
		return errors.New("cannot reschedule a cancelled or completed appointment")
	}

	// Update times
	appointment.StartTime = newStartTime
	appointment.EndTime = newEndTime
	appointment.Status = "rescheduled"

	return database.DB.Save(&appointment).Error
}
