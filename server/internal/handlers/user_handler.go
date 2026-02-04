package handlers

import (
	"net/http"

	"kaivaliyayoga/internal/models"
	"kaivaliyayoga/internal/services"
	"kaivaliyayoga/internal/utils"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	Service services.UserService
}

func (h *UserHandler) GetProfile(c *gin.Context) {
	userID, _ := c.Get("userID")

	user, err := h.Service.GetProfile(userID.(uint))
	if err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "USER_NOT_FOUND", err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, user)
}

func (h *UserHandler) UpdateProfile(c *gin.Context) {
	userID, _ := c.Get("userID")
	var input models.User
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "INVALID_INPUT", err.Error())
		return
	}

	updatedUser, err := h.Service.UpdateProfile(userID.(uint), input)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "UPDATE_FAILED", err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, updatedUser)
}
