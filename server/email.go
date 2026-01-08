package main

import (
	"bytes"
	"fmt"
	"html/template"
	"log"
	"os"
	"strconv"
	"strings"

	"gopkg.in/gomail.v2"
)

// EmailJob struct for the queue
type EmailJob struct {
	To      string
	Subject string
	Html    string
}

// Queue
var emailQueue = make(chan EmailJob, 100)

// StartEmailWorker - Background worker to process emails
func _startEmailWorkerFromInit() {
	go func() {
		for job := range emailQueue {
			sendEmailInternal(job)
		}
	}()
}

// Internal sender using gomail
func sendEmailInternal(job EmailJob) {
	host := os.Getenv("SMTP_HOST")
	portStr := os.Getenv("SMTP_PORT")
	user := os.Getenv("SMTP_USER")
	pass := os.Getenv("SMTP_PASSWORD")
	from := os.Getenv("SMTP_FROM")

	if host == "" {
		host = "smtp.gmail.com" // Default
	}
	if portStr == "" {
		portStr = "587" // Default
	}
	if from == "" {
		from = user // Fallback
	}

	// Sanitize App Password (remove spaces)
	pass = strings.ReplaceAll(pass, " ", "")

	port, _ := strconv.Atoi(portStr)

	m := gomail.NewMessage()
	m.SetHeader("From", from)
	m.SetHeader("To", job.To)
	m.SetHeader("Subject", job.Subject)
	m.SetBody("text/html", job.Html)

	d := gomail.NewDialer(host, port, user, pass)

	if err := d.DialAndSend(m); err != nil {
		log.Printf("ERROR: Failed to send email to %s: %v\n", job.To, err)
	} else {
		log.Printf("INFO: Email sent to %s: %s\n", job.To, job.Subject)
	}
}

// InitEmailService starts the worker
func InitEmailService() {
	fmt.Println("Starting Email Worker...")
	_startEmailWorkerFromInit()
}

// --- PUBLIC SENDERS ---

// 1. Welcome Email
func SendWelcomeEmail(to string, name string) {
	tmpl := `
	<div style="font-family: sans-serif; padding: 20px; color: #333;">
		<h2 style="color: #2E7D32;">Welcome to Kaivaliya Yoga! 🌿</h2>
		<p>Namaste <strong>{{.Name}}</strong>,</p>
		<p>We are thrilled to have you join our community. Your journey to wellness begins here.</p>
		<p>You can now book classes, enroll in courses, and purchase memberships.</p>
		<a href="http://localhost:5173/profile" style="background: #2E7D32; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Profile</a>
	</div>`

	html := parseTemplate(tmpl, map[string]string{"Name": name})
	emailQueue <- EmailJob{To: to, Subject: "Welcome to Kaivaliya Yoga", Html: html}
}

// 2. Booking Confirmation
func SendBookingConfirmation(to string, name string, className string, time string) {
	tmpl := `
	<div style="font-family: sans-serif; padding: 20px; color: #333;">
		<h2 style="color: #2E7D32;">Booking Confirmed! ✅</h2>
		<p>Hi <strong>{{.Name}}</strong>,</p>
		<p>Your spot is reserved for:</p>
		<div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 10px 0;">
			<h3 style="margin: 0;">{{.ClassName}}</h3>
			<p style="margin: 5px 0;">⏰ {{.Time}}</p>
		</div>
		<p>Please arrive 10 minutes early. See you on the mat!</p>
	</div>`

	html := parseTemplate(tmpl, map[string]string{"Name": name, "ClassName": className, "Time": time})
	emailQueue <- EmailJob{To: to, Subject: "Booking Confirmed: " + className, Html: html}
}

// 2b. Booking Cancellation
func SendBookingCancellation(to string, name string, className string, time string) {
	tmpl := `
	<div style="font-family: sans-serif; padding: 20px; color: #333;">
		<h2 style="color: #D32F2F;">Booking Cancelled ❌</h2>
		<p>Hi <strong>{{.Name}}</strong>,</p>
		<p>Your booking has been cancelled as requested.</p>
		<div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 10px 0;">
			<h3 style="margin: 0;">{{.ClassName}}</h3>
			<p style="margin: 5px 0;">⏰ {{.Time}}</p>
		</div>
		<p>We hope to see you in another class soon!</p>
	</div>`

	html := parseTemplate(tmpl, map[string]string{"Name": name, "ClassName": className, "Time": time})
	emailQueue <- EmailJob{To: to, Subject: "Booking Cancelled: " + className, Html: html}
}

// 2c. Class Reminder
func SendClassReminder(to string, name string, className string, time string) {
	tmpl := `
	<div style="font-family: sans-serif; padding: 20px; color: #333;">
		<h2 style="color: #1976D2;">Class Reminder 🔔</h2>
		<p>Hi <strong>{{.Name}}</strong>,</p>
		<p>Just a friendly reminder that you have a class coming up soon!</p>
		<div style="background: #E3F2FD; padding: 15px; border-radius: 8px; margin: 10px 0;">
			<h3 style="margin: 0;">{{.ClassName}}</h3>
			<p style="margin: 5px 0;">⏰ {{.Time}}</p>
		</div>
		<p>Don't forget your mat!</p>
	</div>`

	html := parseTemplate(tmpl, map[string]string{"Name": name, "ClassName": className, "Time": time})
	emailQueue <- EmailJob{To: to, Subject: "Reminder: " + className, Html: html}
}

// 3. Payment Receipt
func SendPaymentReceipt(to string, name string, amount string, orderId string) {
	tmpl := `
	<div style="font-family: sans-serif; padding: 20px; color: #333;">
		<h2 style="color: #2E7D32;">Payment Receipt 🧾</h2>
		<p>Hi <strong>{{.Name}}</strong>,</p>
		<p>Thank you for your payment.</p>
		<table style="width: 100%; text-align: left;">
			<tr><th>Order ID</th><td>{{.OrderId}}</td></tr>
			<tr><th>Amount</th><td>₹{{.Amount}}</td></tr>
			<tr><th>Status</th><td style="color: green;">Success</td></tr>
		</table>
	</div>`

	html := parseTemplate(tmpl, map[string]string{"Name": name, "Amount": amount, "OrderId": orderId})
	emailQueue <- EmailJob{To: to, Subject: "Payment Receipt - Kaivaliya Yoga", Html: html}
}

// Helper
func parseTemplate(tmplStr string, data interface{}) string {
	t, err := template.New("email").Parse(tmplStr)
	if err != nil {
		return "Error parsing template"
	}
	var buf bytes.Buffer
	if err := t.Execute(&buf, data); err != nil {
		return "Error executing template"
	}
	return buf.String()
}
