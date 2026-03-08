import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const res = await api.post('/auth/forgotpassword', { email });
            setMessage(res.data.data || 'Password reset link sent to your email.');
            setEmail('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset email.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
            <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-primary opacity-10 dark:opacity-20 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-primary opacity-10 dark:opacity-20 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="w-full max-w-md bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-[2rem] p-8 lg:p-12 shadow-2xl relative z-20">
                <div className="flex items-center justify-center space-x-2 mb-8">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                        <span className="material-symbols-rounded text-white">school</span>
                    </div>
                </div>

                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-bold mb-2">Forgot Password</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Enter your email address to receive a password reset token.</p>
                </div>

                {message && (
                    <div className="mb-6 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl text-sm text-center border border-emerald-100 dark:border-emerald-800">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-6 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm text-center border border-red-100 dark:border-red-800">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300" htmlFor="email">Email Address</label>
                        <div className="relative">
                            <span className="material-symbols-rounded absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">mail</span>
                            <input
                                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white"
                                id="email"
                                type="email"
                                required
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-primary hover:bg-teal-500 text-slate-900 font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                        type="submit"
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>

                    <div className="text-center pt-4">
                        <Link to="/login" className="text-sm text-slate-500 hover:text-primary transition-colors font-medium">
                            &larr; Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
