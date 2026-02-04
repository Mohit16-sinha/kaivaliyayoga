import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui';

// Import background images for steps
import FindProfessionalBg from '../../assets/img/cards/wmremove-transformed.jpeg';
import BookSessionBg from '../../assets/img/cards/samantha-borges-gXsJ9Ywb5as-unsplash.jpg';
import AttendAppointmentBg from '../../assets/img/cards/vitaly-gariev-JyPAY9-WNE8-unsplash.jpg';
import ContinueJourneyBg from '../../assets/img/cards/pexels-pixabay-54326.jpg';

/**
 * How It Works page with beautiful background image cards.
 */
const HowItWorks = () => {
    const steps = [
        {
            number: '01',
            title: 'Find Your Professional',
            description: 'Browse our verified wellness professionals or use our smart search to find the perfect match for your needs.',
            image: FindProfessionalBg,
            icon: '🔍',
        },
        {
            number: '02',
            title: 'Book Your Session',
            description: 'Choose a convenient time slot that works for you. All sessions can be in-person or virtual.',
            image: BookSessionBg,
            icon: '📅',
        },
        {
            number: '03',
            title: 'Attend Your Appointment',
            description: 'Meet with your professional for personalized guidance on your wellness journey.',
            image: AttendAppointmentBg,
            icon: '🎥',
        },
        {
            number: '04',
            title: 'Continue Your Journey',
            description: 'Track your progress, schedule follow-ups, and build a lasting relationship with your wellness team.',
            image: ContinueJourneyBg,
            icon: '🌟',
        },
    ];

    const benefits = [
        {
            title: 'Verified Professionals',
            description: 'All our professionals undergo rigorous verification of credentials and experience.',
            icon: '✓',
            color: 'bg-success-50 text-success-600',
        },
        {
            title: 'Secure Payments',
            description: 'Your payments are protected with industry-standard encryption.',
            icon: '🔒',
            color: 'bg-blue-50 text-blue-600',
        },
        {
            title: 'Flexible Scheduling',
            description: 'Book sessions at times that work for you, including evenings and weekends.',
            icon: '📅',
            color: 'bg-purple-50 text-purple-600',
        },
        {
            title: 'Video Consultations',
            description: 'Connect with professionals from anywhere via secure video calls.',
            icon: '💻',
            color: 'bg-pink-50 text-pink-600',
        },
    ];

    return (
        <div className="min-h-screen bg-white pt-20">
            {/* Hero */}
            <div className="bg-gradient-to-br from-primary-500 via-purple-500 to-pink-500 py-20 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white rounded-full blur-3xl" />
                    <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-white rounded-full blur-3xl" />
                </div>

                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        How Kaivalya Wellness Works
                    </h1>
                    <p className="text-lg text-white/90 max-w-2xl mx-auto">
                        Your journey to wellness is just four simple steps away.
                        We make it easy to find, book, and connect with the right professional.
                    </p>
                </div>
            </div>

            {/* Steps with Background Images */}
            <div className="py-20 bg-earth-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-earth-900 mb-4">
                            Your Wellness Journey
                        </h2>
                        <p className="text-earth-600 max-w-2xl mx-auto">
                            Follow these four simple steps to start your path to wellness.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {steps.map((step) => (
                            <div
                                key={step.number}
                                className="group relative h-96 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                            >
                                {/* Background Image */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: `url(${step.image})` }}
                                />

                                {/* Dark Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

                                {/* Content */}
                                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                                    {/* Step Number Badge */}
                                    <div className="absolute top-4 left-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-lg border border-white/30">
                                        {step.number}
                                    </div>

                                    {/* Icon */}
                                    <span className="text-5xl mb-4">{step.icon}</span>

                                    {/* Title */}
                                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary-300 transition-colors">
                                        {step.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm text-white/80 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Benefits */}
            <div className="bg-white py-20">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-earth-900 mb-12">
                        Why Choose Kaivalya Wellness?
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {benefits.map((benefit) => (
                            <div
                                key={benefit.title}
                                className="bg-white rounded-2xl p-6 text-center shadow-soft border border-earth-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className={`w-16 h-16 ${benefit.color} rounded-full flex items-center justify-center text-3xl mx-auto mb-4`}>
                                    {benefit.icon}
                                </div>
                                <h3 className="font-semibold text-earth-900 mb-2">{benefit.title}</h3>
                                <p className="text-sm text-earth-600">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="py-20 bg-gradient-to-br from-primary-500 to-purple-600">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to Start Your Wellness Journey?
                    </h2>
                    <p className="text-white/90 mb-8 text-lg">
                        Join thousands of people who have found their perfect wellness match.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/professionals">
                            <Button variant="secondary" size="lg" className="bg-white text-primary-600 hover:bg-primary-50 shadow-lg">
                                Find a Professional
                            </Button>
                        </Link>
                        <Link to="/signup">
                            <Button variant="ghost" size="lg" className="text-white border-white hover:bg-white/20">
                                Create Free Account
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
