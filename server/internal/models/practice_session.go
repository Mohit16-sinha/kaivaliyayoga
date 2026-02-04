package models

import (
	"time"

	"gorm.io/gorm"
)

type PracticeSession struct {
	ID              uint           `json:"id" gorm:"primaryKey"`
	UserID          uint           `json:"user_id" gorm:"index"`
	PoseName        string         `json:"pose_name"`
	DurationSeconds int            `json:"duration_seconds"`
	AccuracyScore   int            `json:"accuracy_score"`
	Date            time.Time      `json:"date"`
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
	DeletedAt       gorm.DeletedAt `json:"-" gorm:"index"`
}
