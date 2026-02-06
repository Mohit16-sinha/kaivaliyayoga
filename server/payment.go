package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	razorpay "github.com/razorpay/razorpay-go"
	"gorm.io/gorm"
)

// --- Razorpay Client ---
var razorpayClient *razorpay.Client

func initRazorpay() {
	razorpayClient = razorpay.NewClient(
		os.Getenv("RAZORPAY_KEY_ID"),
		os.Getenv("RAZORPAY_KEY_SECRET"),
	)
}

// --- Model ---
type Payment struct {
	ID        uint   `json:"id" gorm:"primaryKey"`
	UserID    uint   `json:"user_id" gorm:"index"`
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

	// Razorpay fields
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
	OrderID           string `json:"order_id" binding:"required"`
	RazorpayPaymentID string `json:"razorpay_payment_id" binding:"required"`
	RazorpaySignature string `json:"razorpay_signature" binding:"required"`
}

// --- Handlers ---

// CreateRazorpayOrder - Protected - Creates a Razorpay Order
func CreateRazorpayOrder(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var input CreateOrderInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Safely convert userID
	var uid uint
	switch v := userID.(type) {
	case float64:
		uid = uint(v)
	case uint:
		uid = v
	case int:
		uid = uint(v)
	case string:
		// Handle string userID (shouldn't happen but just in case)
		var parsed int
		fmt.Sscanf(v, "%d", &parsed)
		uid = uint(parsed)
	default:
		fmt.Printf("Unknown userID type: %T value: %v\n", userID, userID)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID type"})
		return
	}

	// Create Razorpay order
	data := map[string]interface{}{
		"amount":   int(input.Amount * 100), // Amount in paise
		"currency": "INR",
		"receipt":  fmt.Sprintf("order_%d_%d", uid, time.Now().Unix()),
	}

	order, err := razorpayClient.Order.Create(data, nil)
	if err != nil {
		fmt.Println("RAZORPAY ERROR:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order", "details": err.Error()})
		return
	}

	orderID := order["id"].(string)

	// DEBUG: Print the uid value
	fmt.Printf("DEBUG: Creating payment - userID type=%T, value=%v, uid=%d\n", userID, userID, uid)

	// Save initial payment record
	payment := Payment{
		UserID:        uid,
		OrderID:       orderID,
		Amount:        input.Amount,
		Currency:      "INR",
		BaseAmountAUD: input.BaseAmountAUD,
		CountryCode:   input.CountryCode,
		Status:        "created",
	}
	fmt.Printf("DEBUG: Payment struct - UserID=%d, OrderID=%s, Amount=%f\n", payment.UserID, payment.OrderID, payment.Amount)
	if err := db.Create(&payment).Error; err != nil {
		fmt.Println("DB ERROR:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save payment record"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"order_id":   orderID,
		"key_id":     os.Getenv("RAZORPAY_KEY_ID"),
		"amount":     int(input.Amount * 100),
		"currency":   "INR",
		"payment_id": payment.ID,
	})
}

// VerifyRazorpayPayment - Protected - Verifies Signature and Updates Status
func VerifyRazorpayPayment(c *gin.Context) {
	var input VerifyPaymentInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verify Signature using HMAC SHA256
	// Signature = HMAC-SHA256(order_id + "|" + razorpay_payment_id, secret)
	data := input.OrderID + "|" + input.RazorpayPaymentID
	h := hmac.New(sha256.New, []byte(os.Getenv("RAZORPAY_KEY_SECRET")))
	h.Write([]byte(data))
	expectedSignature := hex.EncodeToString(h.Sum(nil))

	if expectedSignature != input.RazorpaySignature {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payment signature"})
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
	payment.PaymentID = input.RazorpayPaymentID
	db.Save(&payment)

	c.JSON(http.StatusOK, gin.H{
		"message":    "Payment verified successfully",
		"payment_id": payment.ID,
		"status":     "success",
	})
}

// GetMyPayments - Protected - Get payment history for user
func GetMyPayments(c *gin.Context) {
	userID, _ := c.Get("userID")

	var uid uint
	switch v := userID.(type) {
	case float64:
		uid = uint(v)
	case uint:
		uid = v
	case int:
		uid = uint(v)
	}

	var payments []Payment
	db.Where("user_id = ?", uid).Order("created_at desc").Find(&payments)
	c.JSON(http.StatusOK, payments)
}

// GetRazorpayKey - Public - Returns publishable key for frontend
func GetRazorpayKey(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"key_id": os.Getenv("RAZORPAY_KEY_ID"),
	})
}
