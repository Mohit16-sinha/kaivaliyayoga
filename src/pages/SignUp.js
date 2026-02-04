import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SignUp = () => {
    const [formData, setFormData] = React.useState({ name: '', email: '', password: '', phone: '' });
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Check if signing up as a professional
    const searchParams = new URLSearchParams(location.search);
    const isProfessional = searchParams.get('type') === 'professional';

    const [termsAccepted, setTermsAccepted] = React.useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSignup = async () => {
        setError('');
        setLoading(true);
        try {
            // Basic validation
            if (!formData.name || !formData.email || !formData.password || !formData.phone) {
                throw new Error("Please fill in all required fields.");
            }

            // Phone Validation (Numeric only, 10-15 digits)
            const phoneRegex = /^\d{10,15}$/;
            if (!phoneRegex.test(formData.phone.replace(/[^0-9]/g, ''))) {
                throw new Error("Phone number must contain 10 to 15 digits.");
            }

            // Terms Validation
            if (!termsAccepted) {
                throw new Error("You must accept the Terms & Conditions to proceed.");
            }

            // Clean phone number (remove non-digits for backend)
            const cleanPhone = formData.phone.replace(/[^0-9]/g, '');

            // Construct payload with role/type
            const payload = {
                ...formData,
                phone: cleanPhone,
                role: isProfessional ? 'professional' : 'client',
                user_type: isProfessional ? 'professional' : 'client'
            };

            await signup(payload);

            alert('Account created! Please Sign In.');
            // Preserve the type param if redirecting back to signin (optional, but helpful if we add auto-fill there)
            navigate('/signin');

        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen pt-32 pb-12 flex items-center justify-center container mx-auto px-4'>
            <div className='bg-white p-8 lg:p-12 rounded-lg shadow-2xl max-w-md w-full border border-earth-200'>
                <h2 className='text-3xl font-bold mb-6 text-center text-earth-900 font-primary'>
                    {isProfessional ? 'Join as Professional' : 'Create Account'}
                </h2>
                <p className='text-center text-gray-600 mb-8 font-light'>
                    {isProfessional ? 'Expand your practice with Kaivalya' : 'Join our community of mindfulness'}
                </p>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">{error}</div>}

                <form>
                    <div className='mb-4'>
                        <label
                            className='block text-gray-700 text-sm font-bold mb-2 font-secondary'
                            htmlFor='name'
                        >
                            Full Name
                        </label>
                        <input
                            className='appearance-none border border-earth-300 rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-accent transition-colors'
                            id='name'
                            type='text'
                            placeholder='Your Name'
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className='mb-4'>
                        <label
                            className='block text-gray-700 text-sm font-bold mb-2 font-secondary'
                            htmlFor='email'
                        >
                            Email Address
                        </label>
                        <input
                            className='appearance-none border border-earth-300 rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-accent transition-colors'
                            id='email'
                            type='email'
                            placeholder='you@example.com'
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className='mb-4'>
                        <label
                            className='block text-gray-700 text-sm font-bold mb-2 font-secondary'
                            htmlFor='phone'
                        >
                            Phone Number
                        </label>
                        <input
                            className='appearance-none border border-earth-300 rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-accent transition-colors'
                            id='phone'
                            type='tel'
                            placeholder='e.g., 9876543210'
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className='mb-4'>
                        <label
                            className='block text-gray-700 text-sm font-bold mb-2 font-secondary'
                            htmlFor='password'
                        >
                            Password
                        </label>
                        <input
                            className='appearance-none border border-earth-300 rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-accent transition-colors'
                            id='password'
                            type='password'
                            placeholder='******************'
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Removed confirm password for simplicity in this step, or can add back if needed logic */}

                    <div className='flex items-center mb-6'>
                        <input
                            id='terms'
                            type='checkbox'
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            className='h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded'
                        />
                        <label htmlFor='terms' className='ml-2 block text-sm text-gray-900'>
                            I agree to the{' '}
                            <button type="button" className='text-accent hover:underline'>
                                Terms & Conditions
                            </button>
                        </label>
                    </div>

                    <button
                        className={`w-full bg-accent hover:bg-accent-hover text-white font-bold py-3 px-4 rounded-full focus:outline-none focus:shadow-outline transition-all transform hover:-translate-y-0.5 shadow-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        type='button'
                        onClick={handleSignup}
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p className='mt-8 text-center text-sm text-gray-600'>
                    Already have an account?{' '}
                    <Link
                        to='/signin'
                        className='text-accent font-bold hover:text-accent-hover'
                    >
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
