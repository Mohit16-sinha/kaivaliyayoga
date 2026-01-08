import React, { useState, useEffect } from 'react';
// import { FaQuoteLeft } from 'react-icons/fa'; // Assuming react-icons

const testimonials = [
    {
        name: 'Sarah Mitchell',
        role: 'Student',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=2070',
        quote: "I came to Kaivaliya Yoga to lose weight, but I found so much more. The peace I feel after every class is indescribable. It has completely transformed my mental health."
    },
    {
        name: 'David Chen',
        role: 'Business Owner',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=2070',
        quote: "The stress of running a business was taking a toll on me. The Sahaj Meditation program gave me the tools to reset. I'm more focused and calm than I've been in years."
    },
    {
        name: 'Emma Watson',
        role: 'Teacher Trainee',
        image: 'https://images.unsplash.com/photo-1554151228-14d9def656ec?auto=format&fit=crop&q=80&w=1372',
        quote: "The Teacher Training program is intense but incredibly rewarding. The depth of knowledge the instructors share is world-class. Highly recommended!"
    },
];

const Testimonials = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % testimonials.length);
        }, 5000); // Change every 5 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <section className='py-24 bg-sage-100/30'>
            <div className='container mx-auto px-4'>
                <div className='text-center mb-16'>
                    <h2 className='text-4xl font-primary font-bold text-earth-900 mb-4'>
                        Stories of <span className='text-accent'>Transformation</span>
                    </h2>
                    <div className='w-24 h-1 bg-accent mx-auto rounded-full'></div>
                </div>

                <div className='max-w-4xl mx-auto relative'>

                    {/* Carousel Content */}
                    <div className='relative overflow-hidden min-h-[300px]'>
                        {testimonials.map((item, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-all duration-700 ease-in-out flex flex-col items-center justify-center text-center
                            ${index === current ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}
                            ${index < current ? '-translate-x-full' : ''}
                        `}
                            >
                                <div className='w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg mb-6'>
                                    <img src={item.image} alt={item.name} className='w-full h-full object-cover' />
                                </div>

                                <p className='text-xl md:text-2xl font-primary text-earth-800 italic mb-8 leading-relaxed max-w-2xl'>
                                    "{item.quote}"
                                </p>

                                <div>
                                    <h4 className='font-bold text-earth-900 text-lg'>{item.name}</h4>
                                    <p className='text-accent text-sm uppercase tracking-wide'>{item.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Dots */}
                    <div className='flex justify-center gap-3 mt-8'>
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrent(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${current === index ? 'bg-accent w-8' : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                            />
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Testimonials;
