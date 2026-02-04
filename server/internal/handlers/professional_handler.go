package handlers

import (
	"net/http"

	"kaivaliyayoga/internal/models"
	"kaivaliyayoga/internal/services"
	"kaivaliyayoga/internal/utils"

	"github.com/gin-gonic/gin"
)

type ProfessionalHandler struct {
	Service services.ProfessionalService
}

func (h *ProfessionalHandler) Search(c *gin.Context) {
	query := c.Query("q")
	typeFilter := c.Query("type")

	pros, err := h.Service.Search(query, typeFilter)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "SEARCH_FAILED", err.Error())
		return
	}
	utils.SuccessResponse(c, http.StatusOK, pros)
}

func (h *ProfessionalHandler) GetByID(c *gin.Context) {
	id := c.Param("id")
	pro, err := h.Service.GetByID(id)
	if err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "NOT_FOUND", err.Error())
		return
	}
	utils.SuccessResponse(c, http.StatusOK, pro)
}

func (h *ProfessionalHandler) CreateProfile(c *gin.Context) {
	userID, _ := c.Get("userID")

	var input models.Professional
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "INVALID_INPUT", err.Error())
		return
	}

	createdPro, err := h.Service.CreateProfile(userID.(uint), input)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "CREATE_FAILED", err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, createdPro)
}
