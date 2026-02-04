package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

// --- Exchange Rate Service ---

type ExchangeRateResponse struct {
	Amount float64            `json:"amount"`
	Base   string             `json:"base"`
	Date   string             `json:"date"`
	Rates  map[string]float64 `json:"rates"`
}

var (
	exchangeRatesCache     map[string]float64
	exchangeRatesCacheTime time.Time
	ratesMutex             sync.RWMutex
)

// Supported currencies to fetch against AUD
var supportedCurrencies = []string{"INR", "USD", "GBP", "CAD", "SGD", "AED", "NZD", "EUR"}

func FetchExchangeRates() error {
	// Rate limit check: Update only if cache is older than 24 hours
	ratesMutex.RLock()
	if time.Since(exchangeRatesCacheTime) < 24*time.Hour && exchangeRatesCache != nil {
		ratesMutex.RUnlock()
		return nil
	}
	ratesMutex.RUnlock()

	// Using frankfurter.app (Free, no key)
	// Base: AUD
	url := "https://api.frankfurter.app/latest?from=AUD&to=" // Fetch all or specify
	for i, curr := range supportedCurrencies {
		if i > 0 {
			url += ","
		}
		url += curr
	}

	resp, err := http.Get(url)
	if err != nil {
		fmt.Printf("Error fetching rates: %v. Using Fallback.\n", err)
		ratesMutex.Lock()
		// Fallback rates (Approximate)
		exchangeRatesCache = map[string]float64{
			"AUD": 1.0, "USD": 0.67, "INR": 55.0, "GBP": 0.53, "CAD": 0.90, "SGD": 0.89, "AED": 2.45, "EUR": 0.62,
		}
		exchangeRatesCacheTime = time.Now()
		ratesMutex.Unlock()
		return nil
	}
	defer resp.Body.Close()

	var result ExchangeRateResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return fmt.Errorf("failed to decode rates: %v", err)
	}

	ratesMutex.Lock()
	exchangeRatesCache = result.Rates
	// Add AUD itself
	exchangeRatesCache["AUD"] = 1.0
	exchangeRatesCacheTime = time.Now()
	ratesMutex.Unlock()

	fmt.Println("Exchange rates updated:", exchangeRatesCache)
	return nil
}

// --- Handlers ---

func GetExchangeRates(c *gin.Context) {
	// Attempt to refresh if needed (non-blocking in bg ideally, but simple here)
	// For production, this should be a background cron.
	// Here we trigger it if stale, but don't block too long if API is slow?
	// Actually, let's just call it.

	// Check cache first
	ratesMutex.RLock()
	isStale := time.Since(exchangeRatesCacheTime) > 24*time.Hour || exchangeRatesCache == nil
	ratesMutex.RUnlock()

	if isStale {
		if err := FetchExchangeRates(); err != nil {
			// If fail, return stale data if we have it, else error
			ratesMutex.RLock()
			if exchangeRatesCache != nil {
				c.JSON(http.StatusOK, gin.H{"rates": exchangeRatesCache, "updated_at": exchangeRatesCacheTime, "warning": "using stale data"})
				ratesMutex.RUnlock()
				return
			}
			ratesMutex.RUnlock()
			c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Failed to fetch exchange rates"})
			return
		}
	}

	ratesMutex.RLock()
	defer ratesMutex.RUnlock()
	c.JSON(http.StatusOK, gin.H{
		"base":       "AUD",
		"rates":      exchangeRatesCache,
		"updated_at": exchangeRatesCacheTime,
	})
}
