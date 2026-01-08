package main

import (
	"encoding/csv"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

// --- Stats Overview ---

type DashboardStats struct {
	TotalStudents     int64             `json:"total_students"`
	TotalRevenue      float64           `json:"total_revenue"`
	MonthlyRevenue    float64           `json:"monthly_revenue"`
	WeeklyRevenue     float64           `json:"weekly_revenue"`
	ActiveBookings    int64             `json:"active_bookings_today"`
	BookingsThisWeek  int64             `json:"bookings_this_week"`
	MostPopularClass  string            `json:"most_popular_class"`
	RecentBookings    []BookingResponse `json:"recent_bookings"`
	UnreadMessages    int64             `json:"unread_messages"`
	ActiveMemberships int64             `json:"active_memberships"`
}

type BookingResponse struct {
	ID        uint      `json:"id"`
	UserName  string    `json:"user_name"`
	ClassName string    `json:"class_name"`
	ClassTime string    `json:"class_time"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"created_at"`
}

// GET /api/admin/stats
func GetAdminStats(c *gin.Context) {
	var stats DashboardStats

	// 1. Students Count
	db.Model(&User{}).Where("role = ?", "user").Count(&stats.TotalStudents)

	// 2. Revenue (All Time)
	// Sum payments + program enrollments
	var paymentSum float64
	db.Model(&Payment{}).Where("status = ?", "success").Select("COALESCE(SUM(amount), 0)").Scan(&paymentSum)

	var programSum float64
	db.Model(&ProgramEnrollment{}).Where("payment_status = ?", "paid").Select("COALESCE(SUM(amount_paid), 0)").Scan(&programSum)

	stats.TotalRevenue = paymentSum + programSum

	// 3. Monthly & Weekly Revenue (Approximate via Payments table only for simplicity, can expand)
	now := time.Now()
	startOfMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	startOfWeek := now.AddDate(0, 0, -int(now.Weekday()))

	db.Model(&Payment{}).Where("status = ? AND created_at >= ?", "success", startOfMonth).Select("COALESCE(SUM(amount), 0)").Scan(&stats.MonthlyRevenue)
	db.Model(&Payment{}).Where("status = ? AND created_at >= ?", "success", startOfWeek).Select("COALESCE(SUM(amount), 0)").Scan(&stats.WeeklyRevenue)

	// 4. Bookings
	startOfDay := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	// Today's active bookings (filter by class date logic or just created_at for simple booking activity)
	// Assuming "Active Bookings" means people attending today.
	// We need to join with Class and check Day? Or just bookings created today?
	// Let's do "Bookings made today" for activity feed, or "Classes scheduled today with bookings".
	// Let's do "Bookings for classes today".
	// Complex query: Join Booking -> Class. Day check.
	// For MVP simplicity: Bookings CREATED today.
	db.Model(&Booking{}).Where("created_at >= ?", startOfDay).Count(&stats.ActiveBookings)
	db.Model(&Booking{}).Where("created_at >= ?", startOfWeek).Count(&stats.BookingsThisWeek)

	// 5. Popular Class
	var topClass struct {
		Name  string
		Count int
	}
	db.Table("bookings").Select("classes.name, count(*) as count").
		Joins("left join classes on classes.id = bookings.class_id").
		Group("classes.name").Order("count desc").Limit(1).Scan(&topClass)
	stats.MostPopularClass = topClass.Name

	// 6. Recent Bookings (5)
	var recentBookings []Booking
	db.Preload("User").Preload("Class").Order("created_at desc").Limit(5).Find(&recentBookings)

	for _, b := range recentBookings {
		stats.RecentBookings = append(stats.RecentBookings, BookingResponse{
			ID:        b.ID,
			UserName:  b.User.Name,
			ClassName: b.Class.Name,
			ClassTime: b.Class.Day + " " + b.Class.Time,
			Status:    b.Status,
			CreatedAt: b.CreatedAt,
		})
	}

	// 7. Unread Messages
	db.Model(&Contact{}).Where("status = ?", "unread").Count(&stats.UnreadMessages)

	// 8. Active Memberships
	db.Model(&Membership{}).Where("status = ?", "active").Count(&stats.ActiveMemberships)

	c.JSON(http.StatusOK, stats)
}

// --- Revenue Reports ---

// GET /api/admin/revenue?from=2024-01-01&to=2024-01-31
func GetAdminRevenue(c *gin.Context) {
	fromStr := c.Query("from")
	toStr := c.Query("to")
	exportCSV := c.Query("export") == "true"

	var fromDate, toDate time.Time
	var err error

	if fromStr != "" {
		fromDate, err = time.Parse("2006-01-02", fromStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid from date"})
			return
		}
	} else {
		fromDate = time.Now().AddDate(0, -1, 0) // Default last month
	}

	if toStr != "" {
		toDate, err = time.Parse("2006-01-02", toStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid to date"})
			return
		}
		toDate = toDate.Add(24 * time.Hour) // Include end date
	} else {
		toDate = time.Now()
	}

	var payments []Payment
	db.Preload("User").Where("created_at BETWEEN ? AND ? AND status = ?", fromDate, toDate, "success").Find(&payments)

	if exportCSV {
		c.Header("Content-Type", "text/csv")
		c.Header("Content-Disposition", "attachment;filename=revenue_report.csv")
		writer := csv.NewWriter(c.Writer)

		writer.Write([]string{"ID", "Date", "User", "Amount", "Method", "Order ID"})
		for _, p := range payments {
			writer.Write([]string{
				fmt.Sprintf("%d", p.ID),
				p.CreatedAt.Format("2006-01-02 15:04"),
				p.User.Name,
				fmt.Sprintf("%.2f", p.Amount),
				p.Method,
				p.OrderID,
			})
		}
		writer.Flush()
		return
	}

	var total float64
	for _, p := range payments {
		total += p.Amount
	}

	c.JSON(http.StatusOK, gin.H{
		"from":     fromDate,
		"to":       toDate,
		"count":    len(payments),
		"total":    total,
		"payments": payments,
	})
}

// --- Bookings Management ---

// GET /api/admin/bookings?status=&date=&class_id=
func GetAdminBookings(c *gin.Context) {
	status := c.Query("status")
	date := c.Query("date")
	classID := c.Query("class_id")
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	offset := (page - 1) * limit

	query := db.Model(&Booking{}).Preload("User").Preload("Class")

	if status != "" {
		query = query.Where("status = ?", status)
	}
	if classID != "" {
		query = query.Where("class_id = ?", classID)
	}
	if date != "" {
		// Complex: Date usually implies Class Date.
		// Filter bookings created on date OR for classes on date?
		// Usually means Creation Date for admin logs.
		parseDate, _ := time.Parse("2006-01-02", date)
		nextDay := parseDate.Add(24 * time.Hour)
		query = query.Where("created_at >= ? AND created_at < ?", parseDate, nextDay)
	}

	var total int64
	query.Count(&total)

	var bookings []Booking
	query.Order("created_at desc").Limit(limit).Offset(offset).Find(&bookings)

	c.JSON(http.StatusOK, gin.H{
		"data":  bookings,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// --- User Management ---

// GET /api/admin/users
func GetAdminUsers(c *gin.Context) {
	role := c.Query("role")
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	offset := (page - 1) * limit

	query := db.Model(&User{})
	if role != "" {
		query = query.Where("role = ?", role)
	}

	var total int64
	query.Count(&total)

	var users []User
	query.Limit(limit).Offset(offset).Find(&users)

	c.JSON(http.StatusOK, gin.H{
		"data":  users,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// PUT /api/admin/users/:id/role
func UpdateUserRole(c *gin.Context) {
	id := c.Param("id")
	var input struct {
		Role string `json:"role" binding:"required,oneof=user admin"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.Model(&User{}).Where("id = ?", id).Update("role", input.Role).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update role"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Role updated"})
}

// --- Contact Messages ---

// GET /api/admin/contact
func GetAdminContact(c *gin.Context) {
	status := c.Query("status")
	if status == "" {
		status = "unread" // Default to unread for workflow
	}

	var messages []Contact
	query := db.Model(&Contact{})
	if status != "all" {
		query = query.Where("status = ?", status)
	}

	query.Order("created_at desc").Find(&messages)
	c.JSON(http.StatusOK, messages)
}

// PUT /api/admin/contact/:id
func UpdateContactStatus(c *gin.Context) {
	id := c.Param("id")
	var input struct {
		Status string `json:"status" binding:"required,oneof=unread read replied"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.Model(&Contact{}).Where("id = ?", id).Update("status", input.Status).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update status"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Status updated"})
}
