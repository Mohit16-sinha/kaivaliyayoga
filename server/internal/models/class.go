package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

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
