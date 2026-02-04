import React from 'react';
import { useCurrency } from '../contexts/CurrencyContext';

const PriceDisplay = ({ amountAUD, className = "" }) => {
    const { formatPrice, loading } = useCurrency();

    if (loading) return <span className={className}>...</span>;

    return (
        <span className={className}>
            {formatPrice(amountAUD)}
        </span>
    );
};

export default PriceDisplay;
