import React, { useState } from 'react';
import { BsCheckCircleFill } from 'react-icons/bs';
import { useCurrency } from '../contexts/CurrencyContext';
import PriceDisplay from './PriceDisplay';
import { BASE_PRICES_AUD } from '../config/currencies';

const Pricing = () => {
    const { currency, currencyInfo } = useCurrency();
    const [index, setIndex] = useState(0);

    const cards = [
        {
            title: 'Basic Yoga',
            description: 'One single class to keep you going.',
            basePrice: BASE_PRICES_AUD.drop_in,
            priceType: 'class',
            list: [
                'Access to one live class',
                'HD video quality',
                'Instructor feedback'
            ],
            buttonText: 'Book Now'
        },
        {
            title: 'Monthly Limitless',
            description: 'Unlimited access for one month.',
            basePrice: BASE_PRICES_AUD.monthly,
            priceType: 'month',
            list: [
                'Unlimited live classes',
                'Access to video library',
                'Priority support',
                'Community access'
            ],
            buttonText: 'Join Now',
            popular: true
        },
        {
            title: 'Quarterly Save',
            description: 'Commit to your health and save.',
            basePrice: BASE_PRICES_AUD.quarterly,
            priceType: 'quarter',
            list: [
                'All Monthly benefits',
                '15% Savings',
                'Free workshop entry',
                'Personalized plan'
            ],
            buttonText: 'Join Now'
        },
    ];

    const handlePurchase = (plan) => {
        // Placeholder for new flow
        alert(`Payment coming soon for ${plan.title}. Currency: ${currency}`);
    };

    return (
        <section className='section-sm lg:section-lg bg-section'>
            <div className='container mx-auto'>
                <div className='text-center mb-16 lg:mb-24'>
                    <h2 className='h2 mb-4'>Choose your plan</h2>
                    <p className='max-w-[540px] mx-auto text-gray-600'>
                        We have a plan for everyone. Choose the one that suits you best.
                        Prices are approximate conversions from AUD.
                    </p>
                    <div className="mt-4 inline-block bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium">
                        Viewing prices in {currencyInfo?.name} ({currencyInfo?.symbol})
                    </div>
                </div>

                <div className='flex flex-col lg:flex-row gap-y-8 lg:gap-x-8 lg:gap-y-0 items-center justify-center'>
                    {cards.map((card, idx) => {
                        const { title, description, basePrice, list, buttonText, popular, priceType } = card;
                        return (
                            // Card
                            <div
                                onClick={() => setIndex(idx)}
                                key={idx}
                                className={`bg-white w-full max-w-[368px] min-h-[560px] cursor-pointer relative transition-all duration-300 shadow-primary rounded-[20px] 
                                    ${index === idx ? 'scale-105 border-2 border-accent shadow-xl z-10' : 'border border-gray-200 hover:shadow-lg scale-100'} 
                                    flex flex-col`}
                            >
                                {popular && (
                                    <div className='absolute top-0 right-0 bg-accent text-white text-[13px] font-bold px-3 py-1 rounded-bl-[10px] rounded-tr-[10px]'>
                                        POPULAR
                                    </div>
                                )}
                                {/* Header */}
                                <div className='p-8 border-b border-gray-100'>
                                    <h3 className='h3 mb-2'>{title}</h3>
                                    <p className='text-light text-[15px] mb-6'>{description}</p>
                                    <div className='text-3xl font-bold flex items-baseline gap-1 text-earth-900'>
                                        <PriceDisplay amountAUD={basePrice} />
                                        <span className='text-base font-normal text-gray-500'>
                                            / {priceType}
                                        </span>
                                    </div>
                                </div>
                                {/* List */}
                                <div className='p-8 flex-1'>
                                    <ul className='flex flex-col gap-y-4 mb-8'>
                                        {list.map((item, i) => (
                                            <li key={i} className='flex items-center gap-x-3'>
                                                <BsCheckCircleFill className='text-accent text-lg' />
                                                <span className='text-sm text-gray-600'>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {/* Footer */}
                                <div className='p-8 pt-0 mt-auto'>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePurchase(card);
                                        }}
                                        className={`${index === idx ? 'bg-accent text-white hover:bg-accent-hover' : 'border border-accent text-accent hover:bg-accent hover:text-white'} 
                                            w-full rounded-full h-[50px] font-medium transition-all duration-300`}
                                    >
                                        {buttonText}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="text-center mt-12 text-sm text-gray-400">
                    * Transactions are processed in your local currency where supported by Stripe.
                    <br />Base currency is AUD. Exchange rates update daily.
                </div>
            </div>
        </section>
    );
};

export default Pricing;
