import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminDepartments = () => {
    const [departments, setDepartments] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('departments');

    // Form states
    const [showDeptForm, setShowDeptForm] = useState(false);
    const [showSubjForm, setShowSubjForm] = useState(false);
    const [deptForm, setDeptForm] = useState({ name: '', code: '' });
    const [subjForm, setSubjForm] = useState({ name: '', code: '', departmentText: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [deptRes, subjRes] = await Promise.all([
                api.get('/admin/departments'),
                api.get('/admin/subjects')
            ]);
            setDepartments(deptRes.data.data || []);
            setSubjects(subjRes.data.data || []);
        } catch (err) {
            console.error('Error fetching depts/subjects', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateDept = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/admin/departments', deptForm);
            setDeptForm({ name: '', code: '' });
            setShowDeptForm(false);
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create department');
        }
    };

    const handleCreateSubj = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // Find department ID if provided name exists, otherwise the backend handles it or we send the text.
            // Based on backend implementation, usually it accepts name or code. Let's send the text as 'department' 
            // string. We'll adjust based on typical structure.
            const payload = {
                name: subjForm.name,
                code: subjForm.code,
                departmentId: subjForm.departmentText
            };

            // To be safe, look up the ID if they typed a name
            const foundDept = departments.find(d =>
                (d.name && d.name.toLowerCase() === subjForm.departmentText.toLowerCase()) ||
                (d.code && d.code.toLowerCase() === subjForm.departmentText.toLowerCase())
            );
            if (foundDept) {
                payload.departmentId = foundDept._id;
            }

            await api.post('/admin/subjects', payload);
            setSubjForm({ name: '', code: '', departmentText: '' });
            setShowSubjForm(false);
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create subject');
        }
    };

    const handleDeleteDept = async (id) => {
        if (!window.confirm('Are you sure you want to delete this department?')) return;
        try {
            await api.delete(`/admin/departments/${id}`);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete department');
        }
    };

    const handleDeleteSubj = async (id) => {
        if (!window.confirm('Are you sure you want to delete this subject?')) return;
        try {
            await api.delete(`/admin/subjects/${id}`);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete subject');
        }
    };

    return (
        <div className="admin-departments-container">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Departments & Subjects</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Manage academic structure across the platform.</p>
                </div>
                <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('departments')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'departments' ? 'bg-white dark:bg-card-dark text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        Departments
                    </button>
                    <button
                        onClick={() => setActiveTab('subjects')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'subjects' ? 'bg-white dark:bg-card-dark text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        Subjects
                    </button>
                </div>
            </div>

            {/* DEPARTMENTS TAB */}
            {activeTab === 'departments' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold">Registered Departments</h2>
                        <button
                            onClick={() => setShowDeptForm(!showDeptForm)}
                            className="bg-primary hover:bg-teal-500 text-slate-900 px-4 py-2 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2 text-sm"
                        >
                            <span className="material-symbols-rounded text-[18px]">{showDeptForm ? 'close' : 'add'}</span>
                            {showDeptForm ? 'Cancel' : 'New Department'}
                        </button>
                    </div>

                    {showDeptForm && (
                        <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 animate-in fade-in slide-in-from-top-4">
                            <h3 className="font-bold mb-4">Create Department</h3>
                            {error && <div className="mb-4 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">{error}</div>}
                            <form onSubmit={handleCreateDept} className="flex flex-col md:flex-row gap-4 items-end">
                                <div className="flex-1 w-full">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Department Name</label>
                                    <input
                                        type="text" required value={deptForm.name} onChange={e => setDeptForm({ ...deptForm, name: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm dark:text-white"
                                        placeholder="e.g. Computer Science"
                                    />
                                </div>
                                <div className="flex-1 w-full">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Department Code</label>
                                    <input
                                        type="text" required value={deptForm.code} onChange={e => setDeptForm({ ...deptForm, code: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm dark:text-white"
                                        placeholder="e.g. CS"
                                    />
                                </div>
                                <button type="submit" className="w-full md:w-auto px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:bg-slate-800 transition-colors">
                                    Save
                                </button>
                            </form>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-10 text-slate-500"><span className="material-symbols-rounded animate-spin">sync</span></div>
                    ) : departments.length === 0 ? (
                        <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-500">
                            No departments found. Create the first one!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {departments.map(dept => (
                                <div key={dept._id} className="relative bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:border-primary/50 transition-colors">
                                    <button
                                        onClick={() => handleDeleteDept(dept._id)}
                                        className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                                        title="Remove Department"
                                    >
                                        <span className="material-symbols-rounded text-xl">delete</span>
                                    </button>
                                    <div className="flex items-start justify-between mb-4 pr-8">
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center">
                                            <span className="material-symbols-rounded text-xl">account_balance</span>
                                        </div>
                                        <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg text-slate-500">{dept.code}</span>
                                    </div>
                                    <h3 className="font-bold text-lg mb-1">{dept.name}</h3>
                                    <p className="text-sm text-slate-500">{subjects.filter(s => s.departmentId?._id === dept._id || s.departmentId === dept._id).length} Subjects</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* SUBJECTS TAB */}
            {activeTab === 'subjects' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold">Registered Subjects</h2>
                        <button
                            onClick={() => setShowSubjForm(!showSubjForm)}
                            className="bg-primary hover:bg-teal-500 text-slate-900 px-4 py-2 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2 text-sm"
                        >
                            <span className="material-symbols-rounded text-[18px]">{showSubjForm ? 'close' : 'add'}</span>
                            {showSubjForm ? 'Cancel' : 'New Subject'}
                        </button>
                    </div>

                    {showSubjForm && (
                        <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 animate-in fade-in slide-in-from-top-4">
                            <h3 className="font-bold mb-4">Create Subject</h3>
                            {error && <div className="mb-4 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">{error}</div>}
                            <form onSubmit={handleCreateSubj} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Subject Name</label>
                                    <input
                                        type="text" required value={subjForm.name} onChange={e => setSubjForm({ ...subjForm, name: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm dark:text-white"
                                        placeholder="e.g. Data Structures"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Subject Code</label>
                                    <input
                                        type="text" required value={subjForm.code} onChange={e => setSubjForm({ ...subjForm, code: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm dark:text-white"
                                        placeholder="e.g. CS201"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Department</label>
                                    <select
                                        required value={subjForm.departmentText} onChange={e => setSubjForm({ ...subjForm, departmentText: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm dark:text-white appearance-none"
                                    >
                                        <option value="" disabled>Select Department</option>
                                        {departments.map(d => (
                                            <option key={d._id} value={d._id}>{d.name} ({d.code})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md:col-span-3 flex justify-end mt-2">
                                    <button type="submit" className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:bg-slate-800 transition-colors">
                                        Save Subject
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-10 text-slate-500"><span className="material-symbols-rounded animate-spin">sync</span></div>
                    ) : subjects.length === 0 ? (
                        <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-500">
                            No subjects found. Add them here!
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-800/30">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Code</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Subject Name</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Department</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                        {subjects.map(subj => {
                                            const deptObj = typeof subj.departmentId === 'object' ? subj.departmentId : departments.find(d => d._id === subj.departmentId);
                                            return (
                                                <tr key={subj._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20">
                                                    <td className="px-6 py-4">
                                                        <span className="font-mono text-sm font-bold text-primary bg-primary/10 px-2 py-1 rounded">{subj.code}</span>
                                                    </td>
                                                    <td className="px-6 py-4 font-bold">{subj.name}</td>
                                                    <td className="px-6 py-4 text-sm text-slate-500">{deptObj ? deptObj.name : 'Unknown'}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => handleDeleteSubj(subj._id)}
                                                            className="text-slate-400 hover:text-red-500 transition-colors"
                                                            title="Remove Subject"
                                                        >
                                                            <span className="material-symbols-rounded text-xl">delete</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminDepartments;
