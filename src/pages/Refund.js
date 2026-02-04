import React from 'react';

const Refund = () => {
    return (
        <div className="container mx-auto px-4 py-20 min-h-screen">
            <h1 className="text-3xl font-bold mb-8">Refund Policy</h1>
            <div className="prose max-w-none">
                <p>We want you to be satisfied with your practice.</p>

                <h3>1. Class Cancellations</h3>
                <p>You can cancel a class booking up to 24 hours in advance for a full credit refund.</p>

                <h3>2. Memberships</h3>
                <p>Monthly memberships can be cancelled at any time, but typically run until the end of the billing cycle. Refunds for unused time are generally not provided unless required by local law.</p>

                <h3>3. Currency</h3>
                <p>Refunds are processed in the currency of the original transaction.</p>
            </div>
        </div>
    );
};

export default Refund;
