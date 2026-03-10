import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import AdminDepartments from './AdminDepartments';
import AdminEnrollments from './AdminEnrollments';
import AdminSettings from './AdminSettings';

const AdminDashboard = () => {
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
        { path: "/admin", icon: "dashboard", label: "Dashboard", exact: true },
        { path: "/admin/users", icon: "group", label: "User Management" },
        { path: "/admin/departments", icon: "domain", label: "Department Management" },
        { path: "/admin/enrollments", icon: "how_to_reg", label: "Enrollments" },
        { path: "/admin/settings", icon: "settings", label: "Settings" }
    ];

    return (
        <div className={`flex h-screen overflow-hidden ${isDark ? 'dark bg-background-dark text-slate-100' : 'bg-background-light text-slate-900'} transition-colors duration-200`}>
            {/* Mobile Sidebar Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar Navigation */}
            <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-white dark:bg-card-dark border-r border-slate-200 dark:border-slate-800 flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} shrink-0`}>
                <div className="p-6 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white">
                            <span className="material-symbols-rounded text-xl">admin_panel_settings</span>
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">EduSphere</h1>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-500 hover:text-slate-900 dark:hover:text-white pb-1">
                        <span className="material-symbols-rounded">close</span>
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
                    <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Main Menu</p>
                    {navLinks.map((link, idx) => {
                        const isActive = link.exact ? location.pathname === link.path : location.pathname.startsWith(link.path) && link.path !== "#";
                        return (
                            <Link
                                key={idx}
                                to={link.path}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <span className="material-symbols-rounded text-xl w-6 flex justify-center">{link.icon}</span>
                                <span>{link.label}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800 mt-auto">
                    <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl mb-4">
                        {user?.profilePhoto && user?.profilePhoto !== 'no-photo.jpg' ? (
                            <img alt="Admin Avatar" className="w-10 h-10 rounded-lg object-cover" src={user.profilePhoto.startsWith('http') ? user.profilePhoto : `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000'}${user.profilePhoto.startsWith('/uploads') ? user.profilePhoto : '/uploads/profiles/' + user.profilePhoto}`} />
                        ) : (
                            <img alt="Admin Avatar" className="w-10 h-10 rounded-lg object-cover" src={`https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=4ade80&color=fff&rounded=true`} />
                        )}
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold truncate">{user?.name || 'System Admin'}</p>
                            <p className="text-xs text-slate-500 truncate">Superuser</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-rounded text-[18px]">logout</span>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto relative w-full">
                <header className="flex items-center justify-between lg:justify-end px-8 py-4 sticky top-0 bg-white/80 dark:bg-card-dark/80 backdrop-blur-md z-30 border-b border-transparent">
                    <div className="lg:hidden flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-3 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                        >
                            <span className="material-symbols-rounded">menu</span>
                        </button>
                        <h2 className="font-bold text-lg hidden sm:block">Admin</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors">
                            <span className="material-symbols-rounded text-[20px]">notifications</span>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-card-dark"></span>
                        </button>
                        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1"></div>
                        <button
                            onClick={toggleTheme}
                            className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <span className="material-symbols-rounded text-[20px]">{isDark ? 'light_mode' : 'dark_mode'}</span>
                        </button>
                    </div>
                </header>

                <div className="px-4 sm:px-8 pb-12 mt-4">
                    <Routes>
                        <Route path="/" element={<AdminOverview />} />
                        <Route path="/users" element={<AdminUsers />} />
                        <Route path="/departments" element={<AdminDepartments />} />
                        <Route path="/enrollments" element={<AdminEnrollments />} />
                        <Route path="/settings" element={<AdminSettings />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

const AdminOverview = () => {
    const [metrics, setMetrics] = useState({ usersCount: 0, coursesCount: 0, adminCount: 1 });

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const res = await api.get('/admin/metrics');
                setMetrics(res.data.data);
            } catch (e) { console.error('Failed to load metrics', e); }
        };
        fetchMetrics();
    }, []);

    // Helper functions for mock data
    const generateActivityLog = () => [
        { name: 'David Chen', action: 'Enrolled in Course ID: CS101', time: '2 mins ago', icon: 'person_add', color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
        { name: 'Sarah Jenkins', action: 'Created new Course', time: '15 mins ago', icon: 'auto_stories', color: 'text-primary', bg: 'bg-primary/10' },
        { name: 'System Auto', action: 'Database Backup Completed', time: '1 hour ago', icon: 'cloud_sync', color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' }
    ];

    return (
        <React.Fragment>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Welcome back, here's what's happening across the platform today.</p>
                </div>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                            <span className="material-symbols-rounded">group</span>
                        </div>
                        <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full flex items-center gap-1"><span className="material-symbols-rounded text-[10px]">trending_up</span>Live</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Registered Users</p>
                    <h3 className="text-3xl font-bold mt-1">{metrics.usersCount}</h3>
                </div>

                <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-primary/50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                            <span className="material-symbols-rounded">library_books</span>
                        </div>
                        <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full flex items-center gap-1"><span className="material-symbols-rounded text-[10px]">trending_up</span>Live</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Courses</p>
                    <h3 className="text-3xl font-bold mt-1">{metrics.coursesCount}</h3>
                </div>

                <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center">
                            <span className="material-symbols-rounded">shield_person</span>
                        </div>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">System Admins</p>
                    <h3 className="text-3xl font-bold mt-1">{metrics.adminCount || '1'}</h3>
                </div>

                <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center items-center text-center">
                    <span className="material-symbols-rounded text-4xl text-emerald-500 mb-2">dns</span>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">System Status</p>
                    <h3 className="text-lg font-bold text-emerald-500 mt-1">All Systems Operational</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Role Distribution Chart */}
                <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="font-bold">User Distribution by Role</h4>
                    </div>

                    <div className="flex-1 min-h-[250px] relative">
                        {metrics.roleDistribution ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={metrics.roleDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {metrics.roleDistribution.map((entry, index) => {
                                            const colors = ['#0ea5e9', '#14b8a6', '#8b5cf6'];
                                            return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                                        })}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-400">Loading chart...</div>
                        )}
                    </div>
                </div>

                {/* Course Distribution Chart */}
                <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="font-bold">Courses by Subject</h4>
                    </div>

                    <div className="flex-1 min-h-[250px] relative">
                        {metrics.courseDistribution ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={metrics.courseDistribution} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                    <XAxis dataKey="subject" tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={false} />
                                    <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(20, 184, 166, 0.1)' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="count" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-400">Loading chart...</div>
                        )}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data.data);
        } catch (e) {
            console.error('Failed to load users', e);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (userId, currentStatus) => {
        try {
            await api.patch(`/admin/users/${userId}/status`, { isActive: !currentStatus });
            fetchUsers(); // Refresh list to get updated data
        } catch (e) {
            console.error('Failed to update status', e);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold">User Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Control access, assign roles, and monitor user accounts.</p>
                </div>

                <div className="relative w-full md:w-72">
                    <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input
                        className="w-full bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white shadow-sm"
                        placeholder="Search by name, email, or role..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/20">
                    <h4 className="font-bold flex items-center gap-2">
                        <span className="material-symbols-rounded text-primary">group</span>
                        System Users Directory
                    </h4>
                    <span className="bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {users.length} Total Records
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">User Identity</th>
                                <th className="px-6 py-4">Role / Authorization</th>
                                <th className="px-6 py-4">Account Status</th>
                                <th className="px-6 py-4 text-right">Administrative Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                            {loading && users.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                                        <span className="material-symbols-rounded animate-spin text-3xl mb-2">sync</span>
                                        <p>Loading user database...</p>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                                        <span className="material-symbols-rounded text-4xl mb-2 opacity-50">person_search</span>
                                        <p>No users found matching your search criteria.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(u => (
                                    <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 overflow-hidden">
                                                    {u.profilePhoto && u.profilePhoto !== 'no-photo.jpg' ? (
                                                        <img src={u.profilePhoto.startsWith('http') ? u.profilePhoto : `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000'}${u.profilePhoto.startsWith('/uploads') ? u.profilePhoto : '/uploads/profiles/' + u.profilePhoto}`} alt={u.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <img src={`https://ui-avatars.com/api/?name=${u.name}&background=random&color=fff`} alt={u.name} />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{u.name}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 opacity-80">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                                                ${u.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                                                    u.role === 'faculty' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}
                                            >
                                                {u.role === 'admin' && <span className="material-symbols-rounded text-[12px]">shield_person</span>}
                                                {u.role === 'faculty' && <span className="material-symbols-rounded text-[12px]">auto_stories</span>}
                                                {u.role === 'student' && <span className="material-symbols-rounded text-[12px]">school</span>}
                                                {u.role}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${u.isActive ? 'bg-emerald-500' : 'bg-red-500'} shadow-[0_0_8px_currentColor] opacity-80`}></div>
                                                <span className={`text-sm font-semibold ${u.isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                                                    {u.isActive ? 'Active' : 'Suspended'}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => toggleStatus(u._id, u.isActive)}
                                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ml-auto
                                                    ${u.isActive
                                                        ? 'bg-white dark:bg-transparent border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30'
                                                        : 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
                                                    }`}
                                            >
                                                <span className="material-symbols-rounded text-[14px]">
                                                    {u.isActive ? 'block' : 'check_circle'}
                                                </span>
                                                {u.isActive ? 'Suspend User' : 'Restore Access'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/20 text-center text-xs text-slate-400">
                    End of Result Set
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
