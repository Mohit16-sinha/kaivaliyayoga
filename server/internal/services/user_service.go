package services

import (
	"errors"
	"kaivaliyayoga/internal/models"
	"kaivaliyayoga/pkg/database"
)

type UserService struct{}

func (s *UserService) GetProfile(userID uint) (*models.User, error) {
	var user models.User
	if err := database.DB.Preload("Professional").First(&user, userID).Error; err != nil {
		return nil, errors.New("user not found")
	}
	// Sanitize
	user.Password = ""
	return &user, nil
}

func (s *UserService) UpdateProfile(userID uint, updates models.User) (*models.User, error) {
	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		return nil, errors.New("user not found")
	}

	// Update fields
	if updates.Name != "" {
		user.Name = updates.Name
	}
	if updates.Phone != "" {
		user.Phone = updates.Phone
	}
	if updates.CurrencyPreference != "" {
		user.CurrencyPreference = updates.CurrencyPreference
	}
	if updates.ProfileImageURL != "" {
		user.ProfileImageURL = updates.ProfileImageURL
	}

	if err := database.DB.Save(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}
