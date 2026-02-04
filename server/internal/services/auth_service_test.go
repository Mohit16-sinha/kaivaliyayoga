package services

import (
	"testing"

	"kaivaliyayoga/internal/models"
	"kaivaliyayoga/pkg/database"

	"github.com/glebarez/sqlite"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

// setupTestDB initializes an in-memory SQLite database for testing
func setupTestDB() {
	db, err := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	if err != nil {
		panic("failed to connect to test database")
	}

	database.DB = db

	// Migrate schema
	err = database.DB.AutoMigrate(&models.User{})
	if err != nil {
		panic("failed to migrate test database")
	}
}

// teardownTestDB cleans up tables
func teardownTestDB() {
	database.DB.Exec("DELETE FROM users")
}

func TestAuthService_Signup(t *testing.T) {
	setupTestDB()
	defer teardownTestDB()

	service := &AuthService{}

	t.Run("Success", func(t *testing.T) {
		input := models.User{
			Name:     "Test User",
			Email:    "test@example.com",
			Password: "password123",
			Role:     "client",
		}

		user, token, err := service.Signup(input)

		assert.NoError(t, err)
		assert.NotNil(t, user)
		assert.NotEmpty(t, token)
		assert.NotZero(t, user.ID)
		assert.Equal(t, "test@example.com", user.Email)
		// Password should be hashed
		assert.NotEqual(t, "password123", user.Password)
	})

	t.Run("Duplicate Email", func(t *testing.T) {
		// Create first user
		input1 := models.User{
			Name:     "User 1",
			Email:    "duplicate@example.com",
			Password: "password123",
		}
		_, _, _ = service.Signup(input1)

		// Try to create second user with same email
		input2 := models.User{
			Name:     "User 2",
			Email:    "duplicate@example.com",
			Password: "password456",
		}
		user, token, err := service.Signup(input2)

		assert.Error(t, err)
		assert.Nil(t, user)
		assert.Empty(t, token)
		assert.Equal(t, "email already exists", err.Error())
	})
}

func TestAuthService_Login(t *testing.T) {
	setupTestDB()
	defer teardownTestDB()

	service := &AuthService{}

	// Seed a user
	signupInput := models.User{
		Name:     "Login User",
		Email:    "login@example.com",
		Password: "password123",
	}
	_, _, _ = service.Signup(signupInput)

	t.Run("Success", func(t *testing.T) {
		user, token, err := service.Login("login@example.com", "password123")

		assert.NoError(t, err)
		assert.NotNil(t, user)
		assert.NotEmpty(t, token)
		assert.Equal(t, "login@example.com", user.Email)
	})

	t.Run("Invalid Password", func(t *testing.T) {
		user, token, err := service.Login("login@example.com", "wrongpassword")

		assert.Error(t, err)
		assert.Nil(t, user)
		assert.Empty(t, token)
		assert.Equal(t, "invalid email or password", err.Error())
	})

	t.Run("Non-existent User", func(t *testing.T) {
		user, token, err := service.Login("nonexistent@example.com", "password123")

		assert.Error(t, err)
		assert.Nil(t, user)
		assert.Empty(t, token)
		assert.Equal(t, "invalid email or password", err.Error())
	})
}
