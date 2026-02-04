import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui';

// Import background images for journey steps (restored from previous design)
import FindProfessionalBg from '../../assets/img/cards/wmremove-transformed.jpeg';
import BookSessionBg from '../../assets/img/cards/samantha-borges-gXsJ9Ywb5as-unsplash.jpg';
import AttendAppointmentBg from '../../assets/img/cards/vitaly-gariev-JyPAY9-WNE8-unsplash.jpg';
import ContinueJourneyBg from '../../assets/img/cards/pexels-pixabay-54326.jpg';

const AboutUs = () => {
    // 2. What We Offer Data - Detailed Narrative (PRESERVED PERFECT CONTENT)
    const pillars = [
        {
            type: 'yoga',
            icon: '🧘',
            title: 'Yoga Therapists',
            subtitle: 'Union of Mind, Body & Soul',
            philosophy: 'Yoga is not just about flexibility; it is a journey inward. In a world that constantly demands your attention, yoga offers a sanctuary of stillness. It realigns your physical posture and your mental state, allowing you to reimagine yourself not as a machine that works, but as a living being that breathes, feels, and thrives. Our therapists guide you through this transformation, using ancient techniques to heal modern wounds.',
            benefits: ['Manage chronic pain & injury', 'Restore mental clarity & focus', 'Reconnect with your inner self']
        },
        {
            type: 'doctor',
            icon: '👨‍⚕️',
            title: 'Medical Doctors',
            subtitle: 'Science Meets Compassion',
            philosophy: 'Modern medicine effectively bridges the gap between illness and vitality. Our doctors don’t just treat symptoms; they help you understand your biological narrative. By addressing concerns early and accurately, we empower you to take control of your longevity, ensuring your physical vessel is capable of supporting your life’s ambitions. It’s not just sick care; it’s health preservation.',
            benefits: ['Expert medical diagnosis', 'Preventative health strategies', 'Understanding your body’s signals']
        },
        {
            type: 'nutrition',
            icon: '🍎',
            title: 'Nutritionists',
            subtitle: 'Fuel for Your Potential',
            philosophy: 'Food is the most intimate interaction we have with our environment. It isn’t just fuel; it is information for your cells. Our nutritionists move beyond restrictive diets to help you rediscover a joyous, nourishing relationship with food. Correcting your nutritional foundation can clarify your mind, energize your body, and completely reshape how you experience your day.',
            benefits: ['Sustainable energy levels', 'Healing relationship with food', 'Targeted dietary interventions']
        },
        {
            type: 'psychology',
            icon: '🧠',
            title: 'Psychologists',
            subtitle: 'Reclaiming Your Narrative',
            philosophy: 'True wellness is impossible without mental clarity. We often carry invisible burdens—old patterns, unvoiced anxieties, and unresolved trauma. Therapy provides the mirror you need to see yourself clearly. It is a brave act of reimagining your narrative, turning emotional obstacles into stepping stones for resilience and self-discovery.',
            benefits: ['Emotional resilience', 'Breaking negative patterns', 'Safe space for expression']
        },
        {
            type: 'nurse',
            icon: '👩‍⚕️',
            title: 'Registered Nurses',
            subtitle: 'Care with Dignity',
            philosophy: 'Healing is a process that often happens in the quiet moments at home. Our nurses bring professional compassion to your bedside, bridging the intimidating gap between hospital care and daily life. They provide the knowledge and reassurance needed to recover with dignity, ensuring that your path to health is safe, supported, and understood.',
            benefits: ['Post-care confidence', 'Medication mastery', 'Compassionate monitoring']
        }
    ];

    // 3. How It Works Data - Enhanced with Images (RESTORED VISUALS)
    const journeySteps = [
        {
            number: '01',
            title: 'Find Your Professional',
            description: 'Browse our verified wellness professionals by specialty, language, and rating.',
            image: FindProfessionalBg,
            icon: '🔍',
        },
        {
            number: '02',
            title: 'Book Your Session',
            description: 'Choose a convenient time slot that works for you, available 24/7 globally.',
            image: BookSessionBg,
            icon: '📅',
        },
        {
            number: '03',
            title: 'Attend Your Appointment',
            description: 'Meet with your professional via secure video for personalized guidance.',
            image: AttendAppointmentBg,
            icon: '🎥',
        },
        {
            number: '04',
            title: 'Continue Your Journey',
            description: 'Track your progress with digital care plans and build a lasting relationship.',
            image: ContinueJourneyBg,
            icon: '🌟',
        },
    ];

    // 4. Core Values (RESTORED VISUALS)
    const values = [
        {
            title: 'Authenticity',
            description: 'We honor the traditional roots of healing while embracing modern science.',
            icon: '🌿',
            color: 'from-green-400 to-emerald-500',
        },
        {
            title: 'Inclusivity',
            description: 'Wellness is for every body. We create a safe, welcoming space where everyone belongs.',
            icon: '🤝',
            color: 'from-blue-400 to-indigo-500',
        },
        {
            title: 'Community',
            description: 'We grow together. Our platform is a sanctuary where practitioners support one another.',
            icon: '❤️',
            color: 'from-pink-400 to-rose-500',
        },
        {
            title: 'Transformation',
            description: 'We believe in the power of holistic care to heal from the inside out.',
            icon: '✨',
            color: 'from-amber-400 to-orange-500',
        },
    ];

    return (
        <div className="min-h-screen bg-earth-50 dark:bg-earth-900 pt-20 transition-colors duration-300">
            {/* ===================== HERO (ENHANCED) ===================== */}
            <section className="relative bg-gradient-to-br from-primary-600 via-purple-600 to-pink-500 py-32 overflow-hidden text-center text-white">
                {/* Floating Animations */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-20 left-[10%] text-6xl opacity-20 animate-float">🧘</div>
                    <div className="absolute bottom-20 right-[15%] text-5xl opacity-20 animate-float-slow">✨</div>
                    <div className="absolute top-1/3 right-[10%] text-4xl opacity-20 animate-float-delayed">🌿</div>
                </div>

                {/* Background Shapes */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-white rounded-full blur-3xl opacity-20" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-white rounded-full blur-3xl opacity-20" />
                </div>

                <div className="max-w-5xl mx-auto px-4 relative z-10">
                    <h1 className="text-4xl md:text-7xl font-bold mb-8 leading-tight drop-shadow-lg">
                        Wellness Reimagined.
                        <span className="block text-secondary-200 text-3xl md:text-5xl mt-4 font-serif italic">Your Journey Inward Begins Here.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                        Kaivalya connects you with the wisdom of the past and the science of the present. A sanctuary for your mind, body, and soul.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link to="/professionals">
                            <Button variant="secondary" size="lg" className="bg-white text-primary-600 hover:bg-white/90 shadow-xl px-8 py-4 text-lg border-none">
                                Find a Professional
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ===================== INTRO STORY ===================== */}
            <section className="py-24 bg-white dark:bg-earth-800 transition-colors duration-300">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <span className="text-primary-600 dark:text-primary-400 font-semibold uppercase tracking-wider text-sm mb-4 block">Our Philosophy</span>
                    <h2 className="text-4xl font-bold text-earth-900 dark:text-white mb-8">Why Kaivalya?</h2>
                    <div className="prose prose-lg mx-auto text-earth-600 dark:text-earth-300 leading-relaxed">
                        <p className="text-xl mb-6">
                            We started with a simple belief: Health is not just the absence of disease, but the presence of vitality. In a fragmented world, we offer a wholistic sanctuary.
                        </p>
                        <p className="text-xl">
                            By uniting Doctors, Therapists, and Yoga Masters on one platform, we help you build a care team that treats the <em>whole</em> you—combining ancient wisdom with modern science.
                        </p>
                    </div>
                </div>
            </section>

            {/* ===================== DETAILED PILLARS (CONTENT PRESERVED) ===================== */}
            <section className="py-24 bg-earth-50 dark:bg-earth-900 relative overflow-hidden transition-colors duration-300">
                <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white dark:from-earth-800 to-transparent transition-colors duration-300"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold text-earth-900 dark:text-white">Our Pillars of Wellness</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto mt-6 rounded-full"></div>
                    </div>

                    <div className="space-y-32">
                        {pillars.map((pillar, index) => (
                            <div key={pillar.type} className={`flex flex-col md:flex-row gap-16 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''} group`}>

                                {/* Image / Icon Side */}
                                <div className="w-full md:w-1/2 flex justify-center">
                                    <div className="relative w-72 h-72 md:w-96 md:h-96 bg-white dark:bg-earth-800 rounded-full shadow-2xl flex items-center justify-center border-[12px] border-white dark:border-earth-700 group-hover:scale-105 transition-all duration-700">
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-full opacity-50"></div>
                                        <div className="text-9xl animate-float relative z-10">{pillar.icon}</div>

                                        {/* Orbiting Elements */}
                                        <div className="absolute inset-0 border border-dashed border-primary-200 dark:border-primary-700 rounded-full animate-spin-slow"></div>
                                        <div className="absolute -inset-4 border border-primary-100 dark:border-primary-800 rounded-full animate-reverse-spin opacity-50"></div>
                                    </div>
                                </div>

                                {/* Text Side */}
                                <div className="w-full md:w-1/2 text-center md:text-left">
                                    <div className="inline-block bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 px-6 py-2 rounded-full text-sm font-bold mb-6 uppercase tracking-wider shadow-sm border border-transparent dark:border-primary-700">
                                        {pillar.subtitle}
                                    </div>
                                    <h3 className="text-4xl font-bold text-earth-900 dark:text-white mb-8">{pillar.title}</h3>
                                    <blockquote className="text-xl text-earth-600 dark:text-earth-300 leading-relaxed mb-10 border-l-4 border-secondary-300 pl-6 italic">
                                        "{pillar.philosophy}"
                                    </blockquote>

                                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                        {pillar.benefits.map((benefit, i) => (
                                            <span key={i} className="bg-white dark:bg-earth-800 border border-earth-200 dark:border-earth-700 px-5 py-3 rounded-xl text-earth-700 dark:text-earth-200 font-medium shadow-sm hover:shadow-md transition-all flex items-center gap-2">
                                                <span className="text-secondary-500">✓</span> {benefit}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white dark:from-earth-800 to-transparent transition-colors duration-300"></div>
            </section>


            {/* ===================== CORE VALUES (RESTORED BEAUTY) ===================== */}
            <section className="py-24 bg-white dark:bg-earth-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-primary-600 dark:text-primary-400 font-semibold uppercase tracking-wider text-sm mb-4 block">Our DNA</span>
                        <h2 className="text-4xl font-bold text-earth-900 dark:text-white">What We Believe</h2>
                        <p className="text-earth-500 dark:text-earth-400 mt-4 text-lg">Guiding principles that shape every interaction.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value) => (
                            <div
                                key={value.title}
                                className="bg-white dark:bg-earth-700 rounded-3xl p-8 text-center shadow-card hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-earth-100 dark:border-earth-600 group"
                            >
                                <div className={`w-20 h-20 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center text-4xl mx-auto mb-8 shadow-lg group-hover:rotate-6 transition-transform`}>
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-bold text-earth-900 dark:text-white mb-4">{value.title}</h3>
                                <p className="text-earth-600 dark:text-earth-300 leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===================== YOUR JOURNEY (RESTORED VISUALS) ===================== */}
            <section className="py-24 bg-earth-50 dark:bg-earth-900 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-primary-600 dark:text-primary-400 font-semibold uppercase tracking-wider text-sm">How It Works</span>
                        <h2 className="text-4xl font-bold text-earth-900 dark:text-white mt-2 mb-4">
                            Your Wellness Journey
                        </h2>
                        <p className="text-earth-600 dark:text-earth-400 max-w-2xl mx-auto text-lg">
                            Four simple steps to start your path to wellness.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {journeySteps.map((step) => (
                            <div
                                key={step.number}
                                className="group relative h-96 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer border border-transparent dark:border-earth-700"
                            >
                                {/* Background Image */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: `url(${step.image})` }}
                                />

                                {/* Dark Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 group-hover:via-black/50" />

                                {/* Content */}
                                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                                    <div className="absolute top-6 left-6 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white font-bold border border-white/30 text-lg">
                                        {step.number}
                                    </div>

                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <span className="text-5xl mb-4 block filter drop-shadow-lg">{step.icon}</span>
                                        <h3 className="text-2xl font-bold mb-3 group-hover:text-secondary-300 transition-colors">
                                            {step.title}
                                        </h3>
                                        <p className="text-white/80 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===================== CTA ===================== */}
            <section className="py-32 bg-gradient-to-r from-primary-900 to-earth-900 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                <div className="max-w-3xl mx-auto px-4 relative z-10">
                    <h2 className="text-5xl font-bold mb-8">Reimagine Your Life Today</h2>
                    <p className="text-earth-200 mb-12 text-xl font-light">
                        The best version of you is waiting. Let us help you find it.
                    </p>
                    <Link to="/signup">
                        <Button variant="primary" size="lg" className="px-12 py-5 text-lg bg-gradient-to-r from-primary-500 to-pink-500 hover:from-primary-600 hover:to-pink-600 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 border-none">
                            Start Your Journey Now
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;
