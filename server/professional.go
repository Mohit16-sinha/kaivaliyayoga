package main

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

// Professional stores profile data for service providers (Yoga Therapists, Doctors, etc.)
type Professional struct {
	ID     uuid.UUID `json:"id" gorm:"type:uuid;default:gen_random_uuid();primaryKey"` // Postgres 13+
	UserID uint      `json:"user_id" gorm:"unique;not null"`
	User   User      `json:"-" gorm:"foreignKey:UserID"`

	Slug             string `json:"slug" gorm:"unique"`
	Title            string `json:"title"`
	Bio              string `json:"bio"`
	ProfessionalType string `json:"professional_type"` // yoga_therapist, nurse, nutritionist, psychologist, doctor, other

	// Location & Delivery
	Country   string         `json:"country"`
	City      string         `json:"city"`
	Latitude  float64        `json:"latitude"`
	Longitude float64        `json:"longitude"`
	Languages datatypes.JSON `json:"languages"` // Array of strings e.g. ["English", "Spanish"]

	// Verification & Stats
	YearsExperience    int     `json:"years_experience"`
	Rating             float64 `json:"rating"`
	ReviewCount        int     `json:"review_count"`
	IsFeatured         bool    `json:"is_featured"`
	VerificationStatus string  `json:"verification_status" gorm:"default:'pending'"` // pending, approved, rejected, needs_info

	// Specific Fields (JSONB for flexibility)
	// Yoga: { "ryt_level": "500", "styles": ["Hatha", "Vinyasa"] }
	// Doctor: { "license_number": "...", "specialization": "Cardiology" }
	Metadata datatypes.JSON `json:"metadata"`

	// Relationships
	Services       []Service                   `json:"services" gorm:"foreignKey:ProfessionalID"`
	Availability   []ProfessionalAvailability  `json:"availability" gorm:"foreignKey:ProfessionalID"`
	Certifications []ProfessionalCertification `json:"certifications" gorm:"foreignKey:ProfessionalID"`

	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

// ProfessionalCertification stores verification documents
type ProfessionalCertification struct {
	ID             uuid.UUID    `json:"id" gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	ProfessionalID uuid.UUID    `json:"professional_id" gorm:"type:uuid;not null"`
	Professional   Professional `json:"-" gorm:"foreignKey:ProfessionalID"`

	Name          string    `json:"name"`      // e.g. "Medical License"
	Authority     string    `json:"authority"` // e.g. "Medical Board of California"
	LicenseNumber string    `json:"license_number"`
	IssuedDate    time.Time `json:"issued_date"`
	ExpiryDate    time.Time `json:"expiry_date"`
	DocumentURL   string    `json:"document_url"`
	IsVerified    bool      `json:"is_verified" gorm:"default:false"`
	VerifiedAt    time.Time `json:"verified_at"`

	CreatedAt time.Time `json:"created_at"`
}

// ProfessionalAvailability stores weekly recurring schedules
type ProfessionalAvailability struct {
	ID             uuid.UUID    `json:"id" gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	ProfessionalID uuid.UUID    `json:"professional_id" gorm:"type:uuid;not null"`
	Professional   Professional `json:"-" gorm:"foreignKey:ProfessionalID"`

	DayOfWeek    int       `json:"day_of_week"` // 0=Sunday
	StartTime    string    `json:"start_time"`  // "09:00"
	EndTime      string    `json:"end_time"`    // "17:00"
	Timezone     string    `json:"timezone"`
	IsRecurring  bool      `json:"is_recurring" gorm:"default:true"`
	SpecificDate time.Time `json:"specific_date"` // If not recurring

	CreatedAt time.Time `json:"created_at"`
}
