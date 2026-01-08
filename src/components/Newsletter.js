import React from 'react';

const Newsletter = () => {
    return (
        <section className='bg-sage-300 py-24'>
            <div className='container mx-auto px-4'>
                <div className='flex flex-col lg:flex-row items-center justify-between gap-12'>

                    {/* Text Content */}
                    <div className='lg:w-1/2 text-center lg:text-left'>
                        <h2 className='text-3xl lg:text-4xl font-primary font-bold text-earth-900 mb-4'>
                            Subscribe to our <span className='text-white'>Wisdom Letter</span>
                        </h2>
                        <p className='text-earth-900 text-lg leading-relaxed max-w-lg mx-auto lg:mx-0'>
                            Join our community and receive weekly yoga tips, meditation guides, and exclusive retreat invites directly to your inbox.
                        </p>
                    </div>

                    {/* Form */}
                    <div className='lg:w-1/2 w-full max-w-xl'>
                        <form className='flex flex-col sm:flex-row gap-4'>
                            <input
                                type='email'
                                placeholder='Your email address'
                                className='w-full px-6 py-4 rounded-full border-none focus:ring-2 focus:ring-accent outline-none text-earth-900 placeholder:text-gray-400 shadow-lg'
                                required
                            />
                            <button
                                className='bg-accent hover:bg-accent-hover text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all transform hover:-translate-y-1 whitespace-nowrap'
                            >
                                Subscribe Now
                            </button>
                        </form>
                        <p className='text-earth-800 text-sm mt-4 text-center lg:text-left ml-4'>
                            We respect your privacy. No spam, ever.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Newsletter;
