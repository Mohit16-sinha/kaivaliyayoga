import React, { useState, useRef, useEffect } from 'react';
import { useCurrency } from '../contexts/CurrencyContext';
import { IoIosArrowDown } from 'react-icons/io';

const CountrySelector = () => {
    const { currency, currentCurrency, currencies, changeCurrency } = useCurrency();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (code) => {
        changeCurrency(code);
        setIsOpen(false);
    };

    return (
        <div className="relative z-50" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-earth-300 dark:border-earth-600 bg-white dark:bg-earth-800 text-earth-700 dark:text-earth-200 hover:bg-earth-50 dark:hover:bg-earth-700 transition-colors text-sm font-medium"
            >
                <span className="text-lg">{currentCurrency?.flag}</span>
                <span>{currentCurrency?.code}</span>
                <IoIosArrowDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 max-h-80 overflow-y-auto rounded-xl shadow-xl bg-white dark:bg-earth-800 border border-earth-200 dark:border-earth-700 py-2">
                    {currencies.map((curr) => (
                        <button
                            key={curr.code}
                            onClick={() => handleSelect(curr.code)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-earth-100 dark:hover:bg-earth-700 transition-colors ${currency === curr.code
                                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                    : 'text-earth-700 dark:text-earth-200'
                                }`}
                        >
                            <span className="text-xl">{curr.flag}</span>
                            <span className="flex-1 font-medium">{curr.name}</span>
                            <span className="text-earth-400 dark:text-earth-500 text-sm">{curr.code}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CountrySelector;
