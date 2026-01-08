import React from 'react';
import { Link } from 'react-router-dom';

const TeacherSpotlight = () => {
    return (
        <section className='py-20 bg-white'>
            <div className='container mx-auto px-4'>
                <div className='flex flex-col lg:flex-row items-center gap-12 lg:gap-20'>

                    {/* Image Side */}
                    <div className='lg:w-1/2 relative'>
                        <div className='absolute inset-0 bg-accent/10 rounded-3xl transform rotate-3 scale-105 z-0'></div>
                        {/* Using a high quality portrait for the teacher */}
                        <img
                            src='https://images.unsplash.com/photo-1544367563-12123d8966bf?auto=format&fit=crop&q=80&w=2070'
                            alt='Lead Instructor'
                            className='relative z-10 rounded-3xl shadow-2xl w-full object-cover h-[500px]'
                        />

                        {/* Overlay Badge */}
                        <div className='absolute bottom-8 left-8 z-20 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg border-l-4 border-accent'>
                            <p className='text-earth-900 font-bold text-lg'>Anand Raj</p>
                            <p className='text-accent font-medium text-sm'>Senior Yoga Master</p>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className='lg:w-1/2'>
                        <h4 className='text-accent font-bold uppercase tracking-widest mb-2'>Featured Instructor</h4>
                        <h2 className='text-4xl lg:text-5xl font-primary font-bold text-earth-900 mb-6'>
                            Guiding Your Journey <br /> with Compassion
                        </h2>
                        <p className='text-gray-600 text-lg leading-relaxed mb-6'>
                            "Yoga is not just about flexibility of the body, but flexibility of the mind. My goal is to help you find that inner stillness regardless of the chaos around you."
                        </p>
                        <p className='text-gray-600 text-lg leading-relaxed mb-8'>
                            With over 10 years of experience in Hatha and Vinyasa traditions, Anand brings a unique blend of traditional wisdom and modern physiological understanding to every class.
                        </p>

                        <Link to='/about'>
                            <button className='bg-earth-900 text-white font-bold py-4 px-10 rounded-full shadow-xl hover:bg-accent transition-all duration-300 transform hover:-translate-y-1'>
                                Meet All Our Teachers
                            </button>
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default TeacherSpotlight;
