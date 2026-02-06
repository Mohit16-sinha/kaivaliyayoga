import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

// Import background images for client dashboard
import BgImage1 from '../assets/img/cards/istockphoto-1283377954-1024x1024.jpeg';
import BgImage2 from '../assets/img/cards/nathan-dumlao-pLoMDKtl-JY-unsplash.jpg';
import BgImage3 from '../assets/img/cards/nelka-sGIp9xdj7kA-unsplash.jpg';

const DashboardLayout = ({ userType = 'client' }) => {
    const isClient = userType === 'client';

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex flex-grow pt-16">
                <Sidebar userType={userType} />

                {/* Main Content Area */}
                <main className="flex-grow md:ml-64 relative overflow-y-auto min-h-screen">
                    {/* Background Images - First Layer, Clearly Visible */}
                    {isClient && (
                        <div className="fixed top-16 right-0 bottom-0 left-0 md:left-64 overflow-hidden pointer-events-none z-0">
                            {/* Base background color */}
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-teal-50 dark:from-earth-900 dark:via-earth-900 dark:to-earth-900 transition-colors duration-500" />

                            {/* Image 1 - Top Left - Clearly Visible */}
                            <img
                                alt=""
                                className="absolute top-4 left-4 w-[350px] h-[280px] object-cover rounded-2xl shadow-xl dark:opacity-30 transition-opacity duration-500"
                            />

                            {/* Image 2 - Top Right - Clearly Visible */}
                            <img
                                src={BgImage2}
                                alt=""
                                className="absolute top-4 right-4 w-[350px] h-[280px] object-cover rounded-2xl shadow-xl"
                            />

                            {/* Image 3 - Bottom Center - Clearly Visible */}
                            <img
                                src={BgImage3}
                                alt=""
                                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[450px] h-[300px] object-cover rounded-2xl shadow-xl"
                            />
                        </div>
                    )}

                    {/* Content - On top of background images with glass effect */}
                    <div className={`relative z-10 p-4 md:p-8 ${isClient ? 'min-h-screen' : ''}`}>
                        {isClient ? (
                            <div className="bg-white/85 dark:bg-earth-900/85 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 transition-colors duration-300 border border-white/20 dark:border-white/5">
                                <Outlet />
                            </div>
                        ) : (
                            <Outlet />
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
