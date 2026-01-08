import React from 'react';
import { Link } from 'react-router-dom';

const SignUp = () => {
    const [formData, setFormData] = React.useState({ name: '', email: '', password: '', phone: '' });
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSignup = async () => {
        setError('');
        setLoading(true);
        try {
            // Basic validation
            if (!formData.name || !formData.email || !formData.password) {
                throw new Error("Please fill in all required fields.");
            }

            const response = await fetch('http://localhost:8080/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Signup failed');

            alert('Account created! Please Sign In.');
            window.location.href = '/signin';

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen pt-32 pb-12 flex items-center justify-center container mx-auto px-4'>
            <div className='bg-white p-8 lg:p-12 rounded-lg shadow-2xl max-w-md w-full border border-earth-200'>
                <h2 className='text-3xl font-bold mb-6 text-center text-earth-900 font-primary'>
                    Create Account
                </h2>
                <p className='text-center text-gray-600 mb-8 font-light'>
                    Join our community of mindfulness
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
                            placeholder='+1 (555) 000-0000'
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
