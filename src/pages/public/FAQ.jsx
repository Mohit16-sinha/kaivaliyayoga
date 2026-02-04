import React, { useState } from 'react';
import { Card } from '../../components/ui';

/**
 * FAQ Page with expandable questions.
 */
const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            category: 'General',
            questions: [
                {
                    q: 'What is Kaivalya Wellness?',
                    a: 'Kaivalya Wellness is a marketplace connecting you with verified wellness professionals including yoga therapists, doctors, nutritionists, psychologists, and nurses. We make it easy to find, book, and attend sessions both online and in-person.',
                },
                {
                    q: 'How do I get started?',
                    a: 'Simply create a free account, browse our verified professionals, and book your first session. You can search by specialty, location, ratings, and availability.',
                },
                {
                    q: 'Is there a mobile app?',
                    a: 'Our platform is fully responsive and works great on mobile browsers. We are also developing native mobile apps for iOS and Android, coming soon!',
                },
            ],
        },
        {
            category: 'Booking & Appointments',
            questions: [
                {
                    q: 'How do I book an appointment?',
                    a: 'Find a professional you like, view their available time slots, select a service, and confirm your booking. You will receive email confirmation with all the details.',
                },
                {
                    q: 'Can I cancel or reschedule my appointment?',
                    a: 'Yes, you can cancel or reschedule up to 24 hours before your appointment for a full refund. Cancellations within 24 hours may be subject to the professional\'s cancellation policy.',
                },
                {
                    q: 'Are virtual appointments available?',
                    a: 'Many of our professionals offer video consultations. Look for the "Virtual" badge on their profile or filter specifically for online sessions.',
                },
            ],
        },
        {
            category: 'Payments & Pricing',
            questions: [
                {
                    q: 'What payment methods do you accept?',
                    a: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers in select regions.',
                },
                {
                    q: 'Are prices shown in my local currency?',
                    a: 'Yes! We support multiple currencies including AUD, USD, EUR, GBP, and INR. Use the currency selector in the navigation to change your preference.',
                },
                {
                    q: 'Is there a subscription or membership fee?',
                    a: 'Creating an account and browsing professionals is completely free. You only pay when you book a session.',
                },
            ],
        },
        {
            category: 'For Professionals',
            questions: [
                {
                    q: 'How can I join as a professional?',
                    a: 'Click "For Professionals" in the navigation and complete the application form. We will verify your credentials and get back to you within 2-3 business days.',
                },
                {
                    q: 'What are the platform fees?',
                    a: 'We charge a competitive commission on each booking. This covers payment processing, platform maintenance, and customer support. Contact us for current rates.',
                },
                {
                    q: 'How do I get paid?',
                    a: 'Payments are released to your connected bank account weekly. You can view all your earnings and pending payouts in your professional dashboard.',
                },
            ],
        },
    ];

    const toggleQuestion = (categoryIndex, questionIndex) => {
        const key = `${categoryIndex}-${questionIndex}`;
        setOpenIndex(openIndex === key ? null : key);
    };

    return (
        <div className="min-h-screen bg-earth-50 pt-20">
            {/* Hero */}
            <div className="bg-white py-12 border-b border-earth-100">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold text-earth-900 mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-earth-600">
                        Find answers to common questions about Kaivalya Wellness.
                    </p>
                </div>
            </div>

            {/* FAQ Content */}
            <div className="max-w-3xl mx-auto px-4 py-12">
                {faqs.map((category, categoryIndex) => (
                    <div key={category.category} className="mb-8">
                        <h2 className="text-xl font-semibold text-earth-900 mb-4">
                            {category.category}
                        </h2>
                        <div className="space-y-3">
                            {category.questions.map((item, questionIndex) => {
                                const key = `${categoryIndex}-${questionIndex}`;
                                const isOpen = openIndex === key;

                                return (
                                    <Card key={key} className="overflow-hidden" noPadding>
                                        <button
                                            onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                                            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-earth-50 transition-colors"
                                        >
                                            <span className="font-medium text-earth-900">{item.q}</span>
                                            <svg
                                                className={`h-5 w-5 text-earth-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {isOpen && (
                                            <div className="px-6 pb-4 text-earth-600 text-sm">
                                                {item.a}
                                            </div>
                                        )}
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Contact CTA */}
                <div className="mt-12 text-center bg-primary-50 rounded-xl p-8">
                    <h3 className="text-lg font-semibold text-earth-900 mb-2">
                        Still have questions?
                    </h3>
                    <p className="text-earth-600 mb-4">
                        Our support team is here to help you.
                    </p>
                    <a
                        href="/contact"
                        className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700"
                    >
                        Contact Support
                        <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
