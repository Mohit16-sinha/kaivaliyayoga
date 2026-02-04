import React, { createContext, useContext, useState, useEffect } from 'react';
import { CURRENCIES, EXCHANGE_RATES, DEFAULT_CURRENCY, getCurrencyByCode } from '../config/currencies';

const CurrencyContext = createContext();

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};

export const CurrencyProvider = ({ children }) => {
    const [currencyCode, setCurrencyCode] = useState(() => {
        // Initialize from localStorage or default
        if (typeof window !== 'undefined') {
            return localStorage.getItem('selectedCurrency') || DEFAULT_CURRENCY;
        }
        return DEFAULT_CURRENCY;
    });

    // Get current currency object
    const currentCurrency = getCurrencyByCode(currencyCode);

    // Save to localStorage when currency changes
    useEffect(() => {
        localStorage.setItem('selectedCurrency', currencyCode);
    }, [currencyCode]);

    // Change currency function
    const changeCurrency = (code) => {
        setCurrencyCode(code);
    };

    // Format price from AUD to selected currency
    const formatPrice = (amountInAUD) => {
        if (typeof amountInAUD !== 'number' || isNaN(amountInAUD)) {
            return `${currentCurrency.symbol}0`;
        }

        // Get rates
        const audRate = EXCHANGE_RATES['AUD'] || 1.52;
        const targetRate = EXCHANGE_RATES[currencyCode] || 1;

        // Convert: AUD -> USD -> Target
        const amountInUSD = amountInAUD / audRate;
        const convertedAmount = amountInUSD * targetRate;

        // Format with Intl
        try {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currencyCode,
                maximumFractionDigits: 0,
            }).format(convertedAmount);
        } catch {
            // Fallback formatting
            return `${currentCurrency.symbol}${Math.round(convertedAmount)}`;
        }
    };

    const value = {
        currency: currencyCode,
        currentCurrency,
        currencies: CURRENCIES,
        rates: EXCHANGE_RATES,
        changeCurrency,
        formatPrice,
    };

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
};

export default CurrencyContext;
