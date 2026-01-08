import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SignIn = () => {
    const [formData, setFormData] = React.useState({ email: '', password: '' });
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const isAdminLogin = searchParams.get('role') === 'admin';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleLogin = async () => {
        setError('');
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Login failed');

            // Admin Check
            if (isAdminLogin && data.user.role !== 'admin') {
                throw new Error('Access Denied: You are not an administrator.');
            }

            // Success
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect based on login type
            window.location.href = isAdminLogin ? '/admin' : '/';

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-12 flex items-center justify-center container mx-auto px-4">
            <div className={`bg-white p-8 lg:p-12 rounded-lg shadow-2xl max-w-md w-full border ${isAdminLogin ? 'border-indigo-200' : 'border-earth-200'}`}>
                <h2 className={`text-3xl font-bold mb-6 text-center ${isAdminLogin ? 'text-indigo-900' : 'text-earth-900'} font-primary`}>
                    {isAdminLogin ? 'Admin Login' : 'Welcome Back'}
                </h2>
                <p className="text-center text-gray-600 mb-8 font-light">
                    {isAdminLogin ? 'Secure access for studio administrators' : 'Sign in to continue your journey'}
                </p>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">{error}</div>}

                <form>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2 font-secondary" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            className="appearance-none border border-earth-300 rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-accent transition-colors"
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2 font-secondary" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="appearance-none border border-earth-300 rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-accent transition-colors"
                            id="password"
                            type="password"
                            placeholder="******************"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                Remember me
                            </label>
                        </div>
                        <button type="button" className="text-sm text-accent hover:text-accent-hover font-medium">
                            Forgot Password?
                        </button>
                    </div>

                    <button
                        className={`w-full ${isAdminLogin ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-accent hover:bg-accent-hover'} text-white font-bold py-3 px-4 rounded-full focus:outline-none focus:shadow-outline transition-all transform hover:-translate-y-0.5 shadow-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        type="button"
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? 'Authenticating...' : (isAdminLogin ? 'Login as Admin' : 'Sign In')}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-600">
                    {isAdminLogin ? (
                        <Link to="/signin" className="text-gray-500 hover:text-gray-800 underline">
                            ← Back to Student Login
                        </Link>
                    ) : (
                        <>
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-accent font-bold hover:text-accent-hover">
                                Sign Up
                            </Link>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
};

export default SignIn;
