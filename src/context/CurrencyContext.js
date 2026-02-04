import React, { createContext, useContext, useState, useEffect } from 'react';
import { CURRENCIES, EXCHANGE_RATES, DEFAULT_CURRENCY, getCurrencyByCode } from '../config/currencies';

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
    const [rates, setRates] = useState(EXCHANGE_RATES);

    // Load saved currency on mount
    useEffect(() => {
        const saved = localStorage.getItem('user_currency');
        if (saved && getCurrencyByCode(saved)) {
            setCurrency(saved);
        }
    }, []);

    const changeCurrency = (code) => {
        const curr = getCurrencyByCode(code);
        if (curr) {
            setCurrency(code);
            localStorage.setItem('user_currency', code);
        }
    };

    const convertPrice = (amountAUD) => {
        const audRate = rates['AUD'] || 1.52;
        const targetRate = rates[currency] || 1;
        const amountInUSD = amountAUD / audRate;
        return amountInUSD * targetRate;
    };

    const formatPrice = (amountAUD) => {
        const converted = convertPrice(amountAUD);
        const currInfo = getCurrencyByCode(currency);

        try {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency,
                maximumFractionDigits: 0,
            }).format(converted);
        } catch {
            return `${currInfo?.symbol || '$'}${Math.round(converted)}`;
        }
    };

    return (
        <CurrencyContext.Provider value={{
            currency,
            currencies: CURRENCIES,
            rates,
            changeCurrency,
            convertPrice,
            formatPrice,
            currencyInfo: getCurrencyByCode(currency)
        }}>
            {children}
        </CurrencyContext.Provider>
    );
};
