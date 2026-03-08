import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';
import StudentCourseManager from './StudentCourseManager';
import ProfilePage from '../shared/ProfilePage';
import GlobalSearch from '../../components/common/GlobalSearch';
import StudentContentList from './StudentContentList';

const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navLinks = [
        { path: "/student", icon: "dashboard", label: "Dashboard", exact: true },
        { path: "/student/courses", icon: "menu_book", label: "My Courses" },
        { path: "/student/materials", icon: "description", label: "Materials" },
        { path: "/student/quizzes", icon: "quiz", label: "Quizzes" },
        { path: "/student/assignments", icon: "assignment", label: "Assignments" },
        { path: "/student/special", icon: "folder", label: "Shared Resources" },
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-200">
            {/* Sidebar Navigation */}
            <aside className="w-64 flex-shrink-0 bg-white dark:bg-card-dark border-r border-slate-200 dark:border-border-dark hidden lg:flex flex-col">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="material-symbols-rounded text-white text-xl">school</span>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">EduSphere</h1>
                </div>

                <nav className="flex-1 px-4 space-y-1 mt-4">
                    {navLinks.map((link, idx) => {
                        const isActive = link.exact ? location.pathname === link.path : location.pathname.startsWith(link.path) && link.path !== "#";
                        return (
                            <Link
                                key={idx}
                                to={link.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                                    }`}
                            >
                                <span className="material-symbols-rounded">{link.icon}</span>
                                <span>{link.label}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 mt-auto space-y-2">
                    <Link to="/student/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-slate-500 dark:text-slate-400 font-medium">
                        <span className="material-symbols-rounded">person</span>
                        <span>Profile</span>
                    </Link>
                    <div className="bg-slate-100 dark:bg-white/5 rounded-2xl p-4">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">STUDENT PORTAL</p>
                        <p className="text-sm border-t border-slate-200 dark:border-border-dark pt-2 mt-2">EduSphere MVP v1.0</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 font-bold py-3 rounded-xl text-sm transition-colors"
                    >
                        <span className="material-symbols-rounded text-sm">logout</span>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto relative">
                <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-transparent">
                    <div>
                        <h2 className="text-2xl font-bold">Student Dashboard</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back, {user?.name || 'Student'}!</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block">
                            <GlobalSearch placeholder="Search courses, materials..." />
                        </div>
                        <button className="p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors relative">
                            <span className="material-symbols-rounded">notifications</span>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-background-dark"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-border-dark">
                            {user?.profilePhoto && user?.profilePhoto !== 'no-photo.jpg' ? (
                                <img alt="User Profile" className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-800" src={`${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000'}${user.profilePhoto.startsWith('/uploads') ? user.profilePhoto : '/uploads/profiles/' + user.profilePhoto}`} />
                            ) : (
                                <img alt="User Profile" className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-800" src={`https://ui-avatars.com/api/?name=${user?.name || 'Student'}&background=2DD4BF&color=fff`} />
                            )}
                        </div>
                        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1"></div>
                        <button
                            onClick={toggleTheme}
                            className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <span className="material-symbols-rounded text-[20px]">{isDark ? 'light_mode' : 'dark_mode'}</span>
                        </button>
                    </div>
                </header>

                <div className="px-8 pb-12">
                    <Routes>
                        <Route path="/" element={<Overview />} />
                        <Route path="/courses" element={<StudentCourses />} />
                        <Route path="/courses/:courseId" element={<StudentCourseManager />} />
                        <Route path="/materials" element={<StudentContentList type="materials" />} />
                        <Route path="/quizzes" element={<StudentContentList type="quizzes" />} />
                        <Route path="/assignments" element={<StudentContentList type="assignments" />} />
                        <Route path="/special" element={<StudentSpecial />} />
                        <Route path="/profile" element={<ProfilePage />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

// Sub-components
const Overview = () => {
    const [enrolledCount, setEnrolledCount] = useState(0);
    const [quizCount, setQuizCount] = useState(0);
    const [activeAssignments, setActiveAssignments] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const res = await api.get('/courses/enrolled');
                const courses = res.data.data || [];
                setEnrolledCount(courses.length);

                let totalQuizzes = 0;
                const assignments = [];
                const activities = [];

                await Promise.all(courses.map(async (course) => {
                    try {
                        const [quizRes, assignRes] = await Promise.all([
                            api.get(`/courses/${course._id}/quizzes`),
                            api.get(`/courses/${course._id}/assignments`)
                        ]);
                        totalQuizzes += (quizRes.data.data || []).length;

                        // Collect pending assignments
                        (assignRes.data.data || []).forEach(a => {
                            if (new Date(a.deadline) >= new Date()) {
                                assignments.push({
                                    title: a.title,
                                    courseName: course.courseName,
                                    deadline: a.deadline,
                                    courseId: course._id
                                });
                            }
                        });

                        // Collect announcements
                        (course.announcements || []).forEach(ann => {
                            activities.push({
                                title: ann.title,
                                content: ann.content,
                                courseName: course.courseName,
                                date: ann.createdAt
                            });
                        });
                    } catch (err) {
                        // skip
                    }
                }));

                setQuizCount(totalQuizzes);
                setActiveAssignments(assignments.filter(a => new Date(a.deadline) > new Date()).sort((a, b) => new Date(a.deadline) - new Date(b.deadline)).slice(0, 5));

                // Filter activity to last 24 hours
                const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                const recentActivities = activities.filter(a => new Date(a.date) >= twentyFourHoursAgo);

                setRecentActivity(recentActivities.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5));
            } catch (err) {
                console.error('Failed to fetch enrolled courses', err);
            }
        };
        fetchAll();
    }, []);

    return (
        <React.Fragment>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                <div className="lg:col-span-2 bg-primary rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Ready to expand?</h3>
                        <p className="text-slate-800/80 mb-6 text-sm max-w-xs">Browse the catalog to join a new lecture or material.</p>
                        <div className="flex gap-2">
                            <Link to="/student/courses" className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors inline-block text-center shadow-lg">View Course Catalog</Link>
                        </div>
                    </div>
                    <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
                    <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-40 transition-opacity">
                        <span className="material-symbols-rounded text-8xl text-slate-900">add_circle</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                        <span className="material-symbols-rounded">menu_book</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Enrolled Courses</p>
                    <h4 className="text-3xl font-bold mt-1">{enrolledCount}</h4>
                    <div className="mt-4 flex items-center text-xs text-green-500 font-semibold">
                        <span className="material-symbols-rounded text-xs mr-1">trending_up</span>
                        <span>Active Term</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400 mb-4">
                        <span className="material-symbols-rounded">timer</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Quizzes</p>
                    <h4 className="text-3xl font-bold mt-1">{quizCount}</h4>
                    <div className="mt-4 flex items-center text-xs text-orange-500 font-semibold">
                        <span>{quizCount > 0 ? `${quizCount} available` : 'No upcoming quizzes'}</span>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold">Recent Activity</h3>
                        </div>
                        {recentActivity.length === 0 ? (
                            <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                                <div className="p-12 flex flex-col items-center justify-center text-center">
                                    <span className="material-symbols-rounded text-5xl text-slate-300 dark:text-slate-700 mb-4">history</span>
                                    <h4 className="font-bold text-slate-700 dark:text-slate-300">No Recent Activity</h4>
                                    <p className="text-sm text-slate-500 max-w-sm mt-2">Activities like course enrollments, downloaded materials, and quiz submissions will appear here.</p>
                                </div>
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
                </div>

                <div className="space-y-8">
                    <div>
                        <h3 className="text-lg font-bold mb-4">Active Assignments</h3>
                        {activeAssignments.length === 0 ? (
                            <div className="space-y-3">
                                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center text-slate-400 text-center bg-white dark:bg-card-dark shadow-sm">
                                    <span className="material-symbols-rounded text-3xl mb-2">assignment_turned_in</span>
                                    <p className="font-bold text-sm">All caught up!</p>
                                    <p className="text-xs mt-1">You have no pending assignments right now.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {activeAssignments.map((a, idx) => (
                                    <div key={idx} className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:border-primary/30 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center shrink-0">
                                                <span className="material-symbols-rounded">assignment</span>
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">{a.title}</h4>
                                                <p className="text-xs text-slate-500">{a.courseName}</p>
                                                <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                                                    Due: {new Date(a.deadline).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </React.Fragment>
    );
};

const StudentCourses = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [joinId, setJoinId] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => { fetchCourses(); }, []);

    const fetchCourses = async () => {
        try {
            const res = await api.get('/courses/enrolled');
            setCourses(res.data.data);
        } catch (err) {
            console.error('Failed to fetch courses');
        }
    };

    const handleJoinCourse = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/courses/join', { courseId: joinId });
            setJoinId('');
            fetchCourses(); // Refresh list
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to join course. Check ID.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-6">
            <div className="bg-primary/10 border border-primary/20 rounded-3xl p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">My Enrolled Courses</h1>
                    <p className="text-slate-600 dark:text-slate-400">View your active curriculum or enter a Course ID to join a new class.</p>
                </div>

                <div className="w-full md:w-auto">
                    <form onSubmit={handleJoinCourse} className="flex gap-2">
                        <div className="relative flex-grow md:w-64">
                            <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">vpn_key</span>
                            <input
                                type="text"
                                value={joinId}
                                onChange={e => setJoinId(e.target.value)}
                                placeholder="Course ID"
                                required
                                disabled={loading}
                                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white shadow-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !joinId.trim()}
                            className="bg-primary hover:bg-teal-500 text-slate-900 px-6 py-3 rounded-xl font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center gap-2"
                        >
                            {loading ? <span className="material-symbols-rounded animate-spin text-sm">sync</span> : 'Join'}
                        </button>
                    </form>
                    {error && <p className="text-red-500 text-sm mt-2 ml-1 text-center md:text-left">{error}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.length === 0 ? (
                    <div className="col-span-full border-2 border-dashed border-slate-200 dark:border-border-dark rounded-3xl p-12 flex flex-col items-center justify-center text-slate-400 text-center min-h-[300px]">
                        <span className="material-symbols-rounded text-6xl mb-4 text-slate-300 dark:text-slate-600">sentiment_dissatisfied</span>
                        <p className="font-bold text-lg mb-2 text-slate-600 dark:text-slate-300">No Courses Yet</p>
                        <p className="max-w-md mx-auto">You haven't enrolled in any courses. Use the Course ID provided by your faculty to join a class.</p>
                    </div>
                ) : (
                    courses.map(c => (
                        <div key={c._id} className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:shadow-xl hover:border-primary/50 transition-all group flex flex-col h-full shadow-sm cursor-pointer">
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
                                <button
                                    onClick={() => navigate(`/student/courses/${c._id}`)}
                                    className="w-full py-3 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 group-hover:bg-primary group-hover:border-primary group-hover:text-slate-900 transition-all font-bold rounded-xl text-sm flex items-center justify-center gap-2"
                                >
                                    Enter Classroom
                                    <span className="material-symbols-rounded text-sm">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const StudentSpecial = () => {
    const [resources, setResources] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const fetchResources = async () => {
        try {
            const url = searchQuery ? `/special-section?search=${searchQuery}` : '/special-section';
            const res = await api.get(url);
            setResources(res.data.data);
        } catch (err) {
            console.error('Failed to fetch resources', err);
        }
    };

    useEffect(() => {
        fetchResources();
    }, [searchQuery]);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !title) return;

        setUploading(true);
        const data = new FormData();
        data.append('title', title);
        data.append('file', file);

        try {
            await api.post('/special-section', data);
            setIsUploading(false);
            setTitle('');
            setFile(null);
            fetchResources();
        } catch (err) {
            console.error('Failed to upload resource', err);
            alert(err.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="mt-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Department Materials</h2>
                    <p className="text-slate-500 dark:text-slate-400">Resources shared by peers in your current semester.</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-grow md:w-64">
                        <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search materials..."
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white"
                        />
                    </div>
                    <button
                        onClick={() => setIsUploading(true)}
                        className="bg-primary hover:bg-teal-500 text-slate-900 px-4 py-2 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2"
                    >
                        <span className="material-symbols-rounded font-bold text-sm">upload</span>
                        <span className="hidden sm:inline">Upload</span>
                    </button>
                </div>
            </div>

            {isUploading && (
                <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 mb-8 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold">Share a Resource</h3>
                        <button onClick={() => setIsUploading(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                            <span className="material-symbols-rounded">close</span>
                        </button>
                    </div>
                    <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Resource Title</label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Data Structures Midterm Notes"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">File Attachment</label>
                            <input
                                type="file"
                                required
                                onChange={(e) => setFile(e.target.files[0])}
                                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none transition-all dark:text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary file:text-slate-900 hover:file:bg-teal-500 cursor-pointer"
                            />
                        </div>
                        <div className="col-span-full flex justify-end">
                            <button
                                type="submit"
                                disabled={uploading}
                                className="bg-primary hover:bg-teal-500 text-slate-900 px-8 py-3 rounded-xl font-bold shadow-sm disabled:opacity-50"
                            >
                                {uploading ? 'Uploading...' : 'Share Resource'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {resources.length === 0 ? (
                <div className="bg-white dark:bg-card-dark border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center shadow-sm">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                        <span className="material-symbols-rounded text-4xl">inventory_2</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">No Materials Found</h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                        {searchQuery
                            ? `No materials matching "${searchQuery}" in your semester.`
                            : 'There are no shared materials for your current semester yet. Be the first to upload and help your peers!'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources.map(resource => (
                        <div key={resource._id} className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:border-primary/50 transition-colors flex flex-col h-full group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center font-bold">
                                    <span className="material-symbols-rounded">description</span>
                                </div>
                                <span className="text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                                    Sem {resource.semester}
                                </span>
                            </div>

                            <h3 className="font-bold text-lg mb-2 line-clamp-2">{resource.title}</h3>
                            <p className="text-xs text-slate-500 mb-6 flex-grow">
                                Shared by <span className="font-semibold text-slate-700 dark:text-slate-300">{resource.uploadedBy?.name || 'Anonymous'}</span> on {new Date(resource.createdAt).toLocaleDateString()}
                            </p>

                            <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                                <a
                                    href={`http://localhost:5000${resource.fileUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-2 py-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group-hover:bg-primary group-hover:text-slate-900 group-hover:border-primary"
                                >
                                    <span className="material-symbols-rounded text-[18px]">download</span> Download
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
