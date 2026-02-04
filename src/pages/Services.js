import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoMdCheckmark } from 'react-icons/io';
import { useCurrency } from '../context/CurrencyContext';
import PriceDisplay from '../components/PriceDisplay';
import Pricing from '../components/Pricing';
import { BASE_PRICES_AUD } from '../config/currencies';

// Images
import course1 from '../assets/img/coursepics/course-1.png';
import teacherTrainingImg from '../assets/img/coursepics/teacher-training.jpg';
const sahajImg = 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=2031';

const Services = () => {
    const [filter, setFilter] = useState('All');
    const [backendPrograms, setBackendPrograms] = useState([]);

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/programs');
            if (res.ok) {
                const data = await res.json();
                setBackendPrograms(data);
            }
        } catch (err) {
            console.error("Failed to load programs");
        }
    };

    const handleEnroll = async (programName, priceStr) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Please sign in to enroll.");
            window.location.href = '/signin';
            return;
        }

        // Find the backend program ID
        const backendProg = backendPrograms.find(p => p.name === programName);
        if (!backendProg) {
            console.error("Available programs:", backendPrograms.map(p => p.name));
            alert(`Backend data missing for "${programName}". Please refresh or contact admin.`);
            return;
        }

        const amount = backendProg.price;

        try {
            // 1. Create Order
            const orderResponse = await fetch('http://localhost:8080/api/payments/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ amount: amount, currency: "INR" })
            });

            if (!orderResponse.ok) throw new Error('Failed to create order');
            const orderData = await orderResponse.json();

            // 2. Open Razorpay
            const options = {
                key: orderData.key_id,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Kaivaliya Yoga",
                description: `Enrollment: ${programName}`,
                order_id: orderData.order_id,
                handler: async function (response) {
                    try {
                        // 3. Verify Payment
                        const verifyResponse = await fetch('http://localhost:8080/api/payments/verify', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                order_id: orderData.order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });

                        if (!verifyResponse.ok) throw new Error('Payment verification failed');
                        const verifyData = await verifyResponse.json();

                        // 4. Enroll
                        const enrollResponse = await fetch('http://localhost:8080/api/programs/enroll', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                program_id: backendProg.ID,
                                payment_id: verifyData.payment_id
                            })
                        });

                        if (enrollResponse.ok) {
                            alert("Enrollment Successful! Welcome aboard.");
                            window.location.href = '/dashboard';
                        } else {
                            const errData = await enrollResponse.json();
                            throw new Error(errData.error || 'Enrollment failed');
                        }

                    } catch (err) {
                        alert(`Error: ${err.message}`);
                    }
                },
                theme: { color: "#3399cc" }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    // --- DATA ---
    const programs = [
        {
            title: 'Yoga Foundation Course',
            duration: '8 Weeks',
            level: 'Beginner Friendly',
            description: 'A comprehensive introduction to Hatha Yoga. Master the basics, improve flexibility, and build a sustainable practice.',
            features: ['2 Classes per week', 'Personal Assessment', 'Course Material', 'Certificate'],
            audPrice: BASE_PRICES_AUD.foundation,
            image: course1,
            reverse: false
        },
        {
            title: 'Sahaj Meditation Program',
            duration: '3 Days',
            level: 'All Levels',
            description: 'Discover the power of your breath and mind. This workshop teaches you an effortless meditation technique for life.',
            features: ['Personal Mantra', 'Stress Management Tools', 'Lifetime Access to Weekly Follow-ups'],
            audPrice: BASE_PRICES_AUD.meditation,
            image: sahajImg,
            reverse: true
        },
        {
            title: '200Hr Teacher Training',
            duration: '4 Weeks (Intensive)',
            level: 'Intermediate',
            description: 'Take your practice to a professional level. Learn anatomy, philosophy, and the art of teaching yoga.',
            features: ['Yoga Alliance Certification', 'Teaching Methodology', 'In-depth Anatomy', 'Career Guidance'],
            audPrice: BASE_PRICES_AUD.teacher_training,
            image: teacherTrainingImg,
            reverse: false
        }
    ];

    const weeklySchedule = [
        { day: 'Monday', time: '06:00 AM', class: 'Hatha Yoga', level: 'Beginner', teacher: 'Anand' },
        { day: 'Monday', time: '06:00 PM', class: 'Vinyasa Flow', level: 'Intermediate', teacher: 'Sarah' },
        { day: 'Tuesday', time: '06:00 AM', class: 'Pranayama & Meditation', level: 'All Levels', teacher: 'Priya' },
        { day: 'Tuesday', time: '07:30 PM', class: 'Power Yoga', level: 'Advanced', teacher: 'Anand' },
        { day: 'Wednesday', time: '06:00 AM', class: 'Hatha Yoga', level: 'Beginner', teacher: 'Anand' },
        { day: 'Thursday', time: '06:00 PM', class: 'Yin Yoga', level: 'All Levels', teacher: 'Sarah' },
        { day: 'Friday', time: '06:30 AM', class: 'Surya Namaskar', level: 'All Levels', teacher: 'Anand' },
        { day: 'Saturday', time: '08:00 AM', class: 'Full Practice', level: 'Intermediate', teacher: 'Sarah' },
    ];

    const pricing = [
        {
            title: 'Drop-In',
            price: '₹500',
            period: '/ class',
            features: ['Access to any one class', 'Mat provided', 'Valid for 7 days'],
            highlight: false
        },
        {
            title: 'Monthly Unlimited',
            price: '₹3,500',
            period: '/ month',
            features: ['Unlimited classes', 'Access to all styles', '10% off on Workshops', 'Free Guest Pass (1)'],
            highlight: true
        },
        {
            title: 'Quarterly',
            price: '₹9,000',
            period: '/ 3 months',
            features: ['Best Value', 'Unlimited classes', 'Free Weekend Workshop', 'Priority Event Booking'],
            highlight: false
        }
    ];

    const faqs = [
        { q: 'Do I need to be flexible to join?', a: 'Not at all! Yoga is for everyone. Flexibility is a result of yoga, not a prerequisite.' },
        { q: 'What should I bring?', a: 'Wear comfortable clothing. We provide high-quality mats, but you are welcome to bring your own.' },
        { q: 'Can I join mid-month?', a: 'Yes! Our packages start from the day you sign up.' },
        { q: 'Are classes taught in English?', a: 'Yes, all our classes are conducted in English. Our teachers are also fluent in Hindi.' },
    ];

    // Filter Logic
    const uniqueLevels = ['All', 'Beginner', 'Intermediate', 'Advanced', 'All Levels'];
    const filteredSchedule = filter === 'All' ? weeklySchedule : weeklySchedule.filter(item => item.level === filter || item.level === 'All Levels');


    const handlePlanPurchase = async (planTitle, priceStr) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Please sign in to purchase a plan");
            window.location.href = '/signin';
            return;
        }

        // Map title to backend types
        let type = 'drop_in';
        if (planTitle.includes('Monthly')) type = 'monthly';
        if (planTitle.includes('Quarterly')) type = 'quarterly';

        // Parse price (₹3,500 -> 3500)
        const amount = parseInt(priceStr.replace(/[^\d]/g, ''), 10);

        try {
            // 1. Create Order
            const orderResponse = await fetch('http://localhost:8080/api/payments/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ amount: amount, currency: "INR" })
            });

            if (!orderResponse.ok) throw new Error('Failed to create order');
            const orderData = await orderResponse.json();

            // 2. Open Razorpay
            const options = {
                key: orderData.key_id,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Kaivaliya Yoga",
                description: `Membership: ${planTitle}`,
                order_id: orderData.order_id,
                handler: async function (response) {
                    try {
                        // 3. Verify Payment
                        const verifyResponse = await fetch('http://localhost:8080/api/payments/verify', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                order_id: orderData.order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });

                        if (!verifyResponse.ok) throw new Error('Payment verification failed');
                        const verifyData = await verifyResponse.json();

                        // 4. Create Membership
                        const memResponse = await fetch('http://localhost:8080/api/memberships/purchase', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                package_type: type,
                                payment_id: verifyData.payment_id
                            })
                        });

                        if (memResponse.ok) {
                            alert("Membership Purchased Successfully!");
                            window.location.href = '/dashboard';
                        } else {
                            throw new Error('Failed to activate membership');
                        }

                    } catch (err) {
                        alert(`Error: ${err.message}`);
                    }
                },
                theme: { color: "#3399cc" }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    return (
        <div className='pt-24 pb-12'>

            {/* HERO */}
            <section className='container mx-auto px-4 mb-20 text-center'>
                <h1 className='text-5xl lg:text-7xl font-primary font-bold text-earth-900 mb-6'>Find Your Practice</h1>
                <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
                    From beginners to advanced practitioners, we have a path for you. Explore our offerings and start your journey today.
                </p>
            </section>

            {/* DETAILED PROGRAMS */}
            <section className='container mx-auto px-4 mb-24 space-y-20'>
                {programs.map((prog, idx) => (
                    <div key={idx} className={`flex flex-col lg:flex-row items-center gap-12 ${prog.reverse ? 'lg:flex-row-reverse' : ''}`}>
                        {/* Image */}
                        <div className='lg:w-1/2 w-full h-[400px] rounded-3xl overflow-hidden shadow-xl'>
                            <img src={prog.image} alt={prog.title} className='w-full h-full object-cover hover:scale-105 transition-transform duration-700' />
                        </div>
                        {/* Content */}
                        <div className='lg:w-1/2'>
                            <div className='flex gap-4 mb-4 text-sm font-bold uppercase tracking-wider'>
                                <span className='bg-earth-200 px-3 py-1 rounded-full text-earth-900'>{prog.duration}</span>
                                <span className='bg-accent/20 px-3 py-1 rounded-full text-accent'>{prog.level}</span>
                            </div>
                            <h2 className='text-4xl font-primary font-bold text-earth-900 mb-4'>{prog.title}</h2>
                            <p className='text-gray-600 text-lg mb-6 leading-relaxed'>{prog.description}</p>

                            <div className='mb-8'>
                                <h4 className='font-bold text-earth-900 mb-3'>What's Included:</h4>
                                <ul className='space-y-2'>
                                    {prog.features.map((feat, i) => (
                                        <li key={i} className='flex items-center gap-3 text-gray-700'>
                                            <IoMdCheckmark className='text-accent' /> {feat}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Capacity & Enroll */}
                            {(() => {
                                const backendData = backendPrograms.find(p => p.name === prog.title);

                                // Loading State
                                if (!backendData) {
                                    return (
                                        <div className='flex flex-col gap-4'>
                                            <div className="text-sm font-semibold text-gray-400 animate-pulse">Checking availability...</div>
                                            <div className='flex items-center gap-6'>
                                                <div className='text-3xl font-bold text-accent'>
                                                    <PriceDisplay amountAUD={prog.audPrice} />
                                                </div>
                                                <button disabled className='bg-gray-200 text-gray-400 px-8 py-3 rounded-full font-bold cursor-wait'>
                                                    Please Wait...
                                                </button>
                                            </div>
                                        </div>
                                    );
                                }

                                const isFull = backendData.is_full;
                                const spotsLeft = backendData.max_students - backendData.current_students;

                                return (
                                    <div className='flex flex-col gap-4'>
                                        <div className="text-sm font-semibold text-gray-500">
                                            {isFull ? (
                                                <span className="text-red-600">Batch Full (Max {backendData.max_students})</span>
                                            ) : (
                                                <span className="text-green-600">{spotsLeft} spots left (of {backendData.max_students})</span>
                                            )}
                                        </div>

                                        <div className='flex items-center gap-6'>
                                            <div className='text-3xl font-bold text-accent'>
                                                <PriceDisplay amountAUD={prog.audPrice} />
                                            </div>
                                            <button
                                                onClick={() => alert("Registration for this program is temporarily paused while we upgrade our systems. Please contact us.")}
                                                disabled={isFull}
                                                className={`px-8 py-3 rounded-full font-bold transition-colors ${isFull
                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    : 'bg-earth-900 text-white hover:bg-accent'
                                                    }`}
                                            >
                                                {isFull ? 'Sold Out' : 'Enroll Now'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                ))}
            </section>

            {/* SCHEDULE */}
            <section className='bg-earth-100/50 py-20 mb-20'>
                <div className='container mx-auto px-4'>
                    <div className='text-center mb-12'>
                        <h2 className='text-4xl font-primary font-bold text-earth-900 mb-4'>Weekly Class Schedule</h2>
                        <div className='flex flex-wrap justify-center gap-4 mt-8'>
                            {uniqueLevels.map((lvl) => (
                                <button
                                    key={lvl}
                                    onClick={() => setFilter(lvl)}
                                    className={`px-6 py-2 rounded-full font-medium transition-all ${filter === lvl ? 'bg-accent text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-earth-200'
                                        }`}
                                >
                                    {lvl}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className='bg-white rounded-3xl shadow-xl overflow-hidden max-w-5xl mx-auto'>
                        <div className='overflow-x-auto'>
                            <table className='w-full text-left border-collapse'>
                                <thead className='bg-earth-900 text-white'>
                                    <tr>
                                        <th className='p-6 font-primary text-xl'>Day</th>
                                        <th className='p-6 font-primary text-xl'>Time</th>
                                        <th className='p-6 font-primary text-xl'>Class</th>
                                        <th className='p-6 font-primary text-xl'>Level</th>
                                        <th className='p-6 font-primary text-xl'>Teacher</th>
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-gray-100'>
                                    {filteredSchedule.map((row, idx) => (
                                        <tr key={idx} className='hover:bg-earth-50 transition-colors'>
                                            <td className='p-6 font-bold text-earth-900'>{row.day}</td>
                                            <td className='p-6 text-gray-600'>{row.time}</td>
                                            <td className='p-6 font-bold text-accent'>{row.class}</td>
                                            <td className='p-6'>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${row.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                                                    row.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                                        row.level === 'Advanced' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {row.level}
                                                </span>
                                            </td>
                                            <td className='p-6 text-gray-600'>{row.teacher}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredSchedule.length === 0 && (
                                <div className='p-8 text-center text-gray-500'>No classes found for this filter.</div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* PRICING */}
            <Pricing />

            {/* FAQ */}
            <section className='container mx-auto px-4 mb-12 max-w-3xl'>
                <h2 className='text-3xl font-primary font-bold text-center mb-10'>Frequently Asked Questions</h2>
                <div className='space-y-4'>
                    {faqs.map((faq, idx) => (
                        <div key={idx} className='bg-white rounded-2xl shadow-sm border border-earth-100 p-6'>
                            <h4 className='font-bold text-earth-900 mb-2 text-lg'>{faq.q}</h4>
                            <p className='text-gray-600 leading-relaxed'>{faq.a}</p>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
};

export default Services;
