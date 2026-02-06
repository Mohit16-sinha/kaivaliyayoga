package main

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jung-kurt/gofpdf"
)

// GenerateInvoice generates a PDF invoice for a specific payment
func GenerateInvoice(c *gin.Context) {
	idPos := c.Param("id")
	fmt.Printf("DEBUG: GenerateInvoice called for ID: %s\n", idPos)

	paymentID, err := strconv.Atoi(idPos)
	if err != nil {
		fmt.Println("DEBUG: Invalid payment ID format")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payment ID"})
		return
	}

	// Fetch payment with User details
	var payment Payment
	// Note: We removed the FK constraint but we can still preload if we add the relationship back correctly or just do a manual join/lookup.
	// Since we removed 'User' from Payment struct to fix the circle, we must fetch User manually.
	if err := db.First(&payment, paymentID).Error; err != nil {
		fmt.Printf("DEBUG: Payment %d not found: %v\n", paymentID, err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Payment not found"})
		return
	}

	// Manual fetch user
	var user User
	if err := db.First(&user, payment.UserID).Error; err != nil {
		// Log error but continue with unknown user? or fail
		fmt.Printf("User not found for payment %d\n", payment.ID)
		user.Name = "Unknown User"
		user.Email = "N/A"
	}

	// Create PDF
	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.AddPage()
	pdf.SetFont("Arial", "B", 16)

	// Header
	pdf.Cell(40, 10, "Kaivalya Yoga Studio")
	pdf.Ln(10)
	pdf.SetFont("Arial", "", 12)
	pdf.Cell(40, 10, "Invoice")
	pdf.Ln(20)

	// Bill To
	pdf.SetFont("Arial", "B", 12)
	pdf.Cell(40, 10, "Bill To:")
	pdf.Ln(6)
	pdf.SetFont("Arial", "", 12)
	pdf.Cell(40, 6, user.Name)
	pdf.Ln(6)
	pdf.Cell(40, 6, user.Email)
	pdf.Ln(20)

	// Invoice Details
	pdf.Cell(40, 6, fmt.Sprintf("Invoice #: %d", payment.ID))
	pdf.Ln(6)
	pdf.Cell(40, 6, fmt.Sprintf("Date: %s", payment.CreatedAt.Format("2006-01-02")))
	pdf.Ln(6)
	pdf.Cell(40, 6, fmt.Sprintf("Order ID: %s", payment.OrderID))
	pdf.Ln(20)

	// Line Items Header
	pdf.SetFillColor(240, 240, 240)
	pdf.SetFont("Arial", "B", 12)
	pdf.CellFormat(120, 10, "Description", "1", 0, "", true, 0, "")
	pdf.CellFormat(60, 10, "Amount", "1", 1, "R", true, 0, "")

	// Line Items
	pdf.SetFont("Arial", "", 12)
	desc := "Payment for Services" // Could be more specific if we looked up Booking/Membership
	pdf.CellFormat(120, 10, desc, "1", 0, "", false, 0, "")
	pdf.CellFormat(60, 10, fmt.Sprintf("%.2f %s", payment.Amount, payment.Currency), "1", 1, "R", false, 0, "")

	// Total
	pdf.SetFont("Arial", "B", 12)
	pdf.CellFormat(120, 10, "Total", "1", 0, "R", false, 0, "")
	pdf.CellFormat(60, 10, fmt.Sprintf("%.2f %s", payment.Amount, payment.Currency), "1", 1, "R", false, 0, "")

	// Footer
	pdf.SetY(-30)
	pdf.SetFont("Arial", "I", 8)
	pdf.Cell(0, 10, "Thank you for your business!")

	// Output to response
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=invoice_%d.pdf", payment.ID))
	c.Header("Content-Type", "application/pdf")

	err = pdf.Output(c.Writer)
	if err != nil {
		fmt.Println("PDF Generation Error:", err)
		// Usually can't send JSON error here as headers might be sent
	}
}
