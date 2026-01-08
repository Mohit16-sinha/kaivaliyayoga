package main

import (
	"fmt"
	"os"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

type User struct {
	ID    uint   `gorm:"primaryKey"`
	Email string `gorm:"unique"`
	Role  string
}

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Usage: go run promote_admin.go <email>")
		return
	}
	email := os.Args[1]

	// Connect to DB (Path relative to server root where we run this from)
	// Note: We might need to adjust this path since we moved the file deeped
	// But usually these scripts are run from the server root: go run tools/promote_admin/main.go
	// So "yoga.db" should still be correct if run from server root.
	db, err := gorm.Open(sqlite.Open("yoga.db"), &gorm.Config{})
	if err != nil {
		fmt.Printf("Failed to connect to DB: %v\nTry running from server folder.\n", err)
		return
	}

	var user User
	result := db.Where("email = ?", email).First(&user)
	if result.Error != nil {
		fmt.Printf("User with email '%s' not found.\n", email)
		return
	}

	user.Role = "admin"
	db.Save(&user)
	fmt.Printf("✅ Success! %s is now an ADMIN.\n", user.Email)
}
