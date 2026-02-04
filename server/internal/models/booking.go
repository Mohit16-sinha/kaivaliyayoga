package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Booking struct {
	ID           uint        `json:"id" gorm:"primaryKey"`
	UserID       uint        `json:"user_id" gorm:"index"`
	User         User        `json:"user" gorm:"foreignKey:UserID"`
	ClassID      uint        `json:"class_id" gorm:"index"`
	Class        Class       `json:"class" gorm:"foreignKey:ClassID"`
	PaymentID    *uint       `json:"payment_id" gorm:"index"` // Nullable if using membership
	Payment      *Payment    `json:"payment" gorm:"foreignKey:PaymentID"`
	MembershipID *uint       `json:"membership_id" gorm:"index"` // Nullable if pay-per-class
	Membership   *Membership `json:"membership" gorm:"foreignKey:MembershipID"`

	Status string `json:"status"` // "confirmed", "cancelled"

	// New Marketplace Fields
	AppointmentID      *uuid.UUID `json:"appointment_id" gorm:"type:uuid;index"`
	PaymentAmountCents int        `json:"payment_amount_cents"`
	PaymentCurrency    string     `json:"payment_currency"`
	CancellationReason string     `json:"cancellation_reason"`

	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}
