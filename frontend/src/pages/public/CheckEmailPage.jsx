import React from 'react';
import { Link } from 'react-router-dom';

const CheckEmailPage = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
            <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-primary opacity-10 dark:opacity-20 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-primary opacity-10 dark:opacity-20 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="w-full max-w-sm bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-2xl p-6 shadow-xl relative z-20 text-center">

                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                    <span className="material-symbols-rounded text-2xl">mark_email_unread</span>
                </div>

                <h2 className="text-xl font-bold mb-2">Check Your Email</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">We've sent a verification link to your inbox. Click the link to activate your account.</p>

                <div className="space-y-2 text-left mb-5">
                    <div className="flex items-center gap-2.5 p-2.5 bg-slate-50 dark:bg-white/5 rounded-lg">
                        <span className="material-symbols-rounded text-primary text-lg">inbox</span>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Check your inbox & spam folder</p>
                    </div>
                    <div className="flex items-center gap-2.5 p-2.5 bg-slate-50 dark:bg-white/5 rounded-lg">
                        <span className="material-symbols-rounded text-primary text-lg">touch_app</span>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Click the verification link</p>
                    </div>
                    <div className="flex items-center gap-2.5 p-2.5 bg-slate-50 dark:bg-white/5 rounded-lg">
                        <span className="material-symbols-rounded text-primary text-lg">login</span>
                        <p className="text-xs text-slate-600 dark:text-slate-400">You'll be auto-logged in after verifying</p>
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-white/10">
                    <Link to="/login" className="inline-block w-full bg-primary hover:bg-teal-500 text-slate-900 font-bold py-2.5 rounded-xl shadow-md shadow-primary/20 transition-all duration-300 text-sm">
                        Go to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CheckEmailPage;
