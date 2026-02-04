package services

import (
	"errors"
	"kaivaliyayoga/internal/models"
	"kaivaliyayoga/pkg/database"
)

type ProfessionalService struct{}

func (s *ProfessionalService) Search(query string, typeFilter string) ([]models.Professional, error) {
	var pros []models.Professional
	db := database.DB.Preload("User").Preload("Services").Where("verification_status = ?", "approved") // Only approved

	if query != "" {
		db = db.Where("title ILIKE ? OR bio ILIKE ?", "%"+query+"%", "%"+query+"%")
	}
	if typeFilter != "" {
		db = db.Where("professional_type = ?", typeFilter)
	}

	if err := db.Find(&pros).Error; err != nil {
		return nil, err
	}
	return pros, nil
}

func (s *ProfessionalService) GetByID(id string) (*models.Professional, error) {
	var pro models.Professional
	if err := database.DB.Preload("User").Preload("Services").First(&pro, "id = ?", id).Error; err != nil {
		return nil, errors.New("professional not found")
	}
	return &pro, nil
}

func (s *ProfessionalService) CreateProfile(userID uint, input models.Professional) (*models.Professional, error) {
	// Check if user already has a profile
	var existing models.Professional
	if err := database.DB.Where("user_id = ?", userID).First(&existing).Error; err == nil {
		return nil, errors.New("profile already exists")
	}

	input.UserID = userID
	input.VerificationStatus = "pending" // Default

	if err := database.DB.Create(&input).Error; err != nil {
		return nil, err
	}

	// Update user type
	database.DB.Model(&models.User{}).Where("id = ?", userID).Update("user_type", "professional")

	return &input, nil
}
