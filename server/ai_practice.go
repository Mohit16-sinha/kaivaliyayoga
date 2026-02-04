package main

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// --- Model ---

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

// --- DTO ---

type PracticeSessionInput struct {
	PoseName        string `json:"pose_name" binding:"required"`
	DurationSeconds int    `json:"duration_seconds" binding:"required"`
	AccuracyScore   int    `json:"accuracy_score" binding:"required"`
}

// --- Controller ---

func SavePracticeSession(c *gin.Context) {
	// Get user from context (set by auth middleware)
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var input PracticeSessionInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	session := PracticeSession{
		UserID:          userID.(uint),
		PoseName:        input.PoseName,
		DurationSeconds: input.DurationSeconds,
		AccuracyScore:   input.AccuracyScore,
		Date:            time.Now(),
	}

	if result := db.Create(&session); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save session"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Session saved successfully", "session": session})
}

func GetPracticeHistory(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var sessions []PracticeSession
	// Get last 50 sessions ordered by date desc
	result := db.Where("user_id = ?", userID).Order("date desc").Limit(50).Find(&sessions)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch history"})
		return
	}

	c.JSON(http.StatusOK, sessions)
}

func GetPracticeStats(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	type Stats struct {
		TotalSessions int   `json:"total_sessions"`
		TotalDuration int64 `json:"total_duration"` // in seconds
		AverageScore  int   `json:"average_score"`
	}

	var stats Stats
	var count int64

	// Total Sessions
	db.Model(&PracticeSession{}).Where("user_id = ?", userID).Count(&count)
	stats.TotalSessions = int(count)

	if count > 0 {
		// Total Duration
		db.Model(&PracticeSession{}).Where("user_id = ?", userID).Select("sum(duration_seconds)").Scan(&stats.TotalDuration)

		// Average Score
		var avgScore float64
		db.Model(&PracticeSession{}).Where("user_id = ?", userID).Select("avg(accuracy_score)").Scan(&avgScore)
		stats.AverageScore = int(avgScore)
	}

	c.JSON(http.StatusOK, stats)
}
