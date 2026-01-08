import React from 'react';
import Hero from '../components/Hero';
import TrustIndicators from '../components/TrustIndicators';
import Cards from '../components/Cards';
import Programs from '../components/Programs';
import Newsletter from '../components/Newsletter';
import Stats from '../components/Stats';
import Testimonials from '../components/Testimonials';
import TeacherSpotlight from '../components/TeacherSpotlight';

const Home = () => {
    return (
        <>
            <Hero />
            <TrustIndicators />
            <Cards />
            <Programs />
            <Stats />
            <Testimonials />
            <TeacherSpotlight />
            <Newsletter />
        </>
    );
};

export default Home;
