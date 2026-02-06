package main

import (
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// --- Model ---
type Booking struct {
	ID        uint  `json:"id" gorm:"primaryKey"`
	UserID    uint  `json:"user_id" gorm:"index"`
	User      User  `json:"user" gorm:"foreignKey:UserID"`
	ClassID   uint  `json:"class_id" gorm:"index"`
	Class     Class `json:"class" gorm:"foreignKey:ClassID"`
	PaymentID *uint `json:"payment_id" gorm:"index"` // Nullable if using membership
	// Note: No Payment relationship here to avoid FK constraint issues
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

// --- DTO ---
type BookingInput struct {
	ClassID   uint  `json:"class_id" binding:"required"`
	PaymentID *uint `json:"payment_id"` // Optional
}

// --- Handlers ---

// CreateBooking - Protected - Book a class
func CreateBooking(c *gin.Context) {
	userID, _ := c.Get("userID")

	var input BookingInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var uid uint

	// Transaction to ensure data integrity
	err := db.Transaction(func(tx *gorm.DB) error {
		// Safe UID conversion
		if idFloat, ok := userID.(float64); ok {
			uid = uint(idFloat)
		} else if idUint, ok := userID.(uint); ok {
			uid = idUint
		} else {
			return errors.New("invalid user id type")
		}

		var class Class
		if err := tx.First(&class, input.ClassID).Error; err != nil {
			return errors.New("class not found")
		}

		// Check capacity
		var count int64
		tx.Model(&Booking{}).Where("class_id = ? AND status = ?", input.ClassID, "confirmed").Count(&count)
		if count >= int64(class.Capacity) {
			return errors.New("class is full")
		}

		// Check double booking
		var existingBooking Booking
		if err := tx.Where("user_id = ? AND class_id = ? AND status = ?", uid, input.ClassID, "confirmed").First(&existingBooking).Error; err == nil {
			return errors.New("already booked this class")
		}

		// 1. Check Active Membership
		var memberships []Membership
		if err := tx.Where("user_id = ? AND status = ?", uid, "active").Order("end_date asc").Find(&memberships).Error; err == nil {
			for i := range memberships {
				mem := &memberships[i]

				// Check Expiration
				if time.Now().After(mem.EndDate) {
					mem.Status = "expired"
					tx.Save(mem)
					continue
				}

				// Check Credits
				if mem.Credits == -1 {
					// Unlimited Membership (Monthly/Quarterly)
					booking := Booking{
						UserID:       uid,
						ClassID:      input.ClassID,
						Status:       "confirmed",
						MembershipID: &mem.ID,
					}
					if err := tx.Create(&booking).Error; err != nil {
						return err
					}
					return nil // Success via Membership

				} else if mem.Credits > 0 {
					// Drop-in / Credit Pack
					mem.Credits -= 1
					if mem.Credits == 0 {
						mem.Status = "expired"
					}
					if err := tx.Save(mem).Error; err != nil {
						return err
					}

					booking := Booking{
						UserID:       uid,
						ClassID:      input.ClassID,
						Status:       "confirmed",
						MembershipID: &mem.ID,
					}
					if err := tx.Create(&booking).Error; err != nil {
						return err
					}
					return nil // Success via Credit
				}
			}
		}

		// 2. Fallback: Pay-Per-Class (Direct Payment)
		if input.PaymentID != nil && *input.PaymentID > 0 {
			// Check Payment
			var payment Payment
			if err := tx.First(&payment, *input.PaymentID).Error; err != nil {
				return errors.New("payment not found")
			}

			if payment.UserID != uid {
				return errors.New("payment does not belong to user")
			}
			if payment.Status != "success" {
				return errors.New("payment not completed")
			}

			// Ensure payment is not already used
			var existingBookingByPayment Booking
			if err := tx.Where("payment_id = ?", *input.PaymentID).First(&existingBookingByPayment).Error; err == nil {
				return errors.New("payment already used for another booking")
			}

			// Create booking
			booking := Booking{
				UserID:    uid,
				ClassID:   input.ClassID,
				PaymentID: input.PaymentID,
				Status:    "confirmed",
			}

			if err := tx.Create(&booking).Error; err != nil {
				return err
			}
			return nil // Success via Payment
		}

		return errors.New("no active membership or valid payment provided")
	})

	if err != nil {
		if err.Error() == "class not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		} else if err.Error() == "class is full" || err.Error() == "already booked this class" {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		} else {
			c.JSON(http.StatusPaymentRequired, gin.H{"error": err.Error()})
		}
		return
	}

	// Send Email Confirmation (Async)
	go func() {
		var user User
		if err := db.Where("id = ?", uid).First(&user).Error; err != nil {
			fmt.Printf("EMAIL ERROR: Could not find user %d: %v\n", uid, err)
			return
		}
		if user.Email == "" {
			fmt.Printf("EMAIL ERROR: User %d has no email\n", uid)
			return
		}
		var class Class
		db.First(&class, input.ClassID)
		fmt.Printf("Sending confirmation to %s for class %s\n", user.Email, class.Name)
		SendBookingConfirmation(user.Email, user.Name, class.Name, class.Day+" "+class.Time)
	}()

	c.JSON(http.StatusCreated, gin.H{"message": "Booking successful"})
}

// GetMyBookings - Protected - List user's bookings
func GetMyBookings(c *gin.Context) {
	userID, _ := c.Get("userID")
	var bookings []Booking
	// Preload Class details
	if err := db.Where("user_id = ?", userID).Preload("Class").Preload("Payment").Find(&bookings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch bookings"})
		return
	}
	c.JSON(http.StatusOK, bookings)
}

// CancelBooking - Protected - Cancel a booking
func CancelBooking(c *gin.Context) {
	userID, _ := c.Get("userID")
	bookingID := c.Param("id")

	var booking Booking
	if err := db.Where("id = ? AND user_id = ?", bookingID, userID).First(&booking).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
		return
	}

	// Check if cancellation is allowed (e.g., specific time logic)
	// For now, just cancel
	booking.Status = "cancelled"
	db.Save(&booking)

	// Send Cancellation Email
	go func() {
		var user User
		// Safely cast userID from context
		var uid uint
		if idFloat, ok := userID.(float64); ok {
			uid = uint(idFloat)
		} else if idUint, ok := userID.(uint); ok {
			uid = idUint
		}

		if db.First(&user, uid).Error == nil {
			var class Class
			db.First(&class, booking.ClassID)
			SendBookingCancellation(user.Email, user.Name, class.Name, class.Day+" "+class.Time)
		}
	}()

	c.JSON(http.StatusOK, gin.H{"message": "Booking cancelled"})
}
