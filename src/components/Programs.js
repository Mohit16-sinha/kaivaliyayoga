import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io'; // Ensure react-icons is installed

// Import local images
import course1 from '../assets/img/coursepics/course-1.png';
import course2 from '../assets/img/coursepics/course-2.png';
import course3 from '../assets/img/coursepics/course-3.png';
import teacherTrainingImg from '../assets/img/coursepics/teacher-training.jpg';

const programsData = [
    {
        title: 'Yoga Foundation',
        shortDescription: 'Build a strong foundation with Hatha Yoga basics. Perfect for beginners looking to start their journey.',
        longDescription: 'Our Yoga Foundation course is designed for absolute beginners and those looking to refresh their basics. Over 4 weeks, you will explore the 8 limbs of yoga, master fundamental Asanas (postures) with proper alignment, and learn calming Pranayama (breathing) techniques. This course builds strength, flexibility, and a deep understanding of yoga philosophy, setting the stage for a lifelong practice.',
        details: ['4-Week Duration', 'Beginner Friendly', 'Certificate of Completion'],
        image: course1,
        color: 'from-orange-200 to-orange-100',
        accent: 'text-orange-600',
        buttonColor: 'bg-orange-600 hover:bg-orange-700'
    },
    {
        title: 'Sahaj Meditation',
        shortDescription: 'Learn the art of effortless meditation. Reduce stress and find deep inner peace in minutes.',
        longDescription: 'Sahaj Samadhi is a natural, effortless system of meditation based on the use of a personal mantra. "Sahaj" means natural, and "Samadhi" means the state of deep rest. Unlike other methods that require concentration, this technique allows the conscious mind to settle deeply into the self, giving rest twice as deep as sleep. Regular practice reduces stress, increases energy, and brings clarity to the mind.',
        details: ['3-Day Workshop', 'Personal Mantra', 'Lifetime Support'],
        image: course2,
        color: 'from-teal-200 to-teal-100',
        accent: 'text-teal-600',
        buttonColor: 'bg-teal-600 hover:bg-teal-700'
    },
    {
        title: 'Teacher Training',
        shortDescription: 'Deepen your practice and become a certified instructor. Share the gift of yoga with the world.',
        longDescription: 'Transform your life and career with our comprehensive 200-Hour Yoga Teacher Training (RYT-200). This immersive program covers advanced anatomy, teaching methodology, sequencing, and the business of yoga. You will not only refine your personal practice but also find your unique voice as a teacher. Upon graduation, you will be a Yoga Alliance certified instructor, ready to lead inspiring classes worldwide.',
        details: ['200 Hours (RYT)', 'Global Certification', 'Intensive Training'],
        image: course3,
        color: 'from-purple-200 to-purple-100',
        accent: 'text-purple-600',
        buttonColor: 'bg-purple-600 hover:bg-purple-700'
    },
];

const Programs = () => {
    const [selectedProgram, setSelectedProgram] = useState(null);

    return (
        <section className='py-24 bg-gradient-to-b from-white to-earth-100 relative'>
            <div className='container mx-auto px-4'>

                {/* Section Header */}
                <div className='text-center mb-16 max-w-2xl mx-auto'>
                    <h2 className='text-4xl lg:text-5xl font-primary font-bold text-earth-900 mb-6 drop-shadow-sm'>
                        Our <span className='text-accent bg-clip-text text-transparent bg-gradient-to-r from-accent to-orange-500'>Programs</span>
                    </h2>
                    <p className='text-gray-600 text-lg'>
                        Discover our carefully curated programs designed to bring balance to your body, mind, and soul.
                    </p>
                </div>

                {/* Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
                    {programsData.map((program, index) => (
                        <div
                            key={index}
                            className={`group relative bg-gradient-to-br ${program.color} rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 cursor-pointer border-2 border-white/50 flex flex-col`}
                        >
                            {/* Image */}
                            <div className='h-72 overflow-hidden relative'>
                                <div className='absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all z-10' />
                                <img
                                    src={program.image}
                                    alt={program.title}
                                    className='w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700'
                                />
                                <div className='absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm z-20'>
                                    Popular
                                </div>
                            </div>

                            {/* Content */}
                            <div className='p-8 relative flex-grow flex flex-col justify-between'>
                                {/* Decorative background circle */}
                                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:bg-white/30 transition-all"></div>

                                <div>
                                    <h3 className={`text-2xl font-bold ${program.accent} mb-3 font-primary`}>
                                        {program.title}
                                    </h3>
                                    <p className='text-gray-700 mb-6 leading-relaxed relative z-10'>
                                        {program.shortDescription}
                                    </p>
                                </div>

                                {/* Button */}
                                <div className="flex items-center justify-between mt-auto">
                                    <button
                                        onClick={() => setSelectedProgram(program)}
                                        className={`bg-white ${program.accent} font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 group-hover:gap-3 z-20`}
                                    >
                                        Learn More
                                        <span>&rarr;</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal / Popup */}
            {selectedProgram && (
                <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300'>
                    <div className='bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden relative animate-fadeInUp'>
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedProgram(null)}
                            className='absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10 bg-white/80 rounded-full p-2 transition-colors'
                        >
                            <IoMdClose size={24} />
                        </button>

                        <div className='flex flex-col md:flex-row h-full max-h-[90vh] overflow-y-auto md:overflow-visible'>
                            {/* Modal Image */}
                            <div className='md:w-2/5 h-64 md:h-auto relative'>
                                <img
                                    src={selectedProgram.image}
                                    alt={selectedProgram.title}
                                    className='w-full h-full object-cover'
                                />
                                <div className={`absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r ${selectedProgram.color} opacity-30 mix-blend-multiply`}></div>
                            </div>

                            {/* Modal Content */}
                            <div className='md:w-3/5 p-8 md:p-10 flex flex-col justify-center'>
                                <h3 className={`text-3xl md:text-4xl font-bold font-primary mb-4 ${selectedProgram.accent}`}>
                                    {selectedProgram.title}
                                </h3>

                                {/* Tags */}
                                <div className='flex flex-wrap gap-2 mb-6'>
                                    {selectedProgram.details.map((detail, idx) => (
                                        <span key={idx} className='bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide'>
                                            {detail}
                                        </span>
                                    ))}
                                </div>

                                <p className='text-gray-600 leading-relaxed text-lg mb-8'>
                                    {selectedProgram.longDescription}
                                </p>

                                <div className='flex gap-4'>
                                    <button className={`${selectedProgram.buttonColor} text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1`}>
                                        Enroll Now
                                    </button>
                                    <button
                                        onClick={() => setSelectedProgram(null)}
                                        className='text-gray-500 hover:text-gray-900 font-semibold py-3 px-6'
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Programs;
