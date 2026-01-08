import React from 'react';
// import { FaHeart, FaUsers, FaLeaf, FaOm } from 'react-icons/fa'; // Assuming react-icons

const values = [
    {
        title: 'Authenticity',
        description: 'We honor the traditional roots of yoga, teaching techniques passed down through generations without dilution.',
        icon: '🌿'
    },
    {
        title: 'Inclusivity',
        description: 'Yoga is for every body. We create a safe, welcoming space where everyone belongs, regardless of age or ability.',
        icon: '🤝'
    },
    {
        title: 'Community',
        description: 'We grow together. Our studio is a sanctuary where students support one another on their path to wellness.',
        icon: '❤️'
    },
    {
        title: 'Transformation',
        description: 'We believe in the power of yoga to heal and transform from the inside out, bringing balance to life.',
        icon: '✨'
    }
];

const teachers = [
    {
        name: 'Anand Raj',
        title: 'Founder & Senior Master',
        image: 'https://images.unsplash.com/photo-1544367563-12123d8966bf?auto=format&fit=crop&q=80&w=2070', // Using the teacher spotlight image
        bio: 'With over 15 years of practice, Anand specializes in Hatha Yoga and extensive meditation techniques. His journey began in the Himalayas where he discovered the transformative power of silence.',
        specialties: ['Hatha Yoga', 'Pranayama', 'Meditation']
    },
    {
        name: 'Sarah Jenkins',
        title: 'Vinyasa Flow Lead',
        image: 'https://images.unsplash.com/photo-1599447421405-0e32096b3033?auto=format&fit=crop&q=80&w=1974', // Using one of the program images or new one
        bio: 'Sarah brings a dynamic energy to her classes. Certified in Vinyasa and Yin Yoga, she focuses on finding the balance between strength and flexibility.',
        specialties: ['Vinyasa Flow', 'Yin Yoga', 'Anatomy']
    },
    {
        name: 'Priya Sharma',
        title: 'Meditation & Wellness',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=2031', // Sahaj image
        bio: 'Priya guides students through deep relaxation and stress relief. Her gentle approach helps students connect with their inner peace and emotional well-being.',
        specialties: ['Guided Meditation', 'Restorative Yoga', 'Ayurveda']
    }
];

const About = () => {
    return (
        <div className='pt-24 pb-12'>
            {/* HER0 - Our Story */}
            <section className='container mx-auto px-4 mb-20'>
                <div className='text-center max-w-3xl mx-auto mb-16'>
                    <h1 className='text-5xl lg:text-6xl font-primary font-bold text-earth-900 mb-8'>Our Story</h1>
                    <p className='text-xl text-gray-700 leading-relaxed text-left'>
                        It started in 2015 when I discovered yoga during a challenging time in my life. Overwhelmed by the fast pace of the corporate world, I sought a sanctuary—a place to breathe. What began as a physical practice quickly became a journey inward.
                        <br /><br />
                        Realizing that peace wasn't found in a destination but in a state of mind, I traveled to Rishikesh to deepen my understanding of the ancient texts and techniques. Kaivaliya Yoga was born from a desire to share these authentic, life-changing tools with our community. We are not just a studio; we are a home for seekers, healers, and anyone looking to find their center.
                    </p>
                    <div className='mt-8 flex justify-center'>
                        {/* Spacer or signature if needed */}
                        <div className='w-24 h-1 bg-accent rounded-full'></div>
                    </div>
                </div>
            </section>

            {/* MISSION & VALUES */}
            <section className='bg-earth-100/50 py-20 mb-20'>
                <div className='container mx-auto px-4'>
                    <div className='text-center mb-16'>
                        <h2 className='text-4xl font-primary font-bold text-earth-900 mb-4'>Our Mission & Values</h2>
                        <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
                            To empower every individual to discover their limitless potential through the ancient wisdom of yoga, fostering a community of kindness and growth.
                        </p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
                        {values.map((val, idx) => (
                            <div key={idx} className='bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center group'>
                                <div className='text-4xl mb-6 group-hover:scale-110 transition-transform inline-block'>{val.icon}</div>
                                <h3 className='text-xl font-bold text-earth-900 mb-3'>{val.title}</h3>
                                <p className='text-gray-600 text-sm leading-relaxed'>{val.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* MEET OUR TEACHERS */}
            <section className='container mx-auto px-4 mb-20'>
                <div className='text-center mb-16'>
                    <h4 className='text-accent font-bold uppercase tracking-widest mb-2'>The Team</h4>
                    <h2 className='text-4xl font-primary font-bold text-earth-900'>Meet Our Teachers</h2>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
                    {teachers.map((teacher, idx) => (
                        <div key={idx} className='group'>
                            {/* Image Card */}
                            <div className='relative overflow-hidden rounded-2xl h-96 mb-6 shadow-md'>
                                <div className='absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all z-10' />
                                <img src={teacher.image} alt={teacher.name} className='w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700' />
                            </div>

                            {/* Info */}
                            <div className='text-center'>
                                <h3 className='text-2xl font-bold text-earth-900 mb-1'>{teacher.name}</h3>
                                <p className='text-accent font-medium uppercase text-sm tracking-wide mb-4'>{teacher.title}</p>
                                <p className='text-gray-600 mb-6 leading-relaxed'>
                                    {teacher.bio}
                                </p>
                                {/* Specialties Tags */}
                                <div className='flex flex-wrap justify-center gap-2'>
                                    {teacher.specialties.map((tag, i) => (
                                        <span key={i} className='bg-earth-200 text-earth-900 px-3 py-1 rounded-full text-xs font-semibold'>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default About;
