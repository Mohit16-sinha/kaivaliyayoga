package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// --- Constants (Test Credentials) ---
const (
	// RazorpayKeyID     = "rzp_test_Ry9n9CKJV1BqB3"
	// RazorpayKeySecret = "gYXAIu1KEMBsI6tOBpzoncUL"
	StripePublishableKey = "pk_test_placeholder"
)

// --- Model ---
type Payment struct {
	ID        uint   `json:"id" gorm:"primaryKey"`
	UserID    uint   `json:"user_id" gorm:"index"`
	User      User   `json:"user" gorm:"foreignKey:UserID"`
	OrderID   string `json:"order_id" gorm:"index"`
	PaymentID string `json:"payment_id" gorm:"index"`
	Signature string `json:"-"`

	// Multi-Currency Fields
	BaseAmountAUD float64 `json:"base_amount_aud"` // The reference price in AUD
	Amount        float64 `json:"amount"`          // Charged amount in user's currency
	Currency      string  `json:"currency"`        // User's currency code (e.g. INR)
	ExchangeRate  float64 `json:"exchange_rate"`   // Rate used at time of transaction
	CountryCode   string  `json:"country_code"`    // ISO country code (e.g. IN)

	Method string `json:"method"` // card, upi, etc.
	Status string `json:"status"` // created, success, failed

	// Razorpay fields (Legacy/Disabled)
	RazorpayPaymentID string `json:"razorpay_payment_id"`

	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

// --- DTO ---
type CreateOrderInput struct {
	Amount        float64 `json:"amount" binding:"required"`
	Currency      string  `json:"currency" binding:"required"`
	BaseAmountAUD float64 `json:"base_amount_aud"`
	CountryCode   string  `json:"country_code"`
}

type VerifyPaymentInput struct {
	OrderID   string `json:"order_id" binding:"required"`
	PaymentID string `json:"payment_id"` // Generic
	// RazorpayPaymentID string `json:"razorpay_payment_id"`
	// RazorpaySignature string `json:"razorpay_signature"`
}

// --- Handlers ---

// CreateOrder - Protected - Creates a Payment Intent (Placeholder for Stripe)
func CreateOrder(c *gin.Context) {
	// RAZORPAY DISABLED
	/*
		userID, _ := c.Get("userID")

		var input CreateOrderInput
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		client := razorpay.NewClient(RazorpayKeyID, RazorpayKeySecret)

		data := map[string]interface{}{
			"amount":   int(input.Amount * 100), // Amount in paise
			"currency": input.Currency,
			"receipt":  "receipt_order_123", // You might want to generate unique receipt IDs
		}

		body, err := client.Order.Create(data, nil)
		if err != nil {
			fmt.Println("RAZORPAY ERROR:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order", "details": err.Error()})
			return
		}

		orderID := body["id"].(string)

		// Safely convert userID
		var uid uint
		if idFloat, ok := userID.(float64); ok {
			uid = uint(idFloat)
		} else if idUint, ok := userID.(uint); ok {
			uid = idUint
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID in context"})
			return
		}

		// Save initial payment record
		payment := Payment{
			UserID:   uid,
			OrderID:  orderID,
			Amount:   input.Amount,
			Currency: input.Currency,
			Status:   "created",
		}
		db.Create(&payment)

		c.JSON(http.StatusOK, gin.H{
			"order_id": orderID,
			"key_id":   RazorpayKeyID,
			"amount":   input.Amount * 100,
			"currency": input.Currency,
		})
	*/

	c.JSON(http.StatusOK, gin.H{
		"message": "Payment system is currently being upgraded to support global currencies.",
		"status":  "coming_soon",
	})
}

// VerifyPayment - Protected - Verifies Signature and Updates Status
func VerifyPayment(c *gin.Context) {
	// RAZORPAY DISABLED
	/*
		var input VerifyPaymentInput
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Verify Signature
		// HMAC SHA256 of (order_id + "|" + razorpay_payment_id) using secret
		data := input.OrderID + "|" + input.RazorpayPaymentID
		h := hmac.New(sha256.New, []byte(RazorpayKeySecret))
		h.Write([]byte(data))
		expectedSignature := hex.EncodeToString(h.Sum(nil))

		if expectedSignature != input.RazorpaySignature {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid signature"})
			return
		}

		// Update Payment Record
		var payment Payment
		if err := db.Where("order_id = ?", input.OrderID).First(&payment).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
			return
		}

		payment.Status = "success"
		payment.RazorpayPaymentID = input.RazorpayPaymentID
		payment.Signature = input.RazorpaySignature
		payment.PaymentID = input.RazorpayPaymentID // Redundant but explicit
		db.Save(&payment)

		c.JSON(http.StatusOK, gin.H{"message": "Payment verified", "payment_id": payment.ID})
	*/

	fmt.Println("Verify Payment called (Placeholder)")
	c.JSON(http.StatusOK, gin.H{"message": "Payment verified (Simulation)"})
}

// GetMyPayments - Protected - History
func GetMyPayments(c *gin.Context) {
	userID, _ := c.Get("userID")
	var payments []Payment
	db.Where("user_id = ?", userID).Order("created_at desc").Find(&payments)
	c.JSON(http.StatusOK, payments)
}
