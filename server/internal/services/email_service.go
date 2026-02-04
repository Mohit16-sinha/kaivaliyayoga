package services

import "log"

// SendWelcomeEmail simulates sending a welcome email
func SendWelcomeEmail(email, name string) {
	// In production, integrate with SendGrid, AWS SES, or SMTP
	log.Printf("📧 Sending Welcome Email to %s (%s): 'Welcome to Kaivalya! Your application has been approved.'", name, email)
}
