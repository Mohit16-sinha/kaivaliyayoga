package models

import (
	"time"

	"gorm.io/gorm"
)

type Contact struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	Name      string         `json:"name"`
	Email     string         `json:"email"`
	Phone     string         `json:"phone"`
	Subject   string         `json:"subject"`
	Message   string         `json:"message"`
	Status    string         `json:"status" gorm:"default:'unread'"` // 'unread', 'read', 'replied'
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}
