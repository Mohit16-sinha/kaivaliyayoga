import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { Link } from 'react-router-dom';

const Announcement = () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className='bg-earth-900 text-white py-2 px-4 relative z-[60]'>
            <div className='container mx-auto flex items-center justify-center text-sm md:text-base'>
                <span className='mr-2 font-medium'>🎉 Start your journey today!</span>
                <span className='font-bold text-accent mr-4'>First Class is FREE.</span>
                <button className='underline hover:text-accent font-bold'>
                    <Link to='/contact'>Claim Offer</Link>
                </button>
                <button
                    onClick={() => setIsVisible(false)}
                    className='absolute right-4 text-gray-400 hover:text-white'
                >
                    <IoMdClose size={20} />
                </button>
            </div>
        </div>
    );
};

export default Announcement;
