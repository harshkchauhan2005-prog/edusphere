import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student',
        semester: '1',
        department: ''
    });
    const [departments, setDepartments] = useState([]);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    React.useEffect(() => {
        const fetchDepts = async () => {
            try {
                const res = await api.get('/auth/departments');
                setDepartments(res.data.data || []);
            } catch (e) { console.error('Failed to fetch departments', e); }
        };
        fetchDepts();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleToggle = (role) => {
        setFormData({ ...formData, role });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const dataToSend = { ...formData };
        if (dataToSend.role === 'faculty') {
            delete dataToSend.semester;
        }

        try {
            await api.post('/auth/register', dataToSend);
            setSuccessMsg('A verification email has been sent to your inbox!');
            setTimeout(() => {
                navigate('/check-email');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 min-h-screen flex flex-col">
            <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
                <Link to="/" className="flex items-center gap-2 group cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="bg-primary p-1.5 rounded-lg group-hover:scale-105 transition-transform">
                        <span className="material-symbols-rounded text-gray-900 text-xl font-bold">school</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight">EduSphere</span>
                </Link>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <a className="hover:text-primary transition-colors" href="#">Courses</a>
                    <a className="hover:text-primary transition-colors" href="#">Faculty</a>
                    <a className="hover:text-primary transition-colors" href="#">Research</a>
                    <Link to="/login" className="px-5 py-2 rounded-full border border-gray-200 dark:border-gray-700 hover:border-primary transition-all">Sign In</Link>
                </div>
            </nav>

            <main className="flex-grow flex items-center justify-center px-6 py-12 relative overflow-hidden">
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .glass-effect { backdrop-filter: blur(12px); background: rgba(31, 41, 55, 0.7); }
                    .gradient-bg {
                        background: radial-gradient(circle at top left, #064e3b, transparent 40%),
                                    radial-gradient(circle at bottom right, #111827, transparent 40%);
                    }
                `}} />

                {/* Fallback gradients if custom class misses */}
                <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900 -z-20"></div>
                <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-900/20 rounded-full blur-[120px] -z-10"></div>

                <div className="grid lg:grid-cols-2 gap-16 max-w-6xl w-full items-center">
                    <div className="hidden lg:block space-y-8">
                        <h1 className="text-5xl font-bold leading-tight">
                            Keep learning and boost your <span className="text-primary">academic edge.</span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md">
                            Join the modern ecosystem for students and faculty. Access resources, track progress, and collaborate in real-time.
                        </p>

                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-3">
                                <img alt="Student Profile" className="w-10 h-10 rounded-full border-2 border-background-dark" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0J0Dxn-r2hDNNQaZdfFdcfyz0ktb4ZDX1FJckC9kDmxcGRTSlwlpPtJyWqKiUm_uEhiKsV0HWZIYg8YdRBarKx_aN3_iE4049gN__XRw-90sXBwLBo5QJvNN4Sxoe4_-RZH0xr3W_g9EJMw7pLjc_BrAz2LAwCo5XjrwF8K4v-tnAdhpH2gzgCUxOc9aDJFN89cje6sX1c7iYJftdIF63jL3X1omwnOFfdOGadpVWj2K82LvwUBT15A0Kcwipwl2btzqbjrtThUM" />
                                <img alt="Faculty Profile" className="w-10 h-10 rounded-full border-2 border-background-dark" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD59WMprqe4wBDna-ZUd9-LApHOIFkCjkq3bP-mzGoGX3Zyx8iu596jMEzY64dVynwLP2LA3Zdj3uphZYRYdZpQ0jNjYqTbQMpLwJ-fwNHm6HuxEraE9gu24nRZYnbB8GdYDALQSfiEt8ZRVXcPQxQ0jtSELzpE0epyr843LG3gnZcwg-31Z0JnHCnR6admEmDVUVaVbPO7NIGvdZO2yOR1gRrRPhuL5-56G2aldSFTpWP6WymAX_ORWGoDfRzauf0a6-Hcz3ztsW8" />
                                <img alt="Admin Profile" className="w-10 h-10 rounded-full border-2 border-background-dark" src="https://lh3.googleusercontent.com/aida-public/AB6AXuABtqVuZMuCs9LQZBe-_8-zTdJwWC7o_YiA2BBn7iQCZQmd6rmm1Q8O7fNFlenT12hnXiYu6t79l1lsmYbCv-xZs2lWxWP3WLrCaQWLcL6WkYijkKRP4MK_dPKAmIILiuDGXhSHPbHTYyUEftFT3LHTOflLHncZpyFPBoH4AaEyrgHzy13cAr2JJGB7BPyWk3mhwVbdesKog8P4BMT8vao8rU1U9j5mClvhRJhOG4U_mzzxDfm31LmF605amvn42NFx1ISzSLHcSNo" />
                                <div className="w-10 h-10 rounded-full border-2 border-background-dark bg-gray-800 flex items-center justify-center text-xs font-bold text-white">+12K</div>
                            </div>
                            <p className="text-sm text-gray-400">Trusted by students across 45+ departments.</p>
                        </div>

                        <div className="relative pt-12">
                            <div className="absolute -top-4 -left-4 w-48 p-4 rounded-2xl glass-effect border border-white/10 shadow-2xl transform -rotate-6">
                                <div className="h-2 w-12 bg-primary rounded mb-2"></div>
                                <p className="text-[10px] text-gray-300">New Research Paper Published</p>
                            </div>
                            <div className="absolute top-20 left-32 w-40 p-4 rounded-2xl glass-effect border border-white/10 shadow-2xl transform rotate-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="material-symbols-rounded text-primary text-sm">auto_graph</span>
                                    <span className="text-[10px] font-bold text-white">GPA: 3.9/4.0</span>
                                </div>
                                <div className="h-1 w-full bg-gray-700 rounded overflow-hidden">
                                    <div className="h-full bg-primary w-[90%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full relative z-10">
                        <div className="bg-white dark:bg-card-dark p-8 md:p-10 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-800">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold mb-2">Create Account</h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Join the EduSphere academic network today.</p>
                            </div>

                            {error && (
                                <div className="mb-6 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm border border-red-100 dark:border-red-800 animate-in fade-in zoom-in-95">
                                    {error}
                                </div>
                            )}

                            {successMsg && (
                                <div className="mb-6 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl text-sm border border-emerald-100 dark:border-emerald-800 animate-in fade-in zoom-in-95 flex items-start gap-3">
                                    <span className="material-symbols-rounded text-emerald-500 shrink-0">mark_email_read</span>
                                    <div>
                                        <p className="font-bold mb-1">Success!</p>
                                        <p>{successMsg}</p>
                                        <Link to="/login" className="inline-block mt-3 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-lg font-semibold hover:bg-emerald-200 transition-colors">Go to Login</Link>
                                    </div>
                                </div>
                            )}

                            {!successMsg && (
                                <form className="space-y-5" onSubmit={handleSubmit}>
                                    <div className="bg-gray-100 dark:bg-gray-800 p-1.5 rounded-xl flex items-center mb-6">
                                        <button
                                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${formData.role === 'student' ? 'bg-primary text-gray-900 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                                            onClick={() => handleRoleToggle('student')}
                                            type="button"
                                        >
                                            Student
                                        </button>
                                        <button
                                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${formData.role === 'faculty' ? 'bg-primary text-gray-900 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                                            onClick={() => handleRoleToggle('faculty')}
                                            type="button"
                                        >
                                            Faculty
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 px-1">Full Name</label>
                                            <input
                                                className="w-full bg-gray-50 dark:bg-gray-800 border-transparent focus:border-primary focus:ring-0 rounded-xl py-3 px-4 transition-all outline-none"
                                                placeholder="John Doe"
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 px-1">Institutional Email</label>
                                            <input
                                                className="w-full bg-gray-50 dark:bg-gray-800 border-transparent focus:border-primary focus:ring-0 rounded-xl py-3 px-4 transition-all outline-none"
                                                placeholder="john@university.edu"
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 px-1">Password</label>
                                        <div className="relative">
                                            <input
                                                className="w-full bg-gray-50 dark:bg-gray-800 border-transparent focus:border-primary focus:ring-0 rounded-xl py-3 pl-4 pr-12 transition-all outline-none"
                                                placeholder="••••••••"
                                                minLength="6"
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                            />
                                            <button
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                <span className="material-symbols-rounded text-lg">
                                                    {showPassword ? 'visibility_off' : 'visibility'}
                                                </span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className={`grid grid-cols-1 gap-5 ${formData.role === 'student' ? 'md:grid-cols-2' : ''}`}>
                                        {/* Abstracted Department Field since Backend relies on specific Object IDs */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 px-1">Department</label>
                                            <select
                                                name="department"
                                                value={formData.department}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-gray-50 dark:bg-gray-800 border-transparent focus:border-primary focus:ring-0 rounded-xl py-3 px-4 transition-all outline-none appearance-none"
                                            >
                                                <option value="" disabled>Select Department</option>
                                                {departments.map(d => (
                                                    <option key={d._id} value={d._id}>{d.name} ({d.code})</option>
                                                ))}
                                            </select>
                                        </div>

                                        {formData.role === 'student' && (
                                            <div className="space-y-2 transition-opacity duration-300">
                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 px-1">Semester</label>
                                                <select
                                                    className="w-full bg-gray-50 dark:bg-gray-800 border-transparent focus:border-primary focus:ring-0 rounded-xl py-3 px-4 transition-all outline-none appearance-none"
                                                    name="semester"
                                                    value={formData.semester}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                                                        <option key={sem} value={sem}>Semester {sem}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3 pt-2">
                                        <input className="rounded bg-gray-50 dark:bg-gray-800 border-transparent text-primary focus:ring-0 w-5 h-5 flex-shrink-0" id="terms" type="checkbox" required />
                                        <label className="text-xs text-gray-500 dark:text-gray-400" htmlFor="terms">
                                            I agree to the <a className="text-primary hover:underline" href="#">Terms of Service</a> and <a className="text-primary hover:underline" href="#">Privacy Policy</a>.
                                        </label>
                                    </div>

                                    <button
                                        className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-all active:scale-[0.98] mt-6 disabled:opacity-50"
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? 'Creating Account...' : 'Get Started Free'}
                                    </button>
                                </form>
                            )}

                            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Already have an account? <Link className="text-primary font-semibold hover:underline" to="/login">Log in</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="bg-white/50 dark:bg-black/20 py-10 px-6 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-40">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-rounded">bolt</span>
                        <span className="font-bold">EduConnect</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-rounded">adjust</span>
                        <span className="font-bold">ScholarLink</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-rounded">extension</span>
                        <span className="font-bold">CourseSync</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-rounded">auto_awesome</span>
                        <span className="font-bold">SmartLearn</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-rounded">token</span>
                        <span className="font-bold">TrustGate</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default RegisterPage;
