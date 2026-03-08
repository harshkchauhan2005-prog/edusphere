import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const VerifyEmailPage = () => {
    const { verificationtoken } = useParams();
    const navigate = useNavigate();
    const { login } = useAuth();

    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
    const [message, setMessage] = useState('Verifying your email address...');

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const res = await api.put(`/auth/verifyemail/${verificationtoken}`);
                setStatus('success');
                setMessage('Email verified successfully! You will be redirected shortly.');

                // Automatically log them in
                setTimeout(() => {
                    login(res.data.token, res.data.data);
                    navigate(`/${res.data.data.role}`);
                }, 3000);
            } catch (err) {
                setStatus('error');
                setMessage(err.response?.data?.message || 'Verification failed. The token may be invalid or expired.');
            }
        };

        if (verificationtoken) {
            verifyEmail();
        } else {
            setStatus('error');
            setMessage('No verification token provided.');
        }
    }, [verificationtoken, navigate, login]);

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
            <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-primary opacity-10 dark:opacity-20 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-primary opacity-10 dark:opacity-20 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="w-full max-w-md bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-[2rem] p-8 lg:p-12 shadow-2xl relative z-20 text-center">

                <div className="flex items-center justify-center space-x-2 mb-8">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${status === 'verifying' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-500' :
                            status === 'success' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500' :
                                'bg-red-100 dark:bg-red-900/30 text-red-500'
                        }`}>
                        <span className="material-symbols-rounded text-3xl">
                            {status === 'verifying' ? 'hourglass_empty' : status === 'success' ? 'check_circle' : 'error'}
                        </span>
                    </div>
                </div>

                <h2 className="text-3xl font-bold mb-4">Email Verification</h2>

                <div className={`mb-8 p-4 rounded-xl text-sm border ${status === 'verifying' ? 'bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-800/50' :
                        status === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50' :
                            'bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 border-red-100 dark:border-red-800/50'
                    }`}>
                    {message}
                </div>

                {status === 'error' && (
                    <Link to="/login" className="inline-block bg-primary hover:bg-teal-500 text-slate-900 font-bold py-3 px-8 rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 transform hover:-translate-y-0.5">
                        Back to Login
                    </Link>
                )}
            </div>
        </div>
    );
};

export default VerifyEmailPage;
