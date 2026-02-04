import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, AnimatedCounter, TestimonialCard, Badge } from '../components/ui';
import { ProfessionalCard } from '../components/professional';
import { SearchBar } from '../components/search';
import professionalService from '../services/professionalService';

// Import background image
import HeroBackground from '../assets/img/cards/kaylee-garrett-GaprWyIw66o-unsplash.jpg';

// Import How It Works section backgrounds
import FindProfessionalBg from '../assets/img/cards/wmremove-transformed.jpeg';
import BookSessionBg from '../assets/img/cards/samantha-borges-gXsJ9Ywb5as-unsplash.jpg';
import AttendAppointmentBg from '../assets/img/cards/vitaly-gariev-JyPAY9-WNE8-unsplash.jpg';
import ContinueJourneyBg from '../assets/img/cards/pexels-pixabay-54326.jpg';
import FeaturedProfessionalsBg from '../assets/img/cards/nelka-sGIp9xdj7kA-unsplash.jpg';

/**
 * Production-ready Homepage with all sections for user acquisition.
 */
const HomePage = () => {
    const navigate = useNavigate();
    const [featuredProfessionals, setFeaturedProfessionals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedProfessionals();
    }, []);

    const fetchFeaturedProfessionals = async () => {
        try {
            const response = await professionalService.search({ limit: 6, sort_by: 'rating' });
            setFeaturedProfessionals(response.professionals || response.data || []);
        } catch (err) {
            // Use mock data if API not ready
            setFeaturedProfessionals(mockProfessionals);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query) => {
        navigate(`/professionals?q=${encodeURIComponent(query)}`);
    };

    // Category data
    const categories = [
        { id: 'yoga_therapist', name: 'Yoga Therapists', icon: '🧘', color: 'from-purple-500 to-purple-600', count: '150+', link: '/professionals?type=yoga_therapist' },
        { id: 'doctor', name: 'Doctors', icon: '👨‍⚕️', color: 'from-blue-500 to-blue-600', count: '200+', link: '/professionals?type=doctor' },
        { id: 'nutritionist', name: 'Nutritionists', icon: '🍎', color: 'from-green-500 to-green-600', count: '100+', link: '/professionals?type=nutritionist' },
        { id: 'psychologist', name: 'Psychologists', icon: '🧠', color: 'from-teal-500 to-teal-600', count: '80+', link: '/professionals?type=psychologist' },
        { id: 'nurse', name: 'Nurses', icon: '👩‍⚕️', color: 'from-pink-500 to-pink-600', count: '120+', link: '/professionals?type=nurse' },
    ];

    // How it works steps with background images
    const steps = [
        {
            number: '01',
            title: 'Find Your Professional',
            description: 'Explore our network of verified healthcare professionals. Filter by specialty, location, and availability.',
            image: FindProfessionalBg,
            icon: '🔍',
        },
        {
            number: '02',
            title: 'Book Your Session',
            description: 'Select a convenient time, pay safely with our secure payment system, and get instant confirmation.',
            image: BookSessionBg,
            icon: '📅',
        },
        {
            number: '03',
            title: 'Attend Your Appointment',
            description: 'Meet via secure video call or in-person. Get personalized care from qualified professionals.',
            image: AttendAppointmentBg,
            icon: '🎥',
        },
        {
            number: '04',
            title: 'Continue Your Journey',
            description: 'Track your progress, book follow-ups, and achieve your wellness goals with ongoing support.',
            image: ContinueJourneyBg,
            icon: '🌟',
        },
    ];

    // Trust signals
    const trustSignals = [
        { icon: '✓', title: 'Verified Credentials', description: 'Every professional is background-checked and credential-verified' },
        { icon: '🔒', title: 'Secure & Private', description: 'HIPAA-compliant, end-to-end encrypted platform' },
        { icon: '📅', title: 'Flexible Scheduling', description: 'Book 24/7, cancel or reschedule anytime' },
        { icon: '💯', title: 'Satisfaction Guaranteed', description: "Money-back guarantee on your first session" },
    ];

    // Testimonials
    const testimonials = [
        {
            quote: "Finding a yoga therapist who understood my chronic pain was life-changing. The booking process was seamless and my therapist is amazing!",
            author: "Emma Thompson",
            role: "Yoga Client",
            rating: 5,
            verified: true,
        },
        {
            quote: "As someone with a busy schedule, being able to book video consultations with my nutritionist has been incredible. Highly recommend!",
            author: "Michael Chen",
            role: "Nutrition Client",
            rating: 5,
            verified: true,
        },
        {
            quote: "The platform made it easy to find a psychologist who specializes in anxiety. The verification badges gave me confidence in my choice.",
            author: "Sarah Williams",
            role: "Psychology Client",
            rating: 5,
            verified: true,
        },
    ];

    // Stats
    const stats = [
        { value: 500, suffix: '+', label: 'Verified Professionals' },
        { value: 10000, suffix: '+', label: 'Sessions Completed' },
        { value: 50, suffix: '+', label: 'Countries Served' },
        { value: 4.9, suffix: '/5', label: 'Average Rating', decimals: 1 },
    ];

    return (
        <div className="min-h-screen">
            {/* ===================== HERO SECTION WITH BACKGROUND IMAGE ===================== */}
            <section
                className="relative min-h-[90vh] flex items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden"
                style={{ backgroundImage: `url(${HeroBackground})` }}
            >
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />

                {/* Floating Wellness Icons */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Lotus - top left */}
                    <div className="absolute top-[15%] left-[10%] text-4xl opacity-20 animate-float">
                        🪷
                    </div>
                    {/* Heart - top right */}
                    <div className="absolute top-[20%] right-[15%] text-3xl opacity-15 animate-float-slow">
                        💚
                    </div>
                    {/* Leaf - bottom left */}
                    <div className="absolute bottom-[25%] left-[8%] text-3xl opacity-20 animate-float-delayed">
                        🌿
                    </div>
                    {/* Star - bottom right */}
                    <div className="absolute bottom-[30%] right-[10%] text-2xl opacity-15 animate-float">
                        ✨
                    </div>
                    {/* Yoga pose - middle left */}
                    <div className="absolute top-[50%] left-[5%] text-4xl opacity-10 animate-float-slow">
                        🧘‍♀️
                    </div>
                    {/* Meditation - middle right */}
                    <div className="absolute top-[40%] right-[5%] text-3xl opacity-10 animate-float-delayed">
                        🧘
                    </div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
                    {/* Trust badge */}
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 mb-8 border border-white/30">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-sm text-white/90">500+ Verified Professionals • 10,000+ Sessions Completed</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                        Your Complete <span className="text-primary-300">Wellness Journey</span>
                        <br />Starts Here
                    </h1>

                    <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 drop-shadow">
                        Connect with verified healthcare professionals from anywhere.
                        Book yoga therapists, doctors, nutritionists, and more.
                    </p>

                    {/* Search bar */}
                    <div className="max-w-2xl mx-auto mb-8">
                        <SearchBar
                            placeholder="Search for professionals, specialties, or conditions..."
                            onSearch={handleSearch}
                        />
                    </div>

                    {/* Category icons */}
                    <div className="flex flex-wrap justify-center gap-3 mb-10">
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                to={cat.link}
                                className="flex items-center gap-2 bg-white/20 backdrop-blur-md hover:bg-white/30 border border-white/30 rounded-full px-4 py-2 text-sm font-medium text-white hover:text-white transition-all hover:shadow-lg"
                            >
                                <span>{cat.icon}</span>
                                <span>{cat.name}</span>
                            </Link>
                        ))}
                    </div>

                    {/* CTA buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/professionals">
                            <Button variant="primary" size="lg" className="shadow-xl">
                                Find a Professional
                            </Button>
                        </Link>
                        <Link to="/join-professional">
                            <Button variant="ghost" size="lg" className="text-white border-white/50 hover:bg-white/20">
                                For Professionals →
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </section>

            {/* ===================== HOW IT WORKS ===================== */}
            <section className="py-20 bg-white dark:bg-earth-900 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-earth-900 dark:text-white mb-4 transition-colors">
                            How It Works
                        </h2>
                        <p className="text-lg text-earth-600 dark:text-earth-300 max-w-2xl mx-auto transition-colors">
                            Getting started is easy. Find your perfect wellness professional in four simple steps.
                        </p>
                    </div>

                    {/* 4 Cards with Background Images */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {steps.map((step) => (
                            <div
                                key={step.number}
                                className="group relative h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
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
                                    <div className="absolute top-4 left-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold border border-white/30">
                                        {step.number}
                                    </div>

                                    {/* Icon */}
                                    <span className="text-4xl mb-3">{step.icon}</span>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary-300 transition-colors">
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
            </section>

            {/* ===================== FEATURED PROFESSIONALS ===================== */}
            <section
                className="py-20 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${FeaturedProfessionalsBg})` }}
            >
                {/* Overlay for readability - reduced opacity for visibility */}
                <div className="absolute inset-0 bg-white/40 dark:bg-earth-900/80 transition-colors duration-300" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-earth-900 dark:text-white mb-2 transition-colors">
                                Meet Our Top-Rated Professionals
                            </h2>
                            <p className="text-earth-600 dark:text-earth-200 transition-colors">
                                Trusted by thousands of clients for their expertise and care.
                            </p>
                        </div>
                        <Link to="/professionals" className="text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1">
                            View All
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                                    <div className="flex gap-4 mb-4">
                                        <div className="w-16 h-16 bg-earth-200 rounded-full" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-earth-200 rounded w-3/4" />
                                            <div className="h-3 bg-earth-200 rounded w-1/2" />
                                        </div>
                                    </div>
                                    <div className="h-3 bg-earth-200 rounded w-full mb-2" />
                                    <div className="h-3 bg-earth-200 rounded w-2/3" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredProfessionals.map((professional) => (
                                <ProfessionalCard key={professional.id} professional={professional} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ===================== TRUST SIGNALS ===================== */}
            <section className="py-20 bg-white dark:bg-earth-900 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-earth-900 dark:text-white mb-4 transition-colors">
                            Why 10,000+ People Trust Kaivalya
                        </h2>
                        <p className="text-lg text-earth-600 dark:text-earth-300 max-w-2xl mx-auto transition-colors">
                            We're committed to providing a safe, reliable, and professional wellness experience.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {trustSignals.map((signal) => (
                            <div key={signal.title} className="bg-earth-50 dark:bg-earth-800 rounded-xl p-6 text-center hover:shadow-card transition-all duration-300">
                                <div className="text-4xl mb-4">{signal.icon}</div>
                                <h3 className="text-lg font-semibold text-earth-900 dark:text-white mb-2 transition-colors">
                                    {signal.title}
                                </h3>
                                <p className="text-sm text-earth-600 dark:text-earth-300 transition-colors">
                                    {signal.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===================== TESTIMONIALS ===================== */}
            <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-earth-900 dark:to-earth-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-earth-900 dark:text-white mb-4 transition-colors">
                            What Our Clients Say
                        </h2>
                        <p className="text-lg text-earth-600 dark:text-earth-300 max-w-2xl mx-auto transition-colors">
                            Hear from people who have transformed their wellness journey with us.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <TestimonialCard key={index} testimonial={testimonial} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ===================== CATEGORIES ===================== */}
            <section className="py-20 bg-white dark:bg-earth-900 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-earth-900 dark:text-white mb-4 transition-colors">
                            Find the Right Professional for You
                        </h2>
                        <p className="text-lg text-earth-600 dark:text-earth-300 max-w-2xl mx-auto transition-colors">
                            Explore our diverse network of wellness professionals across multiple specialties.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                to={category.link}
                                className={`group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${category.color} text-white hover:scale-105 transition-transform`}
                            >
                                <div className="text-5xl mb-4">{category.icon}</div>
                                <h3 className="text-lg font-semibold mb-1">{category.name}</h3>
                                <p className="text-white/80 text-sm mb-4">{category.count} Professionals</p>
                                <span className="inline-flex items-center text-sm font-medium group-hover:underline">
                                    Explore
                                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===================== STATS ===================== */}
            <section className="py-16 bg-earth-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        {stats.map((stat) => (
                            <div key={stat.label}>
                                <div className="text-4xl md:text-5xl font-bold mb-2">
                                    <AnimatedCounter
                                        target={stat.value}
                                        suffix={stat.suffix}
                                        decimals={stat.decimals || 0}
                                    />
                                </div>
                                <p className="text-earth-300">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===================== FINAL CTA ===================== */}
            <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Ready to Start Your Wellness Journey?
                    </h2>
                    <p className="text-lg text-primary-100 mb-10 max-w-2xl mx-auto">
                        Join thousands of people who have found their perfect wellness professional.
                        Book your first session today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/professionals">
                            <Button variant="secondary" size="lg" className="bg-white text-primary-600 hover:bg-primary-50">
                                Find a Professional Now
                            </Button>
                        </Link>
                        <Link to="/signup?type=professional">
                            <Button variant="ghost" size="lg" className="text-white border-white hover:bg-primary-500">
                                Join Our Network →
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

// Mock professionals for demo when API not ready
const mockProfessionals = [
    {
        id: 1,
        name: 'Dr. Sarah Johnson',
        type: 'yoga_therapist',
        specialization: 'Therapeutic Yoga & Meditation',
        rating: 4.9,
        review_count: 127,
        hourly_rate: 85,
        location: 'Sydney, Australia',
        is_verified: true,
        bio: 'Certified yoga therapist with 15+ years of experience helping clients achieve physical and mental wellness through personalized yoga practices.',
    },
    {
        id: 2,
        name: 'Dr. Michael Chen',
        type: 'doctor',
        specialization: 'Integrative Medicine',
        rating: 4.8,
        review_count: 89,
        hourly_rate: 150,
        location: 'Melbourne, Australia',
        is_verified: true,
        bio: 'Board-certified physician specializing in holistic approaches to healthcare, combining traditional medicine with complementary therapies.',
    },
    {
        id: 3,
        name: 'Emily Rodriguez',
        type: 'nutritionist',
        specialization: 'Plant-Based Nutrition',
        rating: 4.9,
        review_count: 64,
        hourly_rate: 75,
        location: 'Brisbane, Australia',
        is_verified: true,
        bio: 'Helping you achieve optimal health through personalized nutrition plans focused on whole foods and sustainable eating habits.',
    },
    {
        id: 4,
        name: 'Dr. James Wilson',
        type: 'psychologist',
        specialization: 'Anxiety & Stress Management',
        rating: 4.7,
        review_count: 112,
        hourly_rate: 120,
        location: 'Perth, Australia',
        is_verified: true,
        bio: 'Clinical psychologist specializing in evidence-based treatments for anxiety, depression, and stress-related disorders.',
    },
    {
        id: 5,
        name: 'Lisa Park',
        type: 'nurse',
        specialization: 'Holistic Health Coaching',
        rating: 4.8,
        review_count: 45,
        hourly_rate: 65,
        location: 'Adelaide, Australia',
        is_verified: true,
        bio: 'Registered nurse with additional training in health coaching, helping clients achieve lasting lifestyle changes.',
    },
    {
        id: 6,
        name: 'Priya Sharma',
        type: 'yoga_therapist',
        specialization: 'Prenatal & Postnatal Yoga',
        rating: 5.0,
        review_count: 78,
        hourly_rate: 90,
        location: 'Online',
        is_verified: true,
        bio: 'Specialized in supporting women through pregnancy and postpartum with gentle, therapeutic yoga practices.',
    },
];

export default HomePage;

