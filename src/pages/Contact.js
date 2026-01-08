import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaInstagram, FaFacebook, FaYoutube, FaWhatsapp } from 'react-icons/fa'; // Ensure react-icons

const Contact = () => {
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: ''
    });
    const [submitStatus, setSubmitStatus] = React.useState(null); // null, 'success', 'error'
    const [errorMessage, setErrorMessage] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);
        setErrorMessage('');

        try {
            const response = await fetch('http://localhost:8080/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            setSubmitStatus('success');
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: 'General Inquiry',
                message: ''
            });
        } catch (error) {
            setSubmitStatus('error');
            setErrorMessage(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='pt-24 pb-12'>

            {/* HERO */}
            <section className='container mx-auto px-4 mb-16 text-center'>
                <h1 className='text-5xl lg:text-7xl font-primary font-bold text-earth-900 mb-6'>Let's Connect</h1>
                <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
                    We'd love to hear from you. Whether you have a question about classes, teacher training, or just want to say hello.
                </p>
            </section>

            {/* QUICK CONTACT CARDS */}
            <section className='container mx-auto px-4 mb-20'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                    {/* Visit Us */}
                    {/* Visit Us */}
                    <div className='bg-white p-8 rounded-2xl shadow-lg border-b-4 border-earth-900 text-center hover:-translate-y-2 transition-transform duration-300'>
                        <div className='w-16 h-16 bg-earth-100 rounded-full flex items-center justify-center mx-auto mb-6 text-earth-900 text-2xl'>
                            <FaMapMarkerAlt />
                        </div>
                        <h3 className='text-xl font-bold mb-4 font-primary'>Visit Us</h3>
                        <p className='text-gray-600 mb-6'>
                            123 Yoga Street, <br />
                            Wellness District, <br />
                            New Delhi - 110001
                        </p>
                        <a
                            href="https://goo.gl/maps/123YogaStreet"
                            target="_blank"
                            rel="noopener noreferrer"
                            className='inline-block w-full'
                        >
                            <button className='text-accent font-bold uppercase text-sm tracking-wider hover:text-earth-900 transition-colors w-full'>Get Directions &rarr;</button>
                        </a>
                    </div>

                    {/* Call Us */}
                    {/* Call Us */}
                    <div className='bg-white p-8 rounded-2xl shadow-lg border-b-4 border-accent text-center hover:-translate-y-2 transition-transform duration-300'>
                        <div className='w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 text-accent text-2xl'>
                            <FaPhoneAlt />
                        </div>
                        <h3 className='text-xl font-bold mb-4 font-primary'>Call Us</h3>
                        <p className='text-gray-600 mb-6'>
                            Mon - Sat: 9AM - 8PM <br />
                            <span className='font-bold text-lg block mt-2'>+91 98765 43210</span>
                        </p>
                        <a href="tel:+919876543210" className='inline-block w-full'>
                            <button className='text-accent font-bold uppercase text-sm tracking-wider hover:text-earth-900 transition-colors w-full'>Call Now &rarr;</button>
                        </a>
                    </div>

                    {/* Email Us */}
                    {/* Email Us */}
                    <div className='bg-white p-8 rounded-2xl shadow-lg border-b-4 border-earth-900 text-center hover:-translate-y-2 transition-transform duration-300'>
                        <div className='w-16 h-16 bg-earth-100 rounded-full flex items-center justify-center mx-auto mb-6 text-earth-900 text-2xl'>
                            <FaEnvelope />
                        </div>
                        <h3 className='text-xl font-bold mb-4 font-primary'>Email Us</h3>
                        <p className='text-gray-600 mb-6'>
                            General: hello@kaivaliya.com <br />
                            Support: help@kaivaliya.com
                        </p>
                        <a href="mailto:hello@kaivaliya.com" className='inline-block w-full'>
                            <button className='text-accent font-bold uppercase text-sm tracking-wider hover:text-earth-900 transition-colors w-full'>Send Email &rarr;</button>
                        </a>
                    </div>
                </div>
            </section>

            {/* FORM & MAP SECTION */}
            <section className='container mx-auto px-4 mb-20'>
                <div className='flex flex-col lg:flex-row gap-12'>

                    {/* Contact Form */}
                    <div className='lg:w-1/2 bg-white p-8 md:p-12 rounded-3xl shadow-xl'>
                        <h2 className='text-3xl font-primary font-bold text-earth-900 mb-8'>Send a Message</h2>
                        {submitStatus === 'success' && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 text-center">
                                Message sent successfully! We will get back to you soon.
                            </div>
                        )}
                        {submitStatus === 'error' && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center">
                                {errorMessage || 'Failed to send message. Please try again.'}
                            </div>
                        )}

                        <form className='space-y-6' onSubmit={handleSubmit}>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div>
                                    <label className='block text-gray-700 font-bold mb-2 text-sm uppercase tracking-wide'>Name</label>
                                    <input
                                        type='text'
                                        name='name'
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className='w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-accent focus:bg-white focus:outline-none transition-colors'
                                        placeholder='John Doe'
                                    />
                                </div>
                                <div>
                                    <label className='block text-gray-700 font-bold mb-2 text-sm uppercase tracking-wide'>Email</label>
                                    <input
                                        type='email'
                                        name='email'
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className='w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-accent focus:bg-white focus:outline-none transition-colors'
                                        placeholder='john@example.com'
                                    />
                                </div>
                            </div>
                            <div>
                                <label className='block text-gray-700 font-bold mb-2 text-sm uppercase tracking-wide'>Phone</label>
                                <input
                                    type='tel'
                                    name='phone'
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className='w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-accent focus:bg-white focus:outline-none transition-colors'
                                    placeholder='+91 98765 43210'
                                />
                            </div>
                            <div>
                                <label className='block text-gray-700 font-bold mb-2 text-sm uppercase tracking-wide'>Subject</label>
                                <select
                                    name='subject'
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className='w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-accent focus:bg-white focus:outline-none transition-colors'
                                >
                                    <option>General Inquiry</option>
                                    <option>Class Registration</option>
                                    <option>Teacher Training</option>
                                    <option>Private Session</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label className='block text-gray-700 font-bold mb-2 text-sm uppercase tracking-wide'>Message</label>
                                <textarea
                                    name='message'
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    className='w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-accent focus:bg-white focus:outline-none transition-colors h-32'
                                    placeholder='How can we help you?'
                                ></textarea>
                            </div>
                            <button
                                type='submit'
                                disabled={isSubmitting}
                                className={`w-full bg-accent text-white font-bold py-4 rounded-xl shadow-lg hover:bg-accent-hover hover:shadow-xl transition-all transform hover:-translate-y-1 ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                            <p className='text-center text-gray-500 text-sm mt-4'>We typically respond within 4 hours.</p>
                        </form>
                    </div>

                    {/* Map & Info */}
                    <div className='lg:w-1/2 flex flex-col gap-8'>
                        {/* Map Embed */}
                        <div className='h-80 lg:h-96 rounded-3xl overflow-hidden shadow-xl'>
                            <iframe
                                title="map"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.9498260278783!2d77.20902131508126!3d28.612912982425514!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x52c2b7494e204dce!2sNew%20Delhi%2C%20Delhi%2C%20India!5e0!3m2!1sen!2sus!4v1625641234567!5m2!1sen!2sus"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                            ></iframe>
                        </div>

                        {/* Hours Box */}
                        <div className='bg-earth-900 text-white p-8 rounded-3xl shadow-xl'>
                            <h3 className='text-2xl font-primary font-bold mb-6 text-earth-200'>Studio Hours</h3>
                            <div className='space-y-4'>
                                <div className='flex justify-between border-b border-gray-700 pb-2'>
                                    <span>Monday - Friday</span>
                                    <span className='font-bold'>6:00 AM - 9:00 PM</span>
                                </div>
                                <div className='flex justify-between border-b border-gray-700 pb-2'>
                                    <span>Saturday</span>
                                    <span className='font-bold'>7:00 AM - 7:00 PM</span>
                                </div>
                                <div className='flex justify-between text-gray-400'>
                                    <span>Sunday</span>
                                    <span className='font-bold'>8:00 AM - 2:00 PM</span>
                                </div>
                            </div>
                        </div>

                        {/* Socials */}
                        <div className='bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-center'>
                            <h4 className='font-bold text-earth-900 mb-6'>Follow our daily inspiration</h4>
                            <div className='flex justify-center gap-6'>
                                <a href='https://instagram.com' target='_blank' rel='noopener noreferrer' className='bg-earth-100 p-4 rounded-full text-earth-900 hover:bg-accent hover:text-white transition-all text-xl'><FaInstagram /></a>
                                <a href='https://facebook.com' target='_blank' rel='noopener noreferrer' className='bg-earth-100 p-4 rounded-full text-earth-900 hover:bg-blue-600 hover:text-white transition-all text-xl'><FaFacebook /></a>
                                <a href='https://youtube.com' target='_blank' rel='noopener noreferrer' className='bg-earth-100 p-4 rounded-full text-earth-900 hover:bg-red-600 hover:text-white transition-all text-xl'><FaYoutube /></a>
                                <a href='https://whatsapp.com' target='_blank' rel='noopener noreferrer' className='bg-earth-100 p-4 rounded-full text-earth-900 hover:bg-green-500 hover:text-white transition-all text-xl'><FaWhatsapp /></a>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

        </div>
    );
};

export default Contact;
