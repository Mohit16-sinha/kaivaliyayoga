import React from 'react';
import { Outlet, Link } from 'react-router-dom';

import Logo from '../images2/kaivaliyayoga-logo-.png';

const AuthLayout = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-earth-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
                <Link to="/" className="flex flex-col items-center font-heading font-bold text-primary-600">
                    <img src={Logo} alt="Kaivalya Wellness" className="h-16 w-auto mb-2" />
                    <span className="text-4xl">Kaivalya</span>
                </Link>
                <p className="mt-2 text-earth-700">Holistic Wellness Platform</p>
            </div>
            <div className="max-w-md w-full">
                <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10">
                    <Outlet />
                </div>
            </div>
            <div className="mt-8 text-center text-sm text-earth-600">
                <p>&copy; {new Date().getFullYear()} Kaivalya Wellness. All rights reserved.</p>
            </div>
        </div>
    );
};

export default AuthLayout;
