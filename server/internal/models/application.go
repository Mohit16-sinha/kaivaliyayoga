package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

// ProfessionalApplication stores data for unverified applicants
type ProfessionalApplication struct {
	ID uuid.UUID `json:"id" gorm:"type:uuid;default:gen_random_uuid();primaryKey"`

	// Personal Info
	Name    string `json:"name" binding:"required"`
	Email   string `json:"email" binding:"required,email" gorm:"index"` // Index for lookup
	Phone   string `json:"phone" binding:"required"`
	Age     int    `json:"age"`
	Gender  string `json:"gender"`
	Country string `json:"country"`
	City    string `json:"city"`

	// Professional Info
	Profession      string `json:"profession" binding:"required"` // Yoga Therapist, Doctor, etc.
	YearsExperience int    `json:"years_experience"`
	Bio             string `json:"bio"`

	// Verification Data
	Credentials datatypes.JSON `json:"credentials"` // Array of strings (Degree, Cert names)
	Documents   datatypes.JSON `json:"documents"`   // Array of objects {name, url, type}

	// Status
	Status          string    `json:"status" gorm:"default:'pending'"` // pending, approved, rejected
	RejectionReason string    `json:"rejection_reason"`
	ReviewedBy      uint      `json:"reviewed_by"` // Admin ID
	ReviewedAt      time.Time `json:"reviewed_at"`

	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}
