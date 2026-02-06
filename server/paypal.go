package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

// PayPal API URLs
var paypalBaseURL string

func initPayPal() {
	if os.Getenv("PAYPAL_MODE") == "live" {
		paypalBaseURL = "https://api-m.paypal.com"
	} else {
		paypalBaseURL = "https://api-m.sandbox.paypal.com"
	}
	fmt.Printf("PayPal initialized in %s mode\n", os.Getenv("PAYPAL_MODE"))
}

// --- PayPal DTOs ---
type PayPalOrderInput struct {
	Amount      float64 `json:"amount" binding:"required"`
	Currency    string  `json:"currency" binding:"required"` // USD, EUR, GBP, etc.
	Description string  `json:"description"`
}

type PayPalCaptureInput struct {
	OrderID string `json:"order_id" binding:"required"`
}

// --- PayPal Token Cache ---
var paypalAccessToken string
var paypalTokenExpiry time.Time

// getPayPalAccessToken fetches a new access token or returns cached one
func getPayPalAccessToken() (string, error) {
	// Check if we have a valid cached token
	if paypalAccessToken != "" && time.Now().Before(paypalTokenExpiry) {
		return paypalAccessToken, nil
	}

	// Fetch new token
	tokenURL := paypalBaseURL + "/v1/oauth2/token"

	data := url.Values{}
	data.Set("grant_type", "client_credentials")

	req, err := http.NewRequest("POST", tokenURL, strings.NewReader(data.Encode()))
	if err != nil {
		return "", err
	}

	req.SetBasicAuth(os.Getenv("PAYPAL_CLIENT_ID"), os.Getenv("PAYPAL_SECRET"))
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("PayPal token error: %s", string(body))
	}

	var tokenRes struct {
		AccessToken string `json:"access_token"`
		ExpiresIn   int    `json:"expires_in"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&tokenRes); err != nil {
		return "", err
	}

	// Cache the token with a small buffer before expiry
	paypalAccessToken = tokenRes.AccessToken
	paypalTokenExpiry = time.Now().Add(time.Duration(tokenRes.ExpiresIn-60) * time.Second)

	return paypalAccessToken, nil
}

// --- PayPal Handlers ---

// CreatePayPalOrder - Protected - Creates a PayPal Order
func CreatePayPalOrder(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var input PayPalOrderInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate currency (PayPal supported currencies)
	supportedCurrencies := map[string]bool{
		"USD": true, "EUR": true, "GBP": true, "AUD": true, "CAD": true,
		"JPY": true, "CNY": true, "CHF": true, "NZD": true, "SGD": true,
	}
	currency := strings.ToUpper(input.Currency)
	if !supportedCurrencies[currency] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unsupported currency"})
		return
	}

	// Get access token
	accessToken, err := getPayPalAccessToken()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to authenticate with PayPal", "details": err.Error()})
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
	default:
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID"})
		return
	}

	// Create PayPal order
	orderURL := paypalBaseURL + "/v2/checkout/orders"
	orderData := map[string]interface{}{
		"intent": "CAPTURE",
		"purchase_units": []map[string]interface{}{
			{
				"reference_id": fmt.Sprintf("user_%d_%d", uid, time.Now().Unix()),
				"description":  input.Description,
				"amount": map[string]interface{}{
					"currency_code": currency,
					"value":         fmt.Sprintf("%.2f", input.Amount),
				},
			},
		},
		"application_context": map[string]interface{}{
			"brand_name":          "Kaivalya Yoga",
			"landing_page":        "NO_PREFERENCE",
			"user_action":         "PAY_NOW",
			"shipping_preference": "NO_SHIPPING",
		},
	}

	body, _ := json.Marshal(orderData)
	req, err := http.NewRequest("POST", orderURL, bytes.NewReader(body))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create request"})
		return
	}

	req.Header.Set("Authorization", "Bearer "+accessToken)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 15 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to connect to PayPal"})
		return
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)

	if resp.StatusCode != http.StatusCreated {
		fmt.Println("PAYPAL ERROR:", string(respBody))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create PayPal order"})
		return
	}

	var orderRes map[string]interface{}
	json.Unmarshal(respBody, &orderRes)

	orderID := orderRes["id"].(string)

	// Save to DB
	payment := Payment{
		UserID:   uid,
		OrderID:  orderID,
		Amount:   input.Amount,
		Currency: currency,
		Method:   "paypal",
		Status:   "created",
	}
	db.Create(&payment)

	c.JSON(http.StatusOK, gin.H{
		"order_id":   orderID,
		"payment_id": payment.ID,
	})
}

// CapturePayPalOrder - Protected - Captures a PayPal Order after approval
func CapturePayPalOrder(c *gin.Context) {
	orderID := c.Param("orderId")
	if orderID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Order ID required"})
		return
	}

	// Get access token
	accessToken, err := getPayPalAccessToken()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to authenticate with PayPal"})
		return
	}

	// Capture the order
	captureURL := fmt.Sprintf("%s/v2/checkout/orders/%s/capture", paypalBaseURL, orderID)

	req, err := http.NewRequest("POST", captureURL, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create request"})
		return
	}

	req.Header.Set("Authorization", "Bearer "+accessToken)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 15 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to connect to PayPal"})
		return
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)
	fmt.Println("PAYPAL CAPTURE RESPONSE:", string(respBody)) // Debug log

	if resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusOK {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "PayPal capture failed upstream",
			"details": string(respBody),
		})
		return
	}

	var captureRes map[string]interface{}
	if err := json.Unmarshal(respBody, &captureRes); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse PayPal response"})
		return
	}

	status, ok := captureRes["status"].(string)
	if !ok {
		// Handle case where status is missing or not a string
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid PayPal response format", "response": captureRes})
		return
	}

	if status == "COMPLETED" {
		// Update payment record
		var payment Payment
		if err := db.Where("order_id = ?", orderID).First(&payment).Error; err == nil {
			payment.Status = "success"
			payment.PaymentID = captureRes["id"].(string) // Use capture ID
			db.Save(&payment)
		}

		c.JSON(http.StatusOK, gin.H{
			"message":    "Payment captured successfully",
			"status":     "success",
			"payment_id": payment.ID,
		})
	} else {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":  "Payment capture failed",
			"status": status,
		})
	}
}

// GetPayPalConfig - Public - Returns PayPal client ID for frontend
func GetPayPalConfig(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"client_id": os.Getenv("PAYPAL_CLIENT_ID"),
		"mode":      os.Getenv("PAYPAL_MODE"),
	})
}
