package main

import (
	"fmt"
	"os"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

// MigrateFromSQLite moves data from legacy SQLite DB to the new Postgres DB
func MigrateFromSQLite(pgDB *gorm.DB) {
	sqlitePath := "yoga.db"
	if _, err := os.Stat(sqlitePath); os.IsNotExist(err) {
		fmt.Println("Migration Skipped: yoga.db not found.")
		return
	}

	fmt.Println(">>> Starting Migration from SQLite to PostgreSQL...")

	// Connect to SQLite
	sqliteDB, err := gorm.Open(sqlite.Open(sqlitePath), &gorm.Config{})
	if err != nil {
		fmt.Printf("Migration Error: Failed to connect to SQLite: %v\n", err)
		return
	}

	// 1. Migrate Users
	var users []User
	if err := sqliteDB.Find(&users).Error; err == nil {
		fmt.Printf("Migrating %d Users...\n", len(users))
		// Use OnConflict DoNothing to avoid duplicates if migration ran partially
		if err := pgDB.Clauses(clause.OnConflict{DoNothing: true}).Create(&users).Error; err != nil {
			fmt.Printf("Error importing users: %v\n", err)
		}
	}

	// 2. Migrate Classes
	var classes []Class
	if err := sqliteDB.Find(&classes).Error; err == nil {
		fmt.Printf("Migrating %d Classes...\n", len(classes))
		if err := pgDB.Clauses(clause.OnConflict{DoNothing: true}).Create(&classes).Error; err != nil {
			fmt.Printf("Error importing classes: %v\n", err)
		}
	}

	// 3. Migrate Contacts (if any)
	var contacts []Contact
	if err := sqliteDB.Find(&contacts).Error; err == nil {
		fmt.Printf("Migrating %d Contacts...\n", len(contacts))
		if err := pgDB.Clauses(clause.OnConflict{DoNothing: true}).Create(&contacts).Error; err != nil {
			fmt.Printf("Error importing contacts: %v\n", err)
		}
	}

	// 4. Migrate Payments
	var payments []Payment
	if err := sqliteDB.Find(&payments).Error; err == nil {
		fmt.Printf("Migrating %d Payments...\n", len(payments))
		if err := pgDB.Clauses(clause.OnConflict{DoNothing: true}).Create(&payments).Error; err != nil {
			fmt.Printf("Error importing payments: %v\n", err)
		}
	}

	// 5. Migrate Memberships
	var memberships []Membership
	if err := sqliteDB.Find(&memberships).Error; err == nil {
		fmt.Printf("Migrating %d Memberships...\n", len(memberships))
		if err := pgDB.Clauses(clause.OnConflict{DoNothing: true}).Create(&memberships).Error; err != nil {
			fmt.Printf("Error importing memberships: %v\n", err)
		}
	}

	// 6. Migrate Bookings
	var bookings []Booking
	if err := sqliteDB.Find(&bookings).Error; err == nil {
		fmt.Printf("Migrating %d Bookings...\n", len(bookings))
		if err := pgDB.Clauses(clause.OnConflict{DoNothing: true}).Create(&bookings).Error; err != nil {
			fmt.Printf("Error importing bookings: %v\n", err)
		}
	}

	// 7. Migrate Programs
	var programs []Program
	if err := sqliteDB.Find(&programs).Error; err == nil {
		fmt.Printf("Migrating %d Programs...\n", len(programs))
		if err := pgDB.Clauses(clause.OnConflict{DoNothing: true}).Create(&programs).Error; err != nil {
			fmt.Printf("Error importing programs: %v\n", err)
		}
	}

	// 8. Migrate Program Enrollments
	var enrollments []ProgramEnrollment
	if err := sqliteDB.Find(&enrollments).Error; err == nil {
		fmt.Printf("Migrating %d Program Enrollments...\n", len(enrollments))
		if err := pgDB.Clauses(clause.OnConflict{DoNothing: true}).Create(&enrollments).Error; err != nil {
			fmt.Printf("Error importing enrollments: %v\n", err)
		}
	}

	// 9. Migrate Practice Sessions
	var sessions []PracticeSession
	if err := sqliteDB.Find(&sessions).Error; err == nil {
		fmt.Printf("Migrating %d Practice Sessions...\n", len(sessions))
		if err := pgDB.Clauses(clause.OnConflict{DoNothing: true}).Create(&sessions).Error; err != nil {
			fmt.Printf("Error importing sessions: %v\n", err)
		}
	}

	fmt.Println(">>> Migration Completed!")
}
