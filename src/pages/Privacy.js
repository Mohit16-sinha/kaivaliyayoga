import React from 'react';

const Privacy = () => {
    return (
        <div className="container mx-auto px-4 py-20 min-h-screen bg-white dark:bg-earth-900 transition-colors duration-300">
            <h1 className="text-3xl font-bold mb-8 text-earth-900 dark:text-white">Privacy Policy</h1>
            <div className="prose max-w-none dark:prose-invert">
                <p className="text-earth-600 dark:text-earth-300">Last updated: {new Date().toLocaleDateString()}</p>
                <p className="text-earth-700 dark:text-earth-200">Your privacy is important to us. This policy explains how we collect and use your data.</p>

                <h3 className="text-earth-900 dark:text-white mt-6 mb-2 font-semibold">1. Information We Collect</h3>
                <p className="text-earth-700 dark:text-earth-200">We collect your name, email, and payment history when you create an account.</p>

                <h3 className="text-earth-900 dark:text-white mt-6 mb-2 font-semibold">2. Location Data</h3>
                <p className="text-earth-700 dark:text-earth-200">We may approximate your location based on IP address solely to provide relevant currency options. This data is not stored permanently.</p>

                <h3 className="text-earth-900 dark:text-white mt-6 mb-2 font-semibold">3. Payments</h3>
                <p className="text-earth-700 dark:text-earth-200">We do not store your credit card details. All payments are processed securely by our payment partners (Stripe).</p>
            </div>
        </div>
    );
};

export default Privacy;
