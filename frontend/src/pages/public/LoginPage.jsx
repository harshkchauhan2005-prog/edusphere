import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/auth/login', { email, password });
            login(res.data.token, res.data.data);
            navigate(`/${res.data.data.role}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
            <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-primary opacity-10 dark:opacity-20 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-primary opacity-10 dark:opacity-20 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center z-10">
                <div className="hidden lg:flex flex-col justify-center space-y-8 pr-8">
                    <Link to="/" className="flex items-center space-x-2 group cursor-pointer hover:opacity-80 transition-opacity">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                            <span className="material-symbols-rounded text-white">school</span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">EduSphere</h1>
                    </Link>
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-emerald-400 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                            <img alt="Student focused on learning" className="w-full h-[500px] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyLu3qAtZr3NN99_jGE4cD4ecGvA3LkAFJlS4FowR2OOenDea9O1ysuQ24-cb7A_K_XFmZyLZuTUfJwqvVKYJYdFUb_ziA1u4FSON1R_uYC_BKXHg9ckef1kt-Q6Yb7Vmq1RodIlFDs-uloXVnMCXNF2WNRAVLdBu72V4Q2rl2_uRUoxJ64mFwoKI10JQk8v3-fSVSRzqBIDd3P9bpsEGMVDidhuKW7yYKmAJeDTDBNJZ96Uc7rRXDnRMtaOqyMWmAA702VcvGFZY" />
                            <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 via-transparent to-transparent flex flex-col justify-end p-8">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex -space-x-3">
                                        <img alt="Avatar" className="w-8 h-8 rounded-full border-2 border-slate-800" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxAD34diiiTPUaxtyUbIHmHhiZH5093rIdTG-ucSaeHs4SxLsupdXY4PH5C21_t1RyoHobnsW0OVoQwgt1kSyDxGjENChvzBo3ZVwALaszuLIWSkvW6OOqBJBA6s0IrCmJzd-H1VV-WIix9WJ5lN9OtrTKHnegEvtUTqhM5_CemUHISTqAuRRUFjzrx5BCAge9Kyh3Wxpz4Zy_d2bQ_MNbZI7plNbfwwcAWAtJ0QhruYGrBXJ7Uft42o3SlFjtWgaE8-69h4VgA2c" />
                                        <img alt="Avatar" className="w-8 h-8 rounded-full border-2 border-slate-800" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVPav7aWizyxmrPY3gLq5MjAAYhvlmrd-FuFlP_YShZ58AL3Pdl8GopWXOpB5V3ouE_aVduagQmIH81isUIr2DiXXnettd8Oq4moamD5sVD_dYwb1PSmfXnBkgHjYkqGPO9kdTFT0oAlkAvyTWZxkFH3ReAPwFQGdPh_qldGPZ6HTw6JLjLlVuzAkOA_wl2k3NPxI4oeaPPk3D9pkNSvc_DHOpuHJALtVTll6_9vTpKEOY0XHVhUSt6aJDxDbnAcMaUWc13JFp7m4" />
                                        <img alt="Avatar" className="w-8 h-8 rounded-full border-2 border-slate-800" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDH4jxH_DVuaFJ1PpR-1afZ5nrFq6dEJIdWtyPX8gXJ2yGHP9BvwqFJmVR0Xqlda8loe2_x11Z-rJZc8hJVUnwau8YdzO9rIsNNcr4i5KxrAkG8Ml8pdL55mGY9tPumdIKnmJqfERN0TiYeNnBFHLtma32qSp3ozmkfWAvRzsivIauJdDQCXSTeZ_miicHQfSZ-HJaryaQFoL6dVWyytISWTZ0ZkBYdpipVCRLiFoASRy2dbGG0Ssj6rlNKESirng97N4sNJj3fncw" />
                                    </div>
                                    <span className="text-sm text-slate-300">+4,73K Students joined today</span>
                                </div>
                                <h2 className="text-3xl font-bold text-white leading-tight">Elevate your learning experience with AI-powered paths.</h2>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6 opacity-50 dark:opacity-40">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-rounded text-lg">verified</span>
                            <span className="text-xs uppercase tracking-widest font-semibold">Accredited</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-rounded text-lg">schedule</span>
                            <span className="text-xs uppercase tracking-widest font-semibold">Self-paced</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-rounded text-lg">workspace_premium</span>
                            <span className="text-xs uppercase tracking-widest font-semibold">Certificates</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center lg:justify-end">
                    <div className="w-full max-w-md bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-[2rem] p-8 lg:p-12 shadow-2xl relative z-20">
                        <Link to="/" className="lg:hidden flex items-center justify-center space-x-2 mb-8 group cursor-pointer hover:opacity-80 transition-opacity">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                                <span className="material-symbols-rounded text-white text-sm">school</span>
                            </div>
                            <h1 className="text-xl font-bold tracking-tight">EduSphere</h1>
                        </Link>

                        <div className="mb-10 text-center lg:text-left">
                            <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
                            <p className="text-slate-500 dark:text-slate-400">Please enter your details to sign in to your account.</p>
                        </div>

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
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="password">Password</label>
                                    <Link to="/forgotpassword" className="text-xs font-semibold text-primary hover:underline">Forgot password?</Link>
                                </div>
                                <div className="relative">
                                    <span className="material-symbols-rounded absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">lock</span>
                                    <input
                                        className="w-full pl-12 pr-12 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white"
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        <span className="material-symbols-rounded text-lg">
                                            {showPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input className="w-4 h-4 rounded border-slate-300 dark:border-slate-800 text-primary focus:ring-primary dark:bg-slate-900" id="remember" type="checkbox" />
                                <label className="text-sm text-slate-600 dark:text-slate-400 select-none" htmlFor="remember">Remember me for 30 days</label>
                            </div>
                            <button
                                disabled={loading}
                                className="w-full bg-primary hover:bg-teal-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 mt-6"
                                type="submit"
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="mt-8 relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white dark:bg-[#1E1E1E] px-2 text-slate-500 dark:text-slate-400 font-medium">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                <img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBG45Xzx_-UKpY5Ml15StXweYJHiM2UTvnAcRHavhWbnu7CicADnTbZeDa_NBTmlPAAxrNU8mrdLqz0czV1WU6B5OgQSg_EEzV3sYZGrVGLrOJUls3qUk5sg7Rej_hd4ibxQik85o53p3AZGfixqdjKW0dUTcCNu9rxY0S9VZaMfG_RmOQ_NhE3r80gQ0_2icncP4I5xCryMX-CPRdR0KvkA3Bqw4yNLVy_FTg2fdfhK65v55T63G40J84rvA6N5UNlGNhNdhaJp0I" />
                                <span className="text-sm font-semibold">Google</span>
                            </button>
                            <button className="flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                <img alt="LinkedIn" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJOV3G_mHdaMMrshKUY9ou4Eq2g3nYcYnR-UexOaUbiQpwynaHg1iM3eoBaUP8os108SuTrzfWOLSCsrVULN8wpLoemNAALUX6tusGDo2E_Gf_4F9_nE9P8O3ADcWP-0lakeJmRIsC4fPwPcivdg_tklNkWOqh5RkVOVDrXRlUpFA5zS40gumTF0_UYkSL0J0SYNLXPaqFWocyXARrxYn-_t3Tf96JN-GRTAOhsyk8mTsIU9UWqAYbp3x11AVi1BdUeFM_QnAQUHk" />
                                <span className="text-sm font-semibold">LinkedIn</span>
                            </button>
                        </div>

                        <p className="mt-10 text-center text-sm text-slate-500 dark:text-slate-400">
                            Don't have an account?
                            <Link to="/register" className="text-primary font-bold hover:underline ml-1">Register for free</Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Themed toggle intentionally left off component body avoiding manual injections, controlled by context broadly */}
        </div>
    );
};

export default LoginPage;
