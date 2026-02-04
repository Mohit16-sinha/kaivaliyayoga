package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Service defines what professionals offer
type Service struct {
	ID             uuid.UUID    `json:"id" gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	ProfessionalID uuid.UUID    `json:"professional_id" gorm:"type:uuid;not null"`
	Professional   Professional `json:"-" gorm:"foreignKey:ProfessionalID"`

	Name            string `json:"name"`
	Description     string `json:"description"`
	DurationMinutes int    `json:"duration_minutes"`

	// Pricing
	PriceCents int    `json:"price_cents"`
	Currency   string `json:"currency"`

	ServiceType    string `json:"service_type"`    // consultation, therapy, class
	DeliveryMethod string `json:"delivery_method"` // online, in-person

	IsActive bool `json:"is_active" gorm:"default:true"`

	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

// Appointment represents a booking between a client and professional
type Appointment struct {
	ID            uuid.UUID `json:"id" gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	ReferenceCode string    `json:"reference_code" gorm:"unique;not null"`

	ClientID uint `json:"client_id" gorm:"not null"`
	Client   User `json:"client" gorm:"foreignKey:ClientID"`

	ProfessionalID uuid.UUID    `json:"professional_id" gorm:"type:uuid;not null"`
	Professional   Professional `json:"professional" gorm:"foreignKey:ProfessionalID"`

	ServiceID uuid.UUID `json:"service_id" gorm:"type:uuid;not null"`
	Service   Service   `json:"service" gorm:"foreignKey:ServiceID"`

	StartTime time.Time `json:"start_time"`
	EndTime   time.Time `json:"end_time"`
	Timezone  string    `json:"timezone"`

	Status string `json:"status"` // pending, confirmed, completed, cancelled, no_show

	// Payment
	PriceChargedCents         int    `json:"price_charged_cents"`
	CurrencyCharged           string `json:"currency_charged"`
	PaymentStatus             string `json:"payment_status"` // unpaid, paid, refunded
	StripePaymentIntentID     string `json:"stripe_payment_intent_id"`
	PlatformFeeCents          int    `json:"platform_fee_cents"`
	ProfessionalEarningsCents int    `json:"professional_earnings_cents"`

	// Meeting
	MeetingLink        string `json:"meeting_link"`
	ClientNotes        string `json:"client_notes"`
	ProfessionalNotes  string `json:"professional_notes"`
	CancellationReason string `json:"cancellation_reason"`

	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

// Review represents a user review for a professional
type Review struct {
	ID            uuid.UUID `json:"id" gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	AppointmentID uuid.UUID `json:"appointment_id" gorm:"type:uuid;unique;not null"`
	// Link to appointment ensures verified booking

	ClientID uint `json:"client_id" gorm:"not null"`
	Client   User `json:"client" gorm:"foreignKey:ClientID"`

	ProfessionalID uuid.UUID    `json:"professional_id" gorm:"type:uuid;not null"`
	Professional   Professional `json:"-" gorm:"foreignKey:ProfessionalID"`

	Rating   float64 `json:"rating"` // 1.0 to 5.0
	Comment  string  `json:"comment"`
	IsPublic bool    `json:"is_public" gorm:"default:true"`

	CreatedAt time.Time `json:"created_at"`
}

// Message represents in-platform chat
type Message struct {
	ID uuid.UUID `json:"id" gorm:"type:uuid;default:gen_random_uuid();primaryKey"`

	SenderID uint `json:"sender_id" gorm:"not null"`
	Sender   User `json:"sender" gorm:"foreignKey:SenderID"`

	RecipientID uint `json:"recipient_id" gorm:"not null"`
	Recipient   User `json:"recipient" gorm:"foreignKey:RecipientID"`

	Content       string `json:"content"`
	AttachmentURL string `json:"attachment_url"`

	IsRead bool      `json:"is_read" gorm:"default:false"`
	ReadAt time.Time `json:"read_at"`

	CreatedAt time.Time      `json:"created_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}
