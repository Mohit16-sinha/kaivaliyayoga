package models

import (
	"time"

	"gorm.io/gorm"
)

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
