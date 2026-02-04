package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID       uint   `json:"id" gorm:"primaryKey"`
	Email    string `json:"email" gorm:"unique;not null"`
	Password string `json:"-"`
	Name     string `json:"name"`
	Phone    string `json:"phone"`
	Role     string `json:"role" gorm:"default:'user'"` // 'user' or 'admin' (Legacy)

	// New Marketplace Fields
	UserType           string    `json:"user_type" gorm:"default:'client'"` // client, professional, admin
	IsVerified         bool      `json:"is_verified" gorm:"default:false"`
	ProfileImageURL    string    `json:"profile_image_url"`
	CurrencyPreference string    `json:"currency_preference" gorm:"default:'AUD'"`
	Timezone           string    `json:"timezone" gorm:"default:'UTC'"`
	LastLoginAt        time.Time `json:"last_login_at"`

	// Relationships
	Professional *Professional `json:"professional,omitempty" gorm:"foreignKey:UserID"`

	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}
