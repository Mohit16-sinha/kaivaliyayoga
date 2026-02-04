package utils

import (
	"github.com/gin-gonic/gin"
)

type APIResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   *APIError   `json:"error,omitempty"`
	Meta    interface{} `json:"meta,omitempty"`
}

type APIError struct {
	Code    string      `json:"code"`
	Message string      `json:"message"`
	Details interface{} `json:"details,omitempty"`
}

func SuccessResponse(c *gin.Context, status int, data interface{}, meta ...interface{}) {
	response := APIResponse{
		Success: true,
		Data:    data,
	}
	if len(meta) > 0 {
		response.Meta = meta[0]
	}
	c.JSON(status, response)
}

func ErrorResponse(c *gin.Context, status int, code string, message string, details ...interface{}) {
	errData := &APIError{
		Code:    code,
		Message: message,
	}
	if len(details) > 0 {
		errData.Details = details[0]
	}
	c.JSON(status, APIResponse{
		Success: false,
		Error:   errData,
	})
}
