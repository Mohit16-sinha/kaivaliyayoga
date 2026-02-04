package database

import (
	"fmt"
	"time"

	"kaivaliyayoga/internal/models"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/datatypes"
)

// SeedProfessionals creates dummy professionals for testing
func SeedProfessionals() {
	db := GetDB()

	// Check if professionals already exist
	var count int64
	db.Model(&models.Professional{}).Count(&count)
	if count > 0 {
		fmt.Println("Professionals already seeded, skipping...")
		return
	}

	fmt.Println("Seeding dummy professionals...")

	// Create dummy password (hashed)
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)

	// Seed data
	professionals := []struct {
		Email       string
		Name        string
		Type        string
		Title       string
		Bio         string
		City        string
		Country     string
		Experience  int
		Rating      float64
		ReviewCount int
		IsFeatured  bool
		Languages   []string
	}{
		{
			Email:       "sarah.johnson@example.com",
			Name:        "Dr. Sarah Johnson",
			Type:        "yoga_therapist",
			Title:       "Senior Yoga Therapist",
			Bio:         "I am a certified yoga therapist with over 15 years of experience helping clients achieve physical and mental wellness through personalized yoga practices.",
			City:        "Sydney",
			Country:     "Australia",
			Experience:  15,
			Rating:      4.9,
			ReviewCount: 127,
			IsFeatured:  true,
			Languages:   []string{"English", "Spanish"},
		},
		{
			Email:       "michael.chen@example.com",
			Name:        "Dr. Michael Chen",
			Type:        "doctor",
			Title:       "Integrative Medicine Specialist",
			Bio:         "Board-certified physician combining Western medicine with holistic approaches for comprehensive patient care.",
			City:        "Melbourne",
			Country:     "Australia",
			Experience:  12,
			Rating:      4.8,
			ReviewCount: 89,
			IsFeatured:  true,
			Languages:   []string{"English", "Mandarin"},
		},
		{
			Email:       "emma.williams@example.com",
			Name:        "Emma Williams",
			Type:        "nutritionist",
			Title:       "Clinical Nutritionist",
			Bio:         "Helping clients transform their health through personalized nutrition plans and mindful eating practices.",
			City:        "Brisbane",
			Country:     "Australia",
			Experience:  8,
			Rating:      4.7,
			ReviewCount: 64,
			IsFeatured:  false,
			Languages:   []string{"English"},
		},
		{
			Email:       "david.patel@example.com",
			Name:        "Dr. David Patel",
			Type:        "psychologist",
			Title:       "Clinical Psychologist",
			Bio:         "Specializing in stress management, anxiety, and mindfulness-based cognitive therapy.",
			City:        "Perth",
			Country:     "Australia",
			Experience:  10,
			Rating:      4.9,
			ReviewCount: 112,
			IsFeatured:  true,
			Languages:   []string{"English", "Hindi"},
		},
		{
			Email:       "lisa.thompson@example.com",
			Name:        "Lisa Thompson",
			Type:        "yoga_therapist",
			Title:       "Prenatal Yoga Specialist",
			Bio:         "Certified prenatal yoga instructor helping expecting mothers stay healthy and prepared for childbirth.",
			City:        "Adelaide",
			Country:     "Australia",
			Experience:  6,
			Rating:      4.6,
			ReviewCount: 45,
			IsFeatured:  false,
			Languages:   []string{"English"},
		},
		{
			Email:       "james.wilson@example.com",
			Name:        "James Wilson",
			Type:        "nurse",
			Title:       "Holistic Health Nurse",
			Bio:         "Registered nurse with additional training in holistic health practices and patient wellness.",
			City:        "Gold Coast",
			Country:     "Australia",
			Experience:  9,
			Rating:      4.5,
			ReviewCount: 38,
			IsFeatured:  false,
			Languages:   []string{"English"},
		},
	}

	for _, p := range professionals {
		// Create User
		user := models.User{
			Email:              p.Email,
			Password:           string(hashedPassword),
			Name:               p.Name,
			UserType:           "professional",
			IsVerified:         true,
			CurrencyPreference: "AUD",
			Timezone:           "Australia/Sydney",
			LastLoginAt:        time.Now(),
		}

		if err := db.Create(&user).Error; err != nil {
			fmt.Printf("Error creating user %s: %v\n", p.Email, err)
			continue
		}

		// Convert languages to JSON
		languagesJSON, _ := datatypes.NewJSONType(p.Languages).MarshalJSON()

		// Create Professional
		professional := models.Professional{
			ID:                 uuid.New(),
			UserID:             user.ID,
			Slug:               generateSlug(p.Name),
			Title:              p.Title,
			Bio:                p.Bio,
			ProfessionalType:   p.Type,
			Country:            p.Country,
			City:               p.City,
			Languages:          datatypes.JSON(languagesJSON),
			YearsExperience:    p.Experience,
			Rating:             p.Rating,
			ReviewCount:        p.ReviewCount,
			IsFeatured:         p.IsFeatured,
			VerificationStatus: "approved",
		}

		if err := db.Create(&professional).Error; err != nil {
			fmt.Printf("Error creating professional %s: %v\n", p.Name, err)
			continue
		}

		// Create services for this professional
		services := []models.Service{
			{
				ID:              uuid.New(),
				ProfessionalID:  professional.ID,
				Name:            "Initial Consultation",
				Description:     "30-minute discovery session to discuss your goals and create a personalized plan.",
				DurationMinutes: 30,
				PriceCents:      4900,
				Currency:        "AUD",
				ServiceType:     "consultation",
				DeliveryMethod:  "online",
				IsActive:        true,
			},
			{
				ID:              uuid.New(),
				ProfessionalID:  professional.ID,
				Name:            "1-on-1 Session",
				Description:     "Personalized 60-minute session tailored to your specific needs.",
				DurationMinutes: 60,
				PriceCents:      8900,
				Currency:        "AUD",
				ServiceType:     "therapy",
				DeliveryMethod:  "online",
				IsActive:        true,
			},
			{
				ID:              uuid.New(),
				ProfessionalID:  professional.ID,
				Name:            "Package: 4 Sessions",
				Description:     "Save 10% with a package of 4 sessions (60 min each).",
				DurationMinutes: 60,
				PriceCents:      32000,
				Currency:        "AUD",
				ServiceType:     "therapy",
				DeliveryMethod:  "online",
				IsActive:        true,
			},
		}

		for _, svc := range services {
			if err := db.Create(&svc).Error; err != nil {
				fmt.Printf("Error creating service for %s: %v\n", p.Name, err)
			}
		}

		fmt.Printf("Created professional: %s (%s)\n", p.Name, p.Type)
	}

	fmt.Println("Seeding complete!")
}

func generateSlug(name string) string {
	// Simple slug generation
	slug := ""
	for _, c := range name {
		if (c >= 'a' && c <= 'z') || (c >= '0' && c <= '9') {
			slug += string(c)
		} else if c >= 'A' && c <= 'Z' {
			slug += string(c + 32) // lowercase
		} else if c == ' ' {
			slug += "-"
		}
	}
	return slug
}
