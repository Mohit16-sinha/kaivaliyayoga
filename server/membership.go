package main

import (
	"errors"
	"net/http"
	"time"

	"fmt"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func init() {
	fmt.Println("DEBUG: membership.go is loaded!")
}

// --- Model ---
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

// --- DTO ---
type PurchaseMembershipInput struct {
	PackageType string `json:"package_type" binding:"required"` // drop_in, monthly, quarterly
	PaymentID   uint   `json:"payment_id" binding:"required"`
}

// --- Logic ---

func CalculateMembership(pkgType string) (time.Time, time.Time, int, error) {
	now := time.Now()
	switch pkgType {
	case "drop_in":
		return now, now.AddDate(0, 0, 1), 1, nil // 1 Day val
	case "monthly":
		return now, now.AddDate(0, 1, 0), -1, nil // 30 Days val, Unlimited
	case "quarterly":
		return now, now.AddDate(0, 3, 0), -1, nil // 90 Days val, Unlimited
	default:
		return now, now, 0, errors.New("invalid package type")
	}
}

// --- Handlers ---

// PurchaseMembership - Protected - Convert a payment into a membership
func PurchaseMembership(c *gin.Context) {
	userID, _ := c.Get("userID")
	var input PurchaseMembershipInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Transaction variables to hold data for email
	var paidAmount float64
	var orderID string

	err := db.Transaction(func(tx *gorm.DB) error {
		// 1. Verify Payment
		var payment Payment
		if err := tx.First(&payment, input.PaymentID).Error; err != nil {
			return errors.New("payment not found")
		}
		paidAmount = payment.Amount
		orderID = payment.OrderID

		// Safe UID conversion
		var uid uint
		if idFloat, ok := userID.(float64); ok {
			uid = uint(idFloat)
		} else if idUint, ok := userID.(uint); ok {
			uid = idUint
		} else {
			return errors.New("invalid user id")
		}

		if payment.UserID != uid {
			return errors.New("payment belongs to another user")
		}
		// In production, uncomment checking for success status
		// if payment.Status != "success" {
		// 	return errors.New("payment not successful")
		// }

		// Check if payment already used for a membership
		var existingMem Membership
		if err := tx.Where("payment_id = ?", input.PaymentID).First(&existingMem).Error; err == nil {
			return errors.New("payment already used for membership")
		}

		// 2. Calculate details
		start, end, credits, err := CalculateMembership(input.PackageType)
		if err != nil {
			return err
		}

		// 3. Create Membership with Currency info
		membership := Membership{
			UserID:          uid,
			Type:            input.PackageType,
			StartDate:       start,
			EndDate:         end,
			Credits:         credits,
			Status:          "active",
			PaymentID:       input.PaymentID,
			BasePriceAUD:    payment.BaseAmountAUD,
			ChargedAmount:   payment.Amount,
			ChargedCurrency: payment.Currency,
			ExchangeRate:    payment.ExchangeRate,
		}

		if err := tx.Create(&membership).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Send Payment Receipt Email (Async)
	go func() {
		// fetch User to get email
		var user User
		var uid uint
		if idFloat, ok := userID.(float64); ok {
			uid = uint(idFloat)
		} else if idUint, ok := userID.(uint); ok {
			uid = idUint
		}
		if db.First(&user, uid).Error == nil {
			SendPaymentReceipt(user.Email, user.Name, fmt.Sprintf("%.2f", paidAmount), orderID)
		}
	}()

	c.JSON(http.StatusCreated, gin.H{"message": "Membership purchased successfully"})
}

// GetMyMemberships - Protected - List user's memberships
func GetMyMemberships(c *gin.Context) {
	userID, _ := c.Get("userID")
	var memberships []Membership
	db.Where("user_id = ?", userID).Order("created_at desc").Find(&memberships)
	c.JSON(http.StatusOK, memberships)
}

// ValidateMembership - Protected - Check if user has active membership/credits
func ValidateMembership(c *gin.Context) {
	userID, _ := c.Get("userID")

	var activeMember Membership
	// Find first active membership that is not expired and has credits (or unlimited)
	err := db.Where("user_id = ? AND status = ? AND end_date > ?", userID, "active", time.Now()).
		Where("credits != 0"). // Credits must be > 0 OR -1
		Order("end_date asc"). // Use the one expiring soonest
		First(&activeMember).Error

	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"valid":       false,
			"can_book":    false,
			"reason":      "No active plan found",
			"credits":     0,
			"expiry_date": nil,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"valid":       true,
		"can_book":    true,
		"plan_id":     activeMember.ID,
		"type":        activeMember.Type,
		"credits":     activeMember.Credits,
		"expiry_date": activeMember.EndDate,
	})
}
