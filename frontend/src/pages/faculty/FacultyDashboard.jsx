import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';
import CourseManager from './CourseManager';
import ProfilePage from '../shared/ProfilePage';
import GlobalSearch from '../../components/common/GlobalSearch';
import FacultyContentList from './FacultyContentList';

const FacultyDashboard = () => {
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Close sidebar when route changes on mobile
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navLinks = [
        { path: "/faculty", icon: "dashboard", label: "Dashboard", exact: true },
        { path: "/faculty/courses", icon: "subject", label: "My Courses" },
        { path: "/faculty/materials", icon: "folder", label: "Materials" },
        { path: "/faculty/quizzes", icon: "quiz", label: "Quizzes" },
        { path: "/faculty/assignments", icon: "assignment", label: "Assignments" }
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 transition-colors duration-200">
            {/* Mobile Sidebar Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar Navigation */}
            <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-white dark:bg-card-dark border-r border-slate-200 dark:border-slate-800 flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} shrink-0 pt-1`}>
                <div className="p-6 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white">
                            <span className="material-symbols-rounded text-xl">auto_stories</span>
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">EduSphere</h1>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-500 hover:text-slate-900 dark:hover:text-white pb-1">
                        <span className="material-symbols-rounded">close</span>
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
                    {navLinks.map((link, idx) => {
                        const isActive = link.exact ? location.pathname === link.path : location.pathname.startsWith(link.path) && link.path !== "#";
                        return (
                            <Link
                                key={idx}
                                to={link.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <span className="material-symbols-rounded">{link.icon}</span>
                                {link.label}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800 mt-auto">
                    <Link to="/faculty/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-400 font-medium">
                        <span className="material-symbols-rounded">person</span>
                        Profile
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 font-bold py-3 rounded-xl mt-2 text-sm transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-rounded text-sm">logout</span>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto relative w-full">
                <header className="flex items-center justify-between lg:justify-end gap-4 sticky top-0 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md z-30 py-4 px-4 sm:px-8 border-b border-transparent">
                    <div className="lg:hidden flex items-center gap-3 mr-auto">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
                        >
                            <span className="material-symbols-rounded">menu</span>
                        </button>
                    </div>

                    <div className="hidden lg:block mr-auto">
                        <h2 className="text-2xl font-bold">Faculty Dashboard</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Welcome, {user?.name || 'Professor'}</p>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                        <div className="hidden md:block">
                            <GlobalSearch placeholder="Search courses..." />
                        </div>
                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-card-dark relative hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-symbols-rounded text-[20px] text-slate-600 dark:text-slate-300">notifications</span>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-card-dark"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-slate-200 dark:border-slate-800">
                            <Link to="/faculty/profile">
                                {user?.profilePhoto && user?.profilePhoto !== 'no-photo.jpg' ? (
                                    <img alt="User Profile" className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-800" src={user.profilePhoto.startsWith('http') ? user.profilePhoto : `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000'}${user.profilePhoto.startsWith('/uploads') ? user.profilePhoto : '/uploads/profiles/' + user.profilePhoto}`} />
                                ) : (
                                    <img alt="Profile Avatar" className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" src={`https://ui-avatars.com/api/?name=${user?.name || 'Professor'}&background=1E3A8A&color=fff`} />
                                )}
                            </Link>
                        </div>
                        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block"></div>
                        <button
                            onClick={toggleTheme}
                            className="w-10 h-10 hidden sm:flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <span className="material-symbols-rounded text-[20px]">{isDark ? 'light_mode' : 'dark_mode'}</span>
                        </button>
                    </div>
                </header>

                <div className="px-4 sm:px-8 pb-12 mt-4">

                    <Routes>
                        <Route path="/" element={<FacultyOverview />} />
                        <Route path="/courses" element={<FacultyCourses />} />
                        <Route path="/courses/:courseId" element={<CourseManager />} />
                        <Route path="/materials" element={<FacultyContentList type="materials" />} />
                        <Route path="/quizzes" element={<FacultyContentList type="quizzes" />} />
                        <Route path="/assignments" element={<FacultyContentList type="assignments" />} />
                        <Route path="/profile" element={<ProfilePage />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

const FacultyOverview = () => {
    const [stats, setStats] = useState({ courses: 0, students: 0 });
    const [quizCount, setQuizCount] = useState(0);
    const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const res = await api.get('/courses/managed');
                const courses = res.data.data || [];
                const totalStudents = courses.reduce((sum, c) => sum + (c.enrolledStudents?.length || 0), 0);
                setStats({ courses: courses.length, students: totalStudents });

                // Fetch quizzes, assignments, and announcements for all courses
                let totalQuizzes = 0;
                const deadlines = [];
                const activities = [];

                await Promise.all(courses.map(async (course) => {
                    try {
                        const [quizRes, assignRes] = await Promise.all([
                            api.get(`/courses/${course._id}/quizzes`),
                            api.get(`/courses/${course._id}/assignments`)
                        ]);
                        totalQuizzes += (quizRes.data.data || []).length;

                        // Collect upcoming assignment deadlines
                        (assignRes.data.data || []).forEach(a => {
                            if (new Date(a.deadline) >= new Date()) {
                                deadlines.push({
                                    title: a.title,
                                    courseName: course.courseName,
                                    deadline: a.deadline
                                });
                            }
                        });

                        // Collect announcements as activity
                        (course.announcements || []).forEach(ann => {
                            activities.push({
                                title: ann.title,
                                content: ann.content,
                                courseName: course.courseName,
                                date: ann.createdAt
                            });
                        });
                    } catch (err) {
                        // individual course fetch failed, skip
                    }
                }));

                setQuizCount(totalQuizzes);
                setUpcomingDeadlines(deadlines.filter(a => new Date(a.deadline) > new Date()).sort((a, b) => new Date(a.deadline) - new Date(b.deadline)).slice(0, 5));

                // Get top 5 recent activities regardless of 24h limit for better UX
                setRecentActivity(activities.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5));
            } catch (err) {
                console.error('Failed to fetch stats', err);
            }
        };
        fetchAll();
    }, []);

    return (
        <React.Fragment>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Link to="/faculty/courses" className="bg-primary hover:bg-teal-500 text-white p-4 rounded-3xl flex items-center justify-between group transition-all text-left block w-full hover:shadow-lg">
                    <div>
                        <p className="text-sm opacity-90">Manage Content</p>
                        <h3 className="font-bold text-lg">Create Course</h3>
                    </div>
                    <span className="material-symbols-rounded bg-white/20 p-2 rounded-full group-hover:rotate-45 transition-transform">add</span>
                </Link>
                <Link to="/faculty/courses" className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 p-4 rounded-3xl flex items-center justify-between group hover:border-primary/50 transition-all text-left">
                    <div>
                        <p className="text-sm text-slate-500">Resource Hub</p>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">Upload Material</h3>
                    </div>
                    <span className="material-symbols-rounded text-primary bg-primary/10 p-2 rounded-full">file_upload</span>
                </Link>
                <Link to="/faculty/courses" className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 p-4 rounded-3xl flex items-center justify-between group hover:border-primary/50 transition-all text-left">
                    <div>
                        <p className="text-sm text-slate-500">Assessments</p>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">Create Quiz</h3>
                    </div>
                    <span className="material-symbols-rounded text-primary bg-primary/10 p-2 rounded-full">assignment_add</span>
                </Link>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                <div className="bg-white dark:bg-card-dark p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between h-40 shadow-sm">
                    <div className="flex justify-between items-start">
                        <span className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl material-symbols-rounded">auto_stories</span>
                        <span className="text-emerald-500 text-xs font-semibold px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">Active</span>
                    </div>
                    <div>
                        <h4 className="text-slate-500 dark:text-slate-400 text-sm font-medium">My Courses</h4>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.courses}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-card-dark p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between h-40 shadow-sm">
                    <div className="flex justify-between items-start">
                        <span className="p-3 bg-primary/10 text-primary rounded-2xl material-symbols-rounded">groups</span>
                        <span className="text-emerald-500 text-xs font-semibold px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">Total</span>
                    </div>
                    <div>
                        <h4 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Students</h4>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.students}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-card-dark p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between h-40 shadow-sm">
                    <div className="flex justify-between items-start">
                        <span className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl material-symbols-rounded">history_edu</span>
                        <span className="text-blue-500 text-xs font-semibold px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-lg">Live</span>
                    </div>
                    <div>
                        <h4 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Quizzes</h4>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">{quizCount}</p>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold">Activity Log</h3>
                    </div>
                    {recentActivity.length === 0 ? (
                        <div className="border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/20">
                            <span className="material-symbols-rounded text-4xl mb-2">timeline</span>
                            <p>No recent activity. Once you create a course and post announcements, activities will appear here.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentActivity.map((activity, idx) => (
                                <div key={idx} className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-primary/30 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                                            <span className="material-symbols-rounded text-xl">campaign</span>
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <h4 className="font-bold text-slate-900 dark:text-white truncate">{activity.title}</h4>
                                                <span className="text-xs text-slate-400 shrink-0">{new Date(activity.date).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{activity.content}</p>
                                            <p className="text-xs text-primary font-semibold mt-1">{activity.courseName}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="xl:col-span-1">
                    <h3 className="text-xl font-bold mb-6">Upcoming Deadlines</h3>
                    {upcomingDeadlines.length === 0 ? (
                        <div className="bg-white dark:bg-card-dark p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center">
                            <span className="material-symbols-rounded text-4xl text-slate-300 dark:text-slate-600 mb-2">event_busy</span>
                            <p className="font-bold text-slate-600 dark:text-slate-300">No upcoming deadlines</p>
                            <p className="text-sm text-slate-500 mt-2">Create assignments in your courses to see deadlines here.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {upcomingDeadlines.map((item, idx) => (
                                <div key={idx} className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:border-primary/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center shrink-0">
                                            <span className="material-symbols-rounded">assignment</span>
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">{item.title}</h4>
                                            <p className="text-xs text-slate-500">{item.courseName}</p>
                                            <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                                                Due: {new Date(item.deadline).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};


const FacultyCourses = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [formData, setFormData] = useState({ courseName: '', description: '', subject: '', semester: '1' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        fetchCourses();
        fetchSubjects();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await api.get('/courses/managed');
            setCourses(res.data.data);
        } catch (err) {
            console.error('Failed to fetch courses');
        }
    };

    const fetchSubjects = async () => {
        try {
            const res = await api.get('/admin/subjects');
            setSubjects(res.data.data);
            if (res.data.data.length > 0) {
                setFormData(prev => ({ ...prev, subject: res.data.data[0]._id }));
            }
        } catch (err) {
            console.error('Failed to fetch subjects', err);
        }
    }

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const payload = {
                courseName: formData.courseName,
                subject: formData.subject,
                semester: Number(formData.semester)
            };
            await api.post('/courses', payload);
            setFormData({ courseName: '', description: '', subject: subjects[0]?._id || '', semester: '1' });
            setIsFormOpen(false);
            fetchCourses();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create course');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manage Courses</h1>
                <button
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    className="bg-primary hover:bg-teal-500 text-slate-900 px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm active:scale-95 flex items-center gap-2"
                >
                    <span className="material-symbols-rounded text-sm">{isFormOpen ? 'close' : 'add'}</span>
                    {isFormOpen ? 'Cancel' : 'New Course'}
                </button>
            </div>

            {isFormOpen && (
                <div className="bg-white dark:bg-card-dark p-8 rounded-3xl border border-slate-200 dark:border-slate-800 mb-10 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                            <span className="material-symbols-rounded">design_services</span>
                        </div>
                        <h2 className="text-xl font-bold">Create New Course</h2>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm border border-red-100 dark:border-red-800">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleCreateCourse} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Course Title</label>
                            <input
                                type="text"
                                placeholder="e.g. Advanced UI/UX Design Fundamentals"
                                required
                                disabled={loading}
                                value={formData.courseName}
                                onChange={e => setFormData({ ...formData, courseName: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Course Description</label>
                            <textarea
                                placeholder="Describe the curriculum, goals, and target audience..."
                                required
                                rows="3"
                                disabled={loading}
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Subject</label>
                            <div className="relative">
                                <select
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none cursor-pointer dark:text-white"
                                    value={formData.subject}
                                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                    required
                                    disabled={loading}
                                >
                                    <option value="" disabled>Select Subject</option>
                                    {subjects.map(sub => (
                                        <option key={sub._id} value={sub._id}>{sub.name} ({sub.code})</option>
                                    ))}
                                </select>
                                <span className="material-symbols-rounded absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Semester</label>
                            <div className="relative">
                                <select
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none cursor-pointer dark:text-white"
                                    value={formData.semester}
                                    onChange={e => setFormData({ ...formData, semester: e.target.value })}
                                    required
                                    disabled={loading}
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                                        <option key={sem} value={sem}>Semester {sem}</option>
                                    ))}
                                </select>
                                <span className="material-symbols-rounded absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                            </div>
                        </div>

                        <div className="md:col-span-2 mt-4 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setIsFormOpen(false)}
                                className="px-6 py-3 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Creating...' : 'Publish Course'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {courses.length === 0 ? (
                    <div className="col-span-full border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 flex flex-col items-center justify-center text-slate-400 text-center min-h-[300px]">
                        <span className="material-symbols-rounded text-6xl mb-4 text-slate-300 dark:text-slate-600">book</span>
                        <p className="font-bold text-lg mb-2 text-slate-600 dark:text-slate-300">No Courses Managed</p>
                        <p className="max-w-md mx-auto">Create your first course to start adding materials and inviting students.</p>
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="mt-6 text-primary font-bold hover:underline"
                        >
                            + Create Course
                        </button>
                    </div>
                ) : (
                    courses.map(c => (
                        <div
                            key={c._id}
                            onClick={() => navigate(`/faculty/courses/${c._id}`)}
                            className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:shadow-xl hover:border-primary/50 transition-all group flex flex-col h-full cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] uppercase font-bold px-3 py-1.5 rounded-lg tracking-wider">
                                    Semester {c.semester}
                                </div>
                                <button className="text-slate-400 hover:text-primary transition-colors">
                                    <span className="material-symbols-rounded">more_horiz</span>
                                </button>
                            </div>

                            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white line-clamp-2">{c.courseName}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-grow line-clamp-3">{c.subject?.name}</p>

                            <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-500 dark:text-slate-400 mb-1">Course ID (Share via Email)</span>
                                        <span className="font-mono text-sm bg-primary/10 text-primary px-2 py-1 rounded font-bold cursor-copy hover:bg-primary/20 transition-colors inline-block text-center" title="Click to copy">{c.courseId}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                                        <span className="material-symbols-rounded text-sm">groups</span>
                                        <span className="text-sm font-semibold">{c.enrolledStudents.length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default FacultyDashboard;
