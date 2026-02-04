import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Spinner } from '../../components/ui';
import { useCurrency } from '../../contexts/CurrencyContext';

/**
 * Request Payout page - Multi-step payout request form.
 */
const RequestPayout = () => {
    const navigate = useNavigate();
    const { formatPrice, currency } = useCurrency();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [availableBalance, setAvailableBalance] = useState(1850);
    const [formData, setFormData] = useState({
        amount: '',
        payment_method_id: '',
    });
    const [paymentMethods, setPaymentMethods] = useState([
        { id: 1, type: 'bank', label: 'Bank Account', details: '****1234' },
        { id: 2, type: 'paypal', label: 'PayPal', details: 'user@email.com' },
    ]);
    const [submitting, setSubmitting] = useState(false);
    const [payoutId, setPayoutId] = useState(null);

    const processingFee = formData.payment_method_id === 2 ? 5 : 0;
    const netAmount = (parseFloat(formData.amount) || 0) - processingFee;

    const handleNext = () => {
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setPayoutId('PO-' + Date.now());
            setStep(4);
        } catch (error) {
            console.error('Failed to request payout:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const isStep1Valid = formData.amount && parseFloat(formData.amount) >= 50 && parseFloat(formData.amount) <= availableBalance;
    const isStep2Valid = formData.payment_method_id;

    return (
        <div className="min-h-screen bg-earth-50 pt-20 pb-12">
            <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link to="/professional/payouts" className="text-primary-600 hover:text-primary-700 text-sm">
                        ← Back to Payouts
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-bold text-earth-900 mt-4">Request Payout</h1>
                </div>

                {/* Progress Steps */}
                {step < 4 && (
                    <div className="flex items-center justify-between mb-8">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${s <= step ? 'bg-primary-600 text-white' : 'bg-earth-200 text-earth-500'
                                    }`}>
                                    {s}
                                </div>
                                {s < 3 && (
                                    <div className={`w-16 sm:w-24 h-1 mx-2 ${s < step ? 'bg-primary-600' : 'bg-earth-200'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-card p-6">
                    {/* Step 1: Choose Amount */}
                    {step === 1 && (
                        <div>
                            <h2 className="text-lg font-semibold text-earth-900 mb-4">Choose Amount</h2>

                            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
                                <p className="text-sm text-primary-700">Available Balance</p>
                                <p className="text-3xl font-bold text-primary-600">{formatPrice(availableBalance)}</p>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-earth-700 mb-2">
                                    Amount to Withdraw
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-500">{currency}</span>
                                    <input
                                        type="number"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        placeholder="0.00"
                                        min="50"
                                        max={availableBalance}
                                        className="w-full pl-10 pr-4 py-3 border border-earth-200 rounded-lg text-lg focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                                {formData.amount && parseFloat(formData.amount) < 50 && (
                                    <p className="text-sm text-red-500 mt-1">Minimum payout is $50</p>
                                )}
                                {formData.amount && parseFloat(formData.amount) > availableBalance && (
                                    <p className="text-sm text-red-500 mt-1">Amount exceeds available balance</p>
                                )}
                            </div>

                            <p className="text-sm text-earth-500 mb-6">
                                💡 Funds from sessions completed within the last 7 days are on hold.
                            </p>

                            <div className="flex justify-end">
                                <Button
                                    variant="primary"
                                    onClick={handleNext}
                                    disabled={!isStep1Valid}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Select Payment Method */}
                    {step === 2 && (
                        <div>
                            <h2 className="text-lg font-semibold text-earth-900 mb-4">Select Payment Method</h2>

                            <div className="space-y-3 mb-6">
                                {paymentMethods.map((method) => (
                                    <button
                                        key={method.id}
                                        onClick={() => setFormData({ ...formData, payment_method_id: method.id })}
                                        className={`w-full p-4 border rounded-lg flex items-center gap-4 transition-colors ${formData.payment_method_id === method.id
                                                ? 'border-primary-500 bg-primary-50'
                                                : 'border-earth-200 hover:border-earth-300'
                                            }`}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${method.type === 'bank' ? 'bg-blue-100' : 'bg-yellow-100'
                                            }`}>
                                            {method.type === 'bank' ? '🏦' : '💳'}
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="font-medium text-earth-900">{method.label}</p>
                                            <p className="text-sm text-earth-500">{method.details}</p>
                                        </div>
                                        {formData.payment_method_id === method.id && (
                                            <svg className="h-5 w-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                                + Add New Payment Method
                            </button>

                            <div className="flex justify-between mt-6">
                                <Button variant="ghost" onClick={handleBack}>Back</Button>
                                <Button variant="primary" onClick={handleNext} disabled={!isStep2Valid}>Next</Button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Review & Confirm */}
                    {step === 3 && (
                        <div>
                            <h2 className="text-lg font-semibold text-earth-900 mb-4">Review & Confirm</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between py-2 border-b border-earth-100">
                                    <span className="text-earth-500">Payout Amount</span>
                                    <span className="font-medium text-earth-900">{formatPrice(parseFloat(formData.amount))}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-earth-100">
                                    <span className="text-earth-500">Processing Fee</span>
                                    <span className="font-medium text-earth-900">{formatPrice(processingFee)}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-earth-700 font-medium">Net Amount</span>
                                    <span className="text-xl font-bold text-primary-600">{formatPrice(netAmount)}</span>
                                </div>
                                <div className="flex justify-between py-2 border-t border-earth-100">
                                    <span className="text-earth-500">Payment Method</span>
                                    <span className="font-medium text-earth-900">
                                        {paymentMethods.find(m => m.id === formData.payment_method_id)?.label}
                                    </span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-earth-500">Estimated Arrival</span>
                                    <span className="font-medium text-earth-900">3-5 business days</span>
                                </div>
                            </div>

                            <p className="text-sm text-earth-500 mb-6">
                                By requesting this payout, you confirm that you have provided accurate payment information and agree to our terms.
                            </p>

                            <div className="flex justify-between">
                                <Button variant="ghost" onClick={handleBack}>Back</Button>
                                <Button
                                    variant="primary"
                                    onClick={handleSubmit}
                                    loading={submitting}
                                    disabled={submitting}
                                >
                                    Confirm Payout Request
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Confirmation */}
                    {step === 4 && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-earth-900 mb-2">Payout Requested!</h2>
                            <p className="text-earth-500 mb-4">Your request has been submitted successfully.</p>

                            <div className="bg-earth-50 rounded-lg p-4 mb-6 text-left">
                                <p className="text-sm text-earth-500">Payout ID</p>
                                <p className="font-mono font-medium text-earth-900">{payoutId}</p>
                            </div>

                            <div className="text-sm text-earth-600 space-y-2 mb-6">
                                <p>✓ Processing typically takes 3-5 business days</p>
                                <p>✓ You'll receive an email when it's processed</p>
                                <p>✓ Track status in your payout history</p>
                            </div>

                            <div className="flex gap-4 justify-center">
                                <Link to="/professional/payouts">
                                    <Button variant="ghost">View Payout History</Button>
                                </Link>
                                <Link to="/professional-dashboard">
                                    <Button variant="primary">Back to Dashboard</Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RequestPayout;
