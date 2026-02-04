package services

import (
	"errors"
	"time"

	"kaivaliyayoga/internal/models"
	"kaivaliyayoga/pkg/database"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var jwtSecret = []byte("super_secret_key_change_this_in_production") // TODO: Move to config

type AuthService struct{}

func (s *AuthService) Signup(input models.User) (*models.User, string, error) {
	// Hash Password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, "", errors.New("failed to hash password")
	}
	input.Password = string(hashedPassword)

	// Create User
	if result := database.DB.Create(&input); result.Error != nil {
		return nil, "", errors.New("email already exists")
	}

	// Generate Token
	token, _ := s.GenerateToken(input.ID)
	return &input, token, nil
}

func (s *AuthService) Login(email, password string) (*models.User, string, error) {
	var user models.User
	if err := database.DB.Where("email = ?", email).First(&user).Error; err != nil {
		return nil, "", errors.New("invalid email or password")
	}

	// Check Password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return nil, "", errors.New("invalid email or password")
	}

	// Generate Token
	token, err := s.GenerateToken(user.ID)
	return &user, token, err
}

func (s *AuthService) GenerateToken(userID uint) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": userID,
		"exp": time.Now().Add(time.Hour * 24 * 7).Unix(), // 7 days
	})

	return token.SignedString(jwtSecret)
}
