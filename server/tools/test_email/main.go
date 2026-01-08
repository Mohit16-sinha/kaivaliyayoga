package main

import (
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
	"gopkg.in/gomail.v2"
)

func main() {
	// Debug: Print CWD
	cwd, _ := os.Getwd()
	fmt.Printf("DEBUG: Current Working Directory: %s\n", cwd)

	// Try loading .env (from parent dir if we are in tools, or current if root)
	// Actually, if we run "go run tools/test_email/main.go" from root, CWD is root.
	// So .env is in current dir.
	err := godotenv.Load(".env")
	if err != nil {
		fmt.Printf("DEBUG: godotenv.Load() Error: %v\n", err)
		// Fallback check: does file exist?
		if _, err := os.Stat(".env"); os.IsNotExist(err) {
			fmt.Println("DEBUG: .env file does NOT exist in this directory.")
		} else {
			fmt.Println("DEBUG: .env file matches, but load failed.")
		}
	} else {
		fmt.Println("DEBUG: Loaded .env successfully.")
	}

	host := os.Getenv("SMTP_HOST")
	portStr := os.Getenv("SMTP_PORT")
	user := os.Getenv("SMTP_USER")
	pass := os.Getenv("SMTP_PASSWORD")
	from := os.Getenv("SMTP_FROM")

	if host == "" {
		host = "smtp.gmail.com"
	}
	if portStr == "" {
		portStr = "587"
	}
	if from == "" {
		from = "test-sender@test.com"
	}
	if user == "" {
		log.Printf("ERROR: SMTP_USER is empty in .env. USER var: '%s'", user)
	}
	if pass == "" {
		log.Printf("ERROR: SMTP_PASSWORD is empty in .env")
	}

	pass = strings.ReplaceAll(pass, " ", "") // Sanitize

	fmt.Printf("--- SMTP Configuration ---\n")
	fmt.Printf("Host: %s\n", host)
	fmt.Printf("Port: %s\n", portStr)
	fmt.Printf("User: %s\n", user)
	fmt.Printf("From: %s\n", from)
	fmt.Printf("Password Length: %d (sanitized)\n", len(pass))
	fmt.Printf("--------------------------\n")

	port, _ := strconv.Atoi(portStr) // Use strconv

	m := gomail.NewMessage()
	m.SetHeader("From", from)
	m.SetHeader("To", "rajanand3307@gmail.com") // User provided email
	m.SetHeader("Subject", "Test Email from Yoga Studio Debugger")
	m.SetBody("text/plain", "This is a direct test of the SMTP configuration. If you read this, it works!")

	d := gomail.NewDialer(host, port, user, pass)

	fmt.Println("Attempting to connect and send...")
	if err := d.DialAndSend(m); err != nil {
		fmt.Printf("\n❌ FAILED: %v\n", err)
	} else {
		fmt.Printf("\n✅ SUCCESS: Email sent to rajanand3307@gmail.com\n")
	}
}
