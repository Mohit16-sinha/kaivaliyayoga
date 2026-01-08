import React from 'react';
import { FaShieldAlt, FaAward, FaUserCheck, FaHeartbeat } from 'react-icons/fa';

const indicators = [
    {
        icon: <FaAward />,
        title: 'Yoga Alliance Certified',
        desc: 'Internationally recognized training standards'
    },
    {
        icon: <FaShieldAlt />,
        title: 'Safe & Sanitized',
        desc: 'Strict post-COVID hygiene protocols'
    },
    {
        icon: <FaUserCheck />,
        title: 'Expert Teachers',
        desc: '10+ years average teaching experience'
    },
    {
        icon: <FaHeartbeat />,
        title: 'Beginner Friendly',
        desc: 'Modifications for all bodies & ages'
    }
];

const TrustIndicators = () => {
    return (
        <section className='relative -mt-20 z-20 px-4'>
            <div className='container mx-auto'>
                <div className='bg-white py-12 px-6 rounded-3xl shadow-2xl grid grid-cols-2 md:grid-cols-4 gap-8 border border-gray-100'>
                    {indicators.map((item, index) => (
                        <div key={index} className='flex flex-col items-center text-center group'>
                            <div className='text-4xl text-earth-300 group-hover:text-accent transition-colors mb-4 transform group-hover:scale-110 duration-300'>
                                {item.icon}
                            </div>
                            <h4 className='text-earth-900 font-bold mb-1'>{item.title}</h4>
                            <p className='text-gray-500 text-sm max-w-[150px]'>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustIndicators;
