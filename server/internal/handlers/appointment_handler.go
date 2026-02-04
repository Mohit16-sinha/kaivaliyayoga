package handlers

import (
	"net/http"
	"time"

	"kaivaliyayoga/internal/models"
	"kaivaliyayoga/internal/services"
	"kaivaliyayoga/internal/utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type AppointmentHandler struct {
	Service services.AppointmentService
}

func (h *AppointmentHandler) Create(c *gin.Context) {
	userID, _ := c.Get("userID")
	var input models.Appointment
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "INVALID_INPUT", err.Error())
		return
	}

	appt, err := h.Service.CreateAppointment(userID.(uint), input)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "BOOKING_FAILED", err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, appt)
}

func (h *AppointmentHandler) GetMy(c *gin.Context) {
	userID, _ := c.Get("userID")
	// Determine if requesting as user or pro? For now default to client unless specific param
	// Or check the user's active role context

	appts, err := h.Service.GetMyAppointments(userID.(uint), "client")
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "FETCH_FAILED", err.Error())
		return
	}
	utils.SuccessResponse(c, http.StatusOK, appts)
}

// GetByID returns a single appointment by ID
func (h *AppointmentHandler) GetByID(c *gin.Context) {
	userID, _ := c.Get("userID")
	idParam := c.Param("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "INVALID_ID", "Invalid appointment ID")
		return
	}

	appt, err := h.Service.GetByID(id, userID.(uint))
	if err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "NOT_FOUND", err.Error())
		return
	}
	utils.SuccessResponse(c, http.StatusOK, appt)
}

// Cancel cancels an appointment
func (h *AppointmentHandler) Cancel(c *gin.Context) {
	userID, _ := c.Get("userID")
	idParam := c.Param("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "INVALID_ID", "Invalid appointment ID")
		return
	}

	var input struct {
		Reason string `json:"reason"`
	}
	c.ShouldBindJSON(&input)

	if err := h.Service.Cancel(id, userID.(uint), input.Reason); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "CANCEL_FAILED", err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, gin.H{"message": "Appointment cancelled successfully"})
}

// Reschedule updates appointment time
func (h *AppointmentHandler) Reschedule(c *gin.Context) {
	userID, _ := c.Get("userID")
	idParam := c.Param("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "INVALID_ID", "Invalid appointment ID")
		return
	}

	var input struct {
		StartTime string `json:"start_time"`
		EndTime   string `json:"end_time"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "INVALID_INPUT", err.Error())
		return
	}

	// Parse times
	startTime, err := time.Parse(time.RFC3339, input.StartTime)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "INVALID_TIME", "Invalid start_time format, use RFC3339")
		return
	}
	endTime, err := time.Parse(time.RFC3339, input.EndTime)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "INVALID_TIME", "Invalid end_time format, use RFC3339")
		return
	}

	if err := h.Service.Reschedule(id, userID.(uint), startTime, endTime); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "RESCHEDULE_FAILED", err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, gin.H{"message": "Appointment rescheduled successfully"})
}
