import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui';
import { useCurrency } from '../../contexts/CurrencyContext';

/**
 * Earnings overview card with gradient background for professional dashboard.
 */
const EarningsCard = ({ earnings = {}, onRequestPayout }) => {
    const { formatPrice } = useCurrency();

    const thisMonth = earnings.this_month || 0;
    const lastMonth = earnings.last_month || 0;
    const percentChange = lastMonth > 0
        ? ((thisMonth - lastMonth) / lastMonth * 100).toFixed(1)
        : 0;
    const isPositive = thisMonth >= lastMonth;
    const availableBalance = earnings.available_balance || 0;
    const pendingBalance = earnings.pending_balance || 0;

    return (
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-emerald-100 text-sm">This Month's Earnings</p>
                    <p className="text-4xl font-bold mt-1">{formatPrice(thisMonth)}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${isPositive ? 'bg-emerald-400/30' : 'bg-red-400/30'
                            }`}>
                            {isPositive ? '↑' : '↓'} {Math.abs(percentChange)}% vs last month
                        </span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
                <div>
                    <p className="text-emerald-100 text-xs">Gross</p>
                    <p className="font-semibold">{formatPrice(earnings.gross || thisMonth * 1.2)}</p>
                </div>
                <div>
                    <p className="text-emerald-100 text-xs">Fees</p>
                    <p className="font-semibold">-{formatPrice(earnings.fees || thisMonth * 0.2)}</p>
                </div>
                <div>
                    <p className="text-emerald-100 text-xs">Net</p>
                    <p className="font-semibold">{formatPrice(thisMonth)}</p>
                </div>
            </div>

            <div className="mt-6 p-4 bg-white/10 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <p className="text-emerald-100 text-xs">Available to Withdraw</p>
                        <p className="text-2xl font-bold">{formatPrice(availableBalance)}</p>
                    </div>
                    <Button
                        variant="ghost"
                        className="bg-white text-emerald-600 hover:bg-emerald-50"
                        onClick={onRequestPayout}
                        disabled={availableBalance < 50}
                    >
                        Request Payout
                    </Button>
                </div>
                {pendingBalance > 0 && (
                    <p className="text-emerald-100 text-xs">
                        {formatPrice(pendingBalance)} pending (7-day hold)
                    </p>
                )}
            </div>
        </div>
    );
};

export default EarningsCard;
