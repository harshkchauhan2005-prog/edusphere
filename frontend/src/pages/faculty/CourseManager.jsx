import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const CourseManager = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourse();
    }, [courseId]);

    const fetchCourse = async () => {
        try {
            const res = await api.get(`/courses/${courseId}`);
            setCourse(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading course details...</div>;
    if (!course) return <div className="p-8 text-center text-red-500">Course not found.</div>;

    return (
        <div className="max-w-7xl mx-auto">
            <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-medium">
                <span className="material-symbols-rounded text-sm">arrow_back</span>
                Back to Courses
            </button>

            <div className="bg-white dark:bg-card-dark rounded-3xl border border-slate-200 dark:border-slate-800 p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-primary/10 text-primary text-xs uppercase font-bold px-3 py-1 rounded-lg">
                            Semester {course.semester}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 font-mono text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                            ID: {course.courseId}
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{course.courseName}</h1>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl">Subject: {course.subject?.name || 'N/A'}</p>
                </div>
                <div className="flex gap-4">
                    <div className="text-center px-6 border-r border-slate-200 dark:border-slate-800">
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">{course.enrolledStudents.length}</p>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Students</p>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 mb-8 pb-px">
                {['overview', 'materials', 'quizzes', 'assignments', 'analytics'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 font-semibold text-sm capitalize transition-all border-b-2 ${activeTab === tab
                            ? 'border-primary text-primary'
                            : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Contents */}
            <div className="min-h-[400px]">
                {activeTab === 'overview' && (
                    <AnnouncementPanel courseId={courseId} announcements={course.announcements || []} onRefresh={fetchCourse} />
                )}

                {activeTab === 'materials' && (
                    <MaterialManager courseId={courseId} />
                )}

                {activeTab === 'quizzes' && (
                    <QuizManager courseId={courseId} />
                )}

                {activeTab === 'assignments' && (
                    <AssignmentManager courseId={courseId} />
                )}

                {activeTab === 'analytics' && (
                    <CourseAnalytics courseId={courseId} />
                )}
            </div>
        </div>
    );
};

// --- NEW COMPONENT: AnnouncementPanel ---
const AnnouncementPanel = ({ courseId, announcements, onRefresh }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [posting, setPosting] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handlePost = async (e) => {
        e.preventDefault();
        if (!title || !content) return;
        setPosting(true);
        try {
            await api.post(`/courses/${courseId}/announcements`, { title, content });
            setTitle('');
            setContent('');
            setIsFormOpen(false);
            onRefresh();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to post announcement');
        } finally {
            setPosting(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <span className="material-symbols-rounded text-primary">campaign</span>
                    Announcements
                </h3>
                <button
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    className="bg-primary hover:bg-teal-500 text-slate-900 px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 text-sm"
                >
                    <span className="material-symbols-rounded text-sm">{isFormOpen ? 'close' : 'add'}</span>
                    {isFormOpen ? 'Cancel' : 'New Announcement'}
                </button>
            </div>

            {isFormOpen && (
                <form onSubmit={handlePost} className="bg-white dark:bg-card-dark p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Title</label>
                            <input
                                type="text" required value={title} onChange={e => setTitle(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                                placeholder="e.g. Class Cancelled on Friday"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Content</label>
                            <textarea
                                required rows="3" value={content} onChange={e => setContent(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white resize-none"
                                placeholder="Write your announcement here..."
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" disabled={posting} className="bg-primary hover:bg-teal-500 text-slate-900 px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50">
                            {posting ? 'Posting...' : 'Post Announcement'}
                        </button>
                    </div>
                </form>
            )}

            {announcements.length === 0 ? (
                <div className="bg-white dark:bg-card-dark border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-500">
                    <span className="material-symbols-rounded text-5xl mb-4 text-slate-300 dark:text-slate-600">campaign</span>
                    <p className="font-bold text-slate-600 dark:text-slate-300 mb-1">No announcements yet</p>
                    <p className="text-sm">Post an announcement to keep your students informed.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {announcements.map((a, idx) => (
                        <div key={idx} className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:border-primary/30 transition-colors">
                            <div className="flex items-start justify-between mb-3">
                                <h4 className="font-bold text-lg text-slate-900 dark:text-white">{a.title}</h4>
                                <span className="text-xs text-slate-400 shrink-0 ml-4">{new Date(a.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 text-sm whitespace-pre-wrap">{a.content}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- NEW COMPONENT: CourseAnalytics ---
const CourseAnalytics = ({ courseId }) => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get(`/courses/${courseId}/analytics`);
                setAnalytics(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [courseId]);

    if (loading) return <div className="p-8 text-center text-slate-500"><span className="material-symbols-rounded animate-spin text-3xl mb-2">sync</span><p>Processing metrics...</p></div>;
    if (!analytics) return <div className="p-8 text-center text-slate-500">Failed to load analytics.</div>;

    const { totalStudents, assignmentMetrics, quizMetrics } = analytics;

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-rounded text-primary">insights</span>
                Class Performance Metrics
            </h3>

            {/* Quiz Performance Chart */}
            <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h4 className="font-bold mb-6">Quiz Average Scores vs Participation (%)</h4>
                <div className="h-[300px]">
                    {quizMetrics && quizMetrics.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={quizMetrics} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(100, 116, 139, 0.2)" />
                                <XAxis dataKey="title" tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={false} />
                                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={false} domain={[0, 100]} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(20, 184, 166, 0.1)' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', background: 'var(--tw-bg-opacity, white)' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="averageScore" name="Average Score" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={50} />
                                <Bar dataKey="participationRate" name="Participation %" fill="#14b8a6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                            No quiz data available to build chart.
                        </div>
                    )}
                </div>
            </div>

            {/* Assignment Performance Chart */}
            <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h4 className="font-bold mb-6">Assignment Submissions & Grades (%)</h4>
                <div className="h-[300px]">
                    {assignmentMetrics && assignmentMetrics.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={assignmentMetrics} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(100, 116, 139, 0.2)" />
                                <XAxis dataKey="title" tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={false} />
                                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={false} domain={[0, 100]} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="averageGrade" name="Avg Grade" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                                <Bar dataKey="submissionRate" name="Submission %" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                            No assignment data available to build chart.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const MaterialManager = ({ courseId }) => {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);

    useEffect(() => {
        fetchMaterials();
    }, [courseId]);

    const fetchMaterials = async () => {
        try {
            const res = await api.get(`/courses/${courseId}/materials`);
            setMaterials(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !title) return alert('Please provide title and file');
        setUploading(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('file', file);
        try {
            await api.post(`/courses/${courseId}/materials`, formData);
            setTitle('');
            setFile(null);
            fetchMaterials();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500"><span className="material-symbols-rounded animate-spin text-3xl mb-2">sync</span><p>Loading materials...</p></div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white dark:bg-card-dark p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="material-symbols-rounded text-primary">cloud_upload</span>
                    Upload New Material
                </h3>
                <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Material Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white" placeholder="e.g. Chapter 1 Notes" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Select File (PDF, DOCX)</label>
                        <input type="file" onChange={e => setFile(e.target.files[0])} required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-primary/10 file:text-primary file:font-bold file:cursor-pointer transition-all dark:text-white" />
                    </div>
                    <div className="md:col-span-2 flex justify-end mt-2">
                        <button type="submit" disabled={uploading} className="bg-primary hover:bg-teal-500 text-slate-900 px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50">
                            {uploading ? 'Uploading...' : 'Upload Material'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white dark:bg-card-dark p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-xl font-bold mb-6">Uploaded Materials ({materials.length})</h3>
                {materials.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                        <span className="material-symbols-rounded text-6xl mb-4 text-slate-300 dark:text-slate-600">folder_open</span>
                        <p className="font-bold text-slate-600 dark:text-slate-300 mb-1">No materials yet</p>
                        <p className="text-sm">Upload a document to share with your students.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {materials.map(mat => (
                            <div key={mat._id} className="flex items-center gap-4 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-primary/50 transition-colors bg-slate-50 dark:bg-slate-800/20">
                                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-rounded">description</span>
                                </div>
                                <div className="flex-grow min-w-0">
                                    <h4 className="font-bold text-slate-900 dark:text-white truncate">{mat.title}</h4>
                                    <p className="text-xs text-slate-500">{new Date(mat.createdAt).toLocaleDateString()}</p>
                                </div>
                                <a href={`${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000'}${mat.fileUrl}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-primary/10 transition-colors shrink-0">
                                    <span className="material-symbols-rounded">download</span>
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Subcomponent for managing quizzes within the course view
const QuizManager = ({ courseId }) => {
    const [quizzes, setQuizzes] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [activeQuizForGrading, setActiveQuizForGrading] = useState(null);

    const fetchQuizzes = async () => {
        try {
            const res = await api.get(`/courses/${courseId}/quizzes`);
            setQuizzes(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchQuizzes();
    }, [courseId]);

    if (isCreating) return <CreateQuizForm courseId={courseId} onCancel={() => setIsCreating(false)} onSuccess={() => { setIsCreating(false); fetchQuizzes(); }} />;
    if (activeQuizForGrading) return <GradeQuizSubmissions courseId={courseId} quiz={activeQuizForGrading} onBack={() => setActiveQuizForGrading(null)} />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Manage Quizzes</h3>
                <button
                    onClick={() => setIsCreating(true)}
                    className="bg-primary text-slate-900 font-bold px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-teal-500 transition-colors"
                >
                    <span className="material-symbols-rounded text-sm">add</span> Create Quiz
                </button>
            </div>

            {quizzes.length === 0 ? (
                <div className="bg-white dark:bg-card-dark border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-500">
                    <p>No quizzes created yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {quizzes.map(q => (
                        <div key={q._id} className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:border-primary/50 transition-colors">
                            <h4 className="font-bold text-lg mb-2">{q.title}</h4>
                            <p className="text-sm text-slate-500 mb-4">{q.questions.length} Questions</p>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setActiveQuizForGrading(q)}
                                    className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-2 rounded-lg font-medium text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Grade Submissions ({q.results.length})
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Basic UI to create mixed MCQ and Descriptive Quizzes
const CreateQuizForm = ({ courseId, onCancel, onSuccess }) => {
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState([
        { questionText: '', questionType: 'mcq', options: ['', '', '', ''], correctOptionIndex: 0 }
    ]);
    const [loading, setLoading] = useState(false);

    const handleAddQuestion = (type) => {
        if (type === 'mcq') {
            setQuestions([...questions, { questionText: '', questionType: 'mcq', options: ['', '', '', ''], correctOptionIndex: 0 }]);
        } else {
            setQuestions([...questions, { questionText: '', questionType: 'descriptive' }]);
        }
    };

    const handleUpdateQuestion = (index, field, value) => {
        const newQs = [...questions];
        newQs[index][field] = value;
        setQuestions(newQs);
    };

    const handleUpdateOption = (qIndex, oIndex, value) => {
        const newQs = [...questions];
        newQs[qIndex].options[oIndex] = value;
        setQuestions(newQs);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post(`/courses/${courseId}/quizzes`, { title, questions });
            onSuccess();
        } catch (err) {
            console.error(err);
            alert('Failed to create quiz');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-card-dark p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <span className="material-symbols-rounded text-primary">assignment_add</span>
                    Create New Quiz
                </h3>
            </div>

            <div className="mb-8">
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Quiz Title</label>
                <input
                    type="text" required value={title} onChange={e => setTitle(e.target.value)}
                    className="w-full lg:w-1/2 px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                    placeholder="e.g. Midterm Assessment"
                />
            </div>

            <div className="space-y-8 mb-8">
                {questions.map((q, qIndex) => (
                    <div key={qIndex} className="p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl relative">
                        <div className="absolute top-4 right-4 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">
                            {q.questionType}
                        </div>
                        <h4 className="font-bold mb-4 text-slate-700 dark:text-slate-300">Question {qIndex + 1}</h4>

                        <input
                            type="text" required value={q.questionText} onChange={e => handleUpdateQuestion(qIndex, 'questionText', e.target.value)}
                            className="w-full px-4 py-3 mb-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                            placeholder="Enter the question text..."
                        />

                        {q.questionType === 'mcq' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {q.options.map((opt, oIndex) => (
                                    <div key={oIndex} className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name={`correct-${qIndex}`}
                                            checked={q.correctOptionIndex === oIndex}
                                            onChange={() => handleUpdateQuestion(qIndex, 'correctOptionIndex', oIndex)}
                                            className="w-5 h-5 text-primary focus:ring-primary"
                                        />
                                        <input
                                            type="text" required value={opt} onChange={e => handleUpdateOption(qIndex, oIndex, e.target.value)}
                                            className="flex-1 px-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-primary outline-none dark:text-white"
                                            placeholder={`Option ${oIndex + 1}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                        {q.questionType === 'descriptive' && (
                            <p className="text-sm text-slate-500 italic mt-2">Students will be provided a text area to write their answer. Manual grading required.</p>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
                <button type="button" onClick={() => handleAddQuestion('mcq')} className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold px-4 py-2 rounded-xl text-sm transition-colors flex items-center gap-2">
                    <span className="material-symbols-rounded text-sm">add_circle</span> Add MCQ
                </button>
                <button type="button" onClick={() => handleAddQuestion('descriptive')} className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold px-4 py-2 rounded-xl text-sm transition-colors flex items-center gap-2">
                    <span className="material-symbols-rounded text-sm">notes</span> Add Descriptive
                </button>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={onCancel} className="px-6 py-3 font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={loading} className="bg-primary text-slate-900 font-bold px-8 py-3 rounded-xl hover:bg-teal-500 transition-colors disabled:opacity-50 flex items-center gap-2">
                    {loading ? 'Saving...' : 'Publish Quiz'}
                </button>
            </div>
        </form>
    );
};

const GradeQuizSubmissions = ({ courseId, quiz, onBack }) => {
    const [activeResult, setActiveResult] = useState(null);
    const [grades, setGrades] = useState({}); // { questionId: marksAwarded }
    const [submitting, setSubmitting] = useState(false);

    const handleSelectResult = (result) => {
        setActiveResult(result);
        const initialGrades = {};
        result.answers.forEach(a => {
            initialGrades[a.questionId] = a.marksAwarded || 0;
        });
        setGrades(initialGrades);
    };

    const handleGradeChange = (questionId, marks) => {
        setGrades(prev => ({ ...prev, [questionId]: Number(marks) }));
    };

    const submitGrades = async () => {
        setSubmitting(true);
        try {
            const gradesPayload = Object.keys(grades).map(qId => ({ questionId: qId, marksAwarded: grades[qId] }));
            await api.put(`/courses/${courseId}/quizzes/${quiz._id}/results/${activeResult._id}/grade`, { grades: gradesPayload });

            alert('Grades saved successfully!');
            onBack(); // Go back to quiz list to refresh
        } catch (err) {
            console.error(err);
            alert('Failed to save grades');
        } finally {
            setSubmitting(false);
        }
    };

    if (activeResult) {
        return (
            <div className="bg-white dark:bg-card-dark p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                    <div>
                        <h2 className="text-2xl font-bold">Grading Submission</h2>
                        <p className="text-slate-500">Student ID: {activeResult.studentId}</p>
                    </div>
                    <button onClick={() => setActiveResult(null)} className="font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Back</button>
                </div>

                <div className="space-y-8 mb-8">
                    {quiz.questions.map((q, idx) => {
                        const answer = activeResult.answers.find(a => a.questionId.toString() === q._id.toString());
                        const isDescriptive = q.questionType === 'descriptive';

                        return (
                            <div key={q._id} className="p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl">
                                <h4 className="font-bold mb-4">{idx + 1}. {q.questionText}</h4>
                                <div className="mb-4">
                                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Student's Answer:</p>
                                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                                        {isDescriptive ? (
                                            <p className="whitespace-pre-wrap">{answer?.descriptiveText || 'No answer provided'}</p>
                                        ) : (
                                            <p>{answer?.selectedOptionIndex !== null ? q.options[answer.selectedOptionIndex] : 'No answer selected'}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                                    <label className="font-bold">Marks Awarded:</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={grades[q._id] || 0}
                                        onChange={(e) => handleGradeChange(q._id, e.target.value)}
                                        className="w-24 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-center dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-end gap-4">
                    <button onClick={() => setActiveResult(null)} className="px-6 py-3 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                    <button onClick={submitGrades} disabled={submitting} className="bg-primary hover:bg-teal-500 text-slate-900 font-bold px-8 py-3 rounded-xl transition-colors shadow-sm">
                        {submitting ? 'Saving...' : 'Save Grades'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-card-dark p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <span className="material-symbols-rounded text-primary">grading</span>
                    Submissions for "{quiz.title}"
                </h3>
                <button onClick={onBack} className="text-slate-500 hover:text-slate-700 font-semibold">Back to Quizzes</button>
            </div>

            {quiz.results.length === 0 ? (
                <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                    <p>No students have submitted this quiz yet.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                                <th className="pb-4 font-semibold">Student ID</th>
                                <th className="pb-4 font-semibold">Score</th>
                                <th className="pb-4 font-semibold">Status</th>
                                <th className="pb-4 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {quiz.results.map(res => (
                                <tr key={res._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="py-4 font-mono text-sm">{res.studentId}</td>
                                    <td className="py-4 font-bold">{res.score}</td>
                                    <td className="py-4">
                                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${res.isGraded ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                            {res.isGraded ? 'Graded' : 'Needs Review'}
                                        </span>
                                    </td>
                                    <td className="py-4 text-right">
                                        <button
                                            onClick={() => handleSelectResult(res)}
                                            className="text-primary font-bold hover:underline text-sm"
                                        >
                                            Review & Grade
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// export moved to end of file

// --- ASSIGNMENT COMPONENTS ---

const AssignmentManager = ({ courseId }) => {
    const [assignments, setAssignments] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [activeAssignmentForGrading, setActiveAssignmentForGrading] = useState(null);

    const fetchAssignments = async () => {
        try {
            const res = await api.get(`/courses/${courseId}/assignments`);
            setAssignments(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, [courseId]);

    if (isCreating) return <CreateAssignmentForm courseId={courseId} onCancel={() => setIsCreating(false)} onSuccess={() => { setIsCreating(false); fetchAssignments(); }} />;
    if (activeAssignmentForGrading) return <GradeAssignmentSubmissions courseId={courseId} assignment={activeAssignmentForGrading} onBack={() => setActiveAssignmentForGrading(null)} />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Manage Assignments</h3>
                <button
                    onClick={() => setIsCreating(true)}
                    className="bg-primary text-slate-900 font-bold px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-teal-500 transition-colors"
                >
                    <span className="material-symbols-rounded text-sm">add</span> Create Assignment
                </button>
            </div>

            {assignments.length === 0 ? (
                <div className="bg-white dark:bg-card-dark border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-500">
                    <p>No assignments created yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {assignments.map(a => (
                        <div key={a._id} className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:border-primary/50 transition-colors flex flex-col">
                            <h4 className="font-bold text-lg mb-2">{a.title}</h4>
                            <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-grow">{a.description}</p>
                            <p className="text-xs text-slate-400 mb-4"><span className="font-bold">Deadline:</span> {new Date(a.deadline).toLocaleDateString()}</p>
                            <div className="flex gap-2 mt-auto">
                                <button
                                    onClick={() => setActiveAssignmentForGrading(a)}
                                    className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-2 rounded-lg font-medium text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Grade Submissions ({a.submissions?.length || 0})
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const CreateAssignmentForm = ({ courseId, onCancel, onSuccess }) => {
    const [formData, setFormData] = useState({ title: '', description: '', deadline: '' });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('deadline', formData.deadline);
        if (file) data.append('file', file);

        try {
            await api.post(`/courses/${courseId}/assignments`, data);
            onSuccess();
        } catch (err) {
            console.error(err);
            alert('Failed to create assignment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-card-dark p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in zoom-in-95">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-rounded text-primary">assignment_add</span>
                Create New Assignment
            </h3>

            <div className="space-y-4 mb-8">
                <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Assignment Title</label>
                    <input
                        type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                        placeholder="e.g. Final Project Submission"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Description / Instructions</label>
                    <textarea
                        required rows="4" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white resize-none"
                        placeholder="Provide instructions for the assignment..."
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Deadline</label>
                        <input
                            type="datetime-local" required value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Attachment (Optional)</label>
                        <input
                            type="file" onChange={e => setFile(e.target.files[0])}
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none transition-all dark:text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary file:text-slate-900 hover:file:bg-teal-500"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={onCancel} className="px-6 py-3 font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={loading} className="bg-primary text-slate-900 font-bold px-8 py-3 rounded-xl hover:bg-teal-500 transition-colors disabled:opacity-50 flex items-center gap-2">
                    {loading ? 'Creating...' : 'Create Assignment'}
                </button>
            </div>
        </form>
    );
};

const GradeAssignmentSubmissions = ({ courseId, assignment, onBack }) => {
    const [activeResult, setActiveResult] = useState(null);
    const [grade, setGrade] = useState('');
    const [feedback, setFeedback] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSelectResult = (result) => {
        setActiveResult(result);
        setGrade(result.grade || '');
        setFeedback(result.feedback || '');
    };

    const submitGrade = async () => {
        setSubmitting(true);
        try {
            await api.put(`/courses/${courseId}/assignments/${assignment._id}/submissions/${activeResult.studentId}/grade`, {
                grade: Number(grade),
                feedback
            });
            alert('Grade saved successfully!');
            onBack();
        } catch (err) {
            console.error(err);
            alert('Failed to save grade');
        } finally {
            setSubmitting(false);
        }
    };

    if (activeResult) {
        return (
            <div className="bg-white dark:bg-card-dark p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                    <div>
                        <h2 className="text-2xl font-bold">Grading Assignment</h2>
                        <p className="text-slate-500">Student ID: {activeResult.studentId}</p>
                    </div>
                    <button onClick={() => setActiveResult(null)} className="font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Back</button>
                </div>

                <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl">
                    <h4 className="font-bold mb-4">Student Submission</h4>
                    <a href={`http://localhost:5000${activeResult.submissionFile}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                        <span className="material-symbols-rounded">download</span> Download Attachment
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Marks / Grade</label>
                        <input
                            type="number"
                            min="0"
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            placeholder="e.g. 95"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Feedback Comments</label>
                        <textarea
                            rows="4"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Provide feedback on the submission..."
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white resize-none"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button onClick={() => setActiveResult(null)} className="px-6 py-3 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                    <button onClick={submitGrade} disabled={submitting} className="bg-primary hover:bg-teal-500 text-slate-900 font-bold px-8 py-3 rounded-xl transition-colors shadow-sm">
                        {submitting ? 'Saving...' : 'Save Grade'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-card-dark p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <span className="material-symbols-rounded text-primary">grading</span>
                    Submissions for "{assignment.title}"
                </h3>
                <button onClick={onBack} className="text-slate-500 hover:text-slate-700 font-semibold">Back to Assignments</button>
            </div>

            {(!assignment.submissions || assignment.submissions.length === 0) ? (
                <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                    <p>No students have submitted this assignment yet.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                                <th className="pb-4 font-semibold">Student ID</th>
                                <th className="pb-4 font-semibold">Submitted On</th>
                                <th className="pb-4 font-semibold">Status</th>
                                <th className="pb-4 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {assignment.submissions.map(res => (
                                <tr key={res.studentId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="py-4 font-mono text-sm">{res.studentId}</td>
                                    <td className="py-4 text-sm">{new Date(res.submittedAt).toLocaleDateString()}</td>
                                    <td className="py-4">
                                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${res.grade !== undefined ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                            {res.grade !== undefined ? 'Graded' : 'Needs Review'}
                                        </span>
                                    </td>
                                    <td className="py-4 text-right">
                                        <button
                                            onClick={() => handleSelectResult(res)}
                                            className="text-primary font-bold hover:underline text-sm"
                                        >
                                            Review & Grade
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CourseManager;
