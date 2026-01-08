import React from 'react';

const stats = [
    { value: '500+', label: 'Happy Students' },
    { value: '10+', label: 'Years Experience' },
    { value: '15+', label: 'Classes Weekly' },
    { value: '3', label: 'Certified Teachers' },
];

const Stats = () => {
    return (
        <section className='bg-earth-200 py-12'>
            <div className='container mx-auto px-4'>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-earth-300/50'>
                    {stats.map((stat, index) => (
                        <div key={index} className='p-4'>
                            <div className='text-3xl lg:text-4xl font-bold text-accent mb-2 font-primary'>
                                {stat.value}
                            </div>
                            <div className='text-earth-900 font-medium tracking-wide uppercase text-sm lg:text-base'>
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;
