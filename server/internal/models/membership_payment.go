package models

import (
	"time"

	"gorm.io/gorm"
)

type Payment struct {
	ID        uint    `json:"id" gorm:"primaryKey"`
	UserID    uint    `json:"user_id"`
	Amount    float64 `json:"amount"`
	Currency  string  `json:"currency"`
	OrderID   string  `json:"order_id"`
	PaymentID string  `json:"payment_id"`
	Signature string  `json:"signature"`
	Status    string  `json:"status"` // created, success, failed

	// Multi-currency fields
	BaseAmountAUD float64 `json:"base_amount_aud"`
	ExchangeRate  float64 `json:"exchange_rate"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Membership struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	UserID    uint      `json:"user_id" gorm:"index"`
	Type      string    `json:"type"` // "drop_in", "monthly", "quarterly"
	StartDate time.Time `json:"start_date"`
	EndDate   time.Time `json:"end_date"`
	Credits   int       `json:"credits"`                       // 1 for drop-in, -1 for unlimited
	Status    string    `json:"status"`                        // "active", "expired"
	PaymentID uint      `json:"payment_id" gorm:"uniqueIndex"` // One membership per payment

	// Multi-Currency Audit
	BasePriceAUD    float64 `json:"base_price_aud"`
	ChargedAmount   float64 `json:"charged_amount"`
	ChargedCurrency string  `json:"charged_currency"`
	ExchangeRate    float64 `json:"exchange_rate"`

	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}
