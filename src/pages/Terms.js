import React from 'react';

const Terms = () => {
    return (
        <div className="container mx-auto px-4 py-20 min-h-screen bg-white dark:bg-earth-900 transition-colors duration-300">
            <h1 className="text-3xl font-bold mb-8 text-earth-900 dark:text-white">Terms of Service</h1>
            <div className="prose max-w-none dark:prose-invert">
                <p className="text-earth-600 dark:text-earth-300">Last updated: {new Date().toLocaleDateString()}</p>
                <p className="text-earth-700 dark:text-earth-200">Welcome to Kaivalya Yoga Studio. By using our website and services, you agree to these terms.</p>

                <h3 className="text-earth-900 dark:text-white mt-6 mb-2 font-semibold">1. Services</h3>
                <p className="text-earth-700 dark:text-earth-200">We provide online and in-person yoga classes. Schedules and availability are subject to change.</p>

                <h3 className="text-earth-900 dark:text-white mt-6 mb-2 font-semibold">2. Payments and Currencies</h3>
                <p className="text-earth-700 dark:text-earth-200">We process payments securely via Stripe. While we display prices in multiple currencies for your convenience, transactions may be processed in your local currency or AUD depending on your bank and location.</p>

                <h3 className="text-earth-900 dark:text-white mt-6 mb-2 font-semibold">3. User Accounts</h3>
                <p className="text-earth-700 dark:text-earth-200">You are responsible for maintaining the confidentiality of your account credentials.</p>
            </div>
        </div>
    );
};

export default Terms;
