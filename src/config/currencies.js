/**
 * Supported Currencies Configuration
 * This file defines all available currencies for the application.
 */

export const CURRENCIES = [
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺' },
    { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
    { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬' },
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', flag: '🇦🇪' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳' },
    { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', flag: '🇨🇭' },
    { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', flag: '🇭🇰' },
    { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', flag: '🇳🇿' },
    { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', flag: '🇸🇪' },
    { code: 'KRW', symbol: '₩', name: 'South Korean Won', flag: '🇰🇷' },
    { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', flag: '🇧🇷' },
    { code: 'RUB', symbol: '₽', name: 'Russian Ruble', flag: '🇷🇺' },
    { code: 'ZAR', symbol: 'R', name: 'South African Rand', flag: '🇿🇦' },
    { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso', flag: '🇲🇽' },
    { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', flag: '🇸🇦' },
];

// Exchange rates relative to USD (base = 1 USD)
export const EXCHANGE_RATES = {
    USD: 1,
    AUD: 1.52,
    INR: 83.5,
    EUR: 0.92,
    GBP: 0.79,
    CAD: 1.37,
    SGD: 1.35,
    AED: 3.67,
    JPY: 151.50,
    CNY: 7.23,
    CHF: 0.91,
    HKD: 7.83,
    NZD: 1.67,
    SEK: 10.85,
    KRW: 1350.00,
    BRL: 5.15,
    RUB: 92.50,
    ZAR: 18.80,
    MXN: 16.70,
    SAR: 3.75,
};

export const DEFAULT_CURRENCY = 'AUD';

// Base prices are in AUD
export const BASE_PRICES_AUD = {
    drop_in: 29.00,
    monthly: 99.00,
    quarterly: 249.00,
    foundation: 149.00,
    meditation: 89.00,
    teacher_training: 899.00,
};

// Helper to get currency by code
export const getCurrencyByCode = (code) => {
    return CURRENCIES.find(c => c.code === code) || CURRENCIES[0];
};
