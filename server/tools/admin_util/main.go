package main

import (
	"fmt"
	"os"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

type User struct {
	ID    uint
	Name  string
	Email string
	Role  string
}

func main() {
	// Connect to DB
	db, err := gorm.Open(sqlite.Open("yoga.db"), &gorm.Config{})
	if err != nil {
		fmt.Printf("Failed to connect to DB: %v\n", err)
		return
	}

	var users []User
	// Find ALL users to see what's going on
	db.Find(&users)

	fmt.Println("--- USER REPORT ---")
	for _, u := range users {
		roleDisplay := u.Role
		if roleDisplay == "admin" {
			roleDisplay = "👑 ADMIN"
		} else {
			roleDisplay = "👤 User"
		}
		fmt.Printf("[%d] %s (%s) - %s\n", u.ID, u.Name, u.Email, roleDisplay)
	}
	fmt.Println("-------------------")

	if len(os.Args) > 1 {
		targetEmail := os.Args[1]
		fmt.Printf("\nTargeting: %s\n", targetEmail)
		// Try to promote
		var target User
		if err := db.Where("email = ?", targetEmail).First(&target).Error; err == nil {
			target.Role = "admin"
			db.Save(&target)
			fmt.Printf("✅ PROMOTED %s to ADMIN!\n", target.Email)
		} else {
			fmt.Printf("❌ Could not find user %s\n", targetEmail)
		}
	}
}
