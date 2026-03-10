import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const StudentCourseManager = () => {
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

    if (loading) return <div className="p-8 text-center text-slate-500">Loading course...</div>;
    if (!course) return <div className="p-8 text-center text-red-500">Course not found.</div>;

    return (
        <div className="max-w-7xl mx-auto">
            <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-medium">
                <span className="material-symbols-rounded text-sm">arrow_back</span>
                Back to Courses
            </button>

            <div className="bg-white dark:bg-card-dark rounded-3xl border border-slate-200 dark:border-border-dark p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-primary/10 text-primary text-xs uppercase font-bold px-3 py-1 rounded-lg">
                            Semester {course.semester}
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{course.courseName}</h1>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl">Subject: {course.subject?.name || 'N/A'}</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-border-dark mb-8 pb-px">
                {['overview', 'materials', 'quizzes', 'assignments'].map(tab => (
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
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <span className="material-symbols-rounded text-primary">campaign</span>
                            Course Announcements
                        </h3>
                        {(course.announcements && course.announcements.length > 0) ? (
                            <div className="space-y-4">
                                {course.announcements.map((a, idx) => (
                                    <div key={idx} className="bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark rounded-2xl p-6 shadow-sm">
                                        <div className="flex items-start justify-between mb-3">
                                            <h4 className="font-bold text-lg text-slate-900 dark:text-white">{a.title}</h4>
                                            <span className="text-xs text-slate-400 shrink-0 ml-4">{new Date(a.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm whitespace-pre-wrap">{a.content}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-card-dark border-2 border-dashed border-slate-200 dark:border-border-dark rounded-3xl p-12 text-center text-slate-500">
                                <span className="material-symbols-rounded text-5xl mb-4 text-slate-300 dark:text-slate-600">campaign</span>
                                <p className="font-bold text-slate-600 dark:text-slate-300 mb-1">No announcements yet</p>
                                <p className="text-sm">Your instructor hasn't posted any announcements for this course.</p>
                            </div>
                        )}
                    </div>
                )}
                {activeTab === 'materials' && (
                    <StudentMaterialList courseId={courseId} />
                )}
                {activeTab === 'quizzes' && (
                    <StudentQuizList courseId={courseId} />
                )}
                {activeTab === 'assignments' && (
                    <StudentAssignmentList courseId={courseId} />
                )}
            </div>
        </div>
    );
};

const StudentMaterialList = ({ courseId }) => {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
        fetchMaterials();
    }, [courseId]);

    if (loading) return <div className="p-8 text-center text-slate-500"><span className="material-symbols-rounded animate-spin text-3xl mb-2">sync</span><p>Loading materials...</p></div>;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-rounded text-primary">description</span>
                Course Materials
            </h3>
            {materials.length === 0 ? (
                <div className="bg-white dark:bg-card-dark border-2 border-dashed border-slate-200 dark:border-border-dark rounded-3xl p-12 text-center text-slate-500">
                    <span className="material-symbols-rounded text-5xl mb-4 text-slate-300 dark:text-slate-600">folder_open</span>
                    <p className="font-bold text-slate-600 dark:text-slate-300 mb-1">No materials yet</p>
                    <p className="text-sm">Your instructor hasn't uploaded any materials for this course.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {materials.map(mat => (
                        <div key={mat._id} className="flex items-center gap-4 p-4 border border-slate-200 dark:border-border-dark rounded-2xl hover:border-primary/50 transition-colors bg-white dark:bg-card-dark shadow-sm">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0">
                                <span className="material-symbols-rounded">description</span>
                            </div>
                            <div className="flex-grow min-w-0">
                                <h4 className="font-bold text-slate-900 dark:text-white truncate">{mat.title}</h4>
                                <p className="text-xs text-slate-500">{new Date(mat.createdAt).toLocaleDateString()}</p>
                            </div>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    import('../../utils/fileHelper').then(m => {
                                        window.open(m.getFileViewerUrl(mat.fileUrl), '_blank');
                                    });
                                }}
                                className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-primary/10 transition-colors shrink-0"
                                title="View / Download"
                            >
                                <span className="material-symbols-rounded">visibility</span>
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const StudentQuizList = ({ courseId }) => {
    const [quizzes, setQuizzes] = useState([]);
    const [activeQuiz, setActiveQuiz] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await api.get(`/courses/${courseId}/quizzes`);
                setQuizzes(res.data.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchQuizzes();
    }, [courseId]);

    if (activeQuiz) {
        return <TakeQuiz quiz={activeQuiz} courseId={courseId} onBack={() => { setActiveQuiz(null); window.location.reload(); }} />;
    }

    return (
        <div>
            <h3 className="text-xl font-bold mb-6">Available Quizzes</h3>
            {quizzes.length === 0 ? (
                <div className="bg-white dark:bg-card-dark border-2 border-dashed border-slate-200 dark:border-border-dark rounded-3xl p-12 text-center text-slate-500">
                    <p>No quizzes available for this course.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {quizzes.map(q => {
                        const previousAttempt = q.results.find(r => r.studentId === (user?._id || user?.id));
                        return (
                            <div key={q._id} className="bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark rounded-2xl p-6 shadow-sm flex flex-col h-full">
                                <div className="flex-grow mb-4">
                                    <h4 className="font-bold text-lg mb-2">{q.title}</h4>
                                    <p className="text-sm text-slate-500">{q.questions.length} Questions</p>
                                </div>
                                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                                    {previousAttempt ? (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-500">Status: {previousAttempt.isGraded ? 'Graded' : 'Pending Manual Review'}</span>
                                            {previousAttempt.isGraded && (
                                                <span className="font-bold text-primary">Score: {previousAttempt.score}</span>
                                            )}
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setActiveQuiz(q)}
                                            className="w-full bg-primary hover:bg-teal-500 text-slate-900 font-bold py-2 rounded-xl transition-colors text-sm"
                                        >
                                            Take Quiz
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const TakeQuiz = ({ quiz, courseId, onBack }) => {
    // Array of { questionId, selectedOptionIndex, descriptiveText }
    const [answers, setAnswers] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [resultMsg, setResultMsg] = useState('');

    const handleOptionSelect = (questionId, optionIndex) => {
        const newAnswers = answers.filter(a => a.questionId !== questionId);
        newAnswers.push({ questionId, selectedOptionIndex: optionIndex, descriptiveText: '' });
        setAnswers(newAnswers);
    };

    const handleTextChange = (questionId, text) => {
        const newAnswers = answers.filter(a => a.questionId !== questionId);
        newAnswers.push({ questionId, selectedOptionIndex: null, descriptiveText: text });
        setAnswers(newAnswers);
    };

    const handleSubmit = async () => {
        if (answers.length < quiz.questions.length && !window.confirm('You have unanswered questions. Submit anyway?')) {
            return;
        }

        setSubmitting(true);
        try {
            const res = await api.post(`/courses/${courseId}/quizzes/${quiz._id}/attempt`, { answers });
            setResultMsg(res.data.message);
        } catch (err) {
            setResultMsg(err.response?.data?.message || 'Submission failed');
        } finally {
            setSubmitting(false);
        }
    };

    if (resultMsg) {
        return (
            <div className="bg-white dark:bg-card-dark p-12 top-0 rounded-3xl border border-slate-200 dark:border-border-dark text-center animate-in fade-in zoom-in-95">
                <span className="material-symbols-rounded text-6xl text-primary mb-4">check_circle</span>
                <h2 className="text-2xl font-bold mb-4">{resultMsg}</h2>
                <button onClick={onBack} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-6 py-2 rounded-xl hover:bg-slate-200 transition-colors">
                    Back to Quizzes
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-card-dark p-8 rounded-3xl border border-slate-200 dark:border-border-dark shadow-sm">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-border-dark pb-6 mb-6">
                <h2 className="text-2xl font-bold">{quiz.title}</h2>
                <button onClick={onBack} className="text-sm font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Cancel</button>
            </div>

            <div className="space-y-8 mb-8">
                {quiz.questions.map((q, index) => {
                    const currentAnswer = answers.find(a => a.questionId === q._id);

                    return (
                        <div key={q._id} className="p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl relative">
                            <span className="absolute top-4 right-4 text-xs font-bold uppercase text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">
                                {q.questionType}
                            </span>
                            <h4 className="font-bold mb-4">
                                <span className="text-primary mr-2">{index + 1}.</span>
                                {q.questionText}
                            </h4>

                            {q.questionType === 'mcq' && (
                                <div className="space-y-3">
                                    {q.options.map((opt, oIndex) => (
                                        <label key={oIndex} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:border-primary/50 transition-colors">
                                            <input
                                                type="radio"
                                                name={`q-${q._id}`}
                                                checked={currentAnswer?.selectedOptionIndex === oIndex}
                                                onChange={() => handleOptionSelect(q._id, oIndex)}
                                                className="w-5 h-5 text-primary focus:ring-primary"
                                            />
                                            <span className="text-sm">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            )}

                            {q.questionType === 'descriptive' && (
                                <textarea
                                    rows="5"
                                    placeholder="Write your answer here..."
                                    value={currentAnswer?.descriptiveText || ''}
                                    onChange={(e) => handleTextChange(q._id, e.target.value)}
                                    className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm resize-none dark:text-white"
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="bg-primary hover:bg-teal-500 text-slate-900 font-bold px-8 py-3 rounded-xl transition-colors disabled:opacity-50"
                >
                    {submitting ? 'Submitting...' : 'Submit Quiz'}
                </button>
            </div>
        </div>
    );
};

export default StudentCourseManager;


// --- ASSIGNMENT COMPONENTS ---

const StudentAssignmentList = ({ courseId }) => {
    const [assignments, setAssignments] = useState([]);
    const [activeAssignment, setActiveAssignment] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const res = await api.get(`/courses/${courseId}/assignments`);
                setAssignments(res.data.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchAssignments();
    }, [courseId]);

    if (activeAssignment) {
        return <SubmitAssignment assignment={activeAssignment} courseId={courseId} onBack={() => { setActiveAssignment(null); window.location.reload(); }} />;
    }

    return (
        <div>
            <h3 className="text-xl font-bold mb-6">Course Assignments</h3>
            {assignments.length === 0 ? (
                <div className="bg-white dark:bg-card-dark border-2 border-dashed border-slate-200 dark:border-border-dark rounded-3xl p-12 text-center text-slate-500">
                    <p>No assignments posted yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {assignments.map(a => {
                        const previousAttempt = a.submissions?.find(s => s.studentId === (user?._id || user?.id));
                        const isPastDeadline = Date.now() > new Date(a.deadline).getTime();

                        return (
                            <div key={a._id} className="bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark rounded-2xl p-6 shadow-sm flex flex-col h-full">
                                <div className="flex-grow mb-4">
                                    <h4 className="font-bold text-lg mb-2">{a.title}</h4>
                                    <p className="text-sm text-slate-500 line-clamp-2">{a.description}</p>
                                </div>
                                <div className="mb-4">
                                    <p className={`text-xs font-bold ${isPastDeadline && !previousAttempt ? 'text-red-500' : 'text-slate-500'}`}>
                                        <span className="material-symbols-rounded text-[14px] align-middle mr-1">schedule</span>
                                        Deadline: {new Date(a.deadline).toLocaleString()}
                                    </p>
                                </div>
                                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                                    {previousAttempt ? (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-500">Status: Submitted</span>
                                            {previousAttempt.grade !== undefined ? (
                                                <span className="font-bold text-primary">Score: {previousAttempt.grade}</span>
                                            ) : (
                                                <span className="text-amber-500 font-medium">Pending Review</span>
                                            )}
                                            <button
                                                onClick={() => setActiveAssignment(a)}
                                                className="text-primary font-bold hover:underline"
                                            >
                                                View
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setActiveAssignment(a)}
                                            disabled={isPastDeadline}
                                            className="w-full bg-primary hover:bg-teal-500 text-slate-900 font-bold py-2 rounded-xl transition-colors text-sm disabled:opacity-50 disabled:hover:bg-primary"
                                        >
                                            {isPastDeadline ? 'Deadline Passed' : 'Submit Assignment'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const SubmitAssignment = ({ assignment, courseId, onBack }) => {
    const { user } = useAuth();
    const [file, setFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const previousAttempt = assignment.submissions?.find(s => s.studentId === (user?._id || user?.id));
    const isPastDeadline = Date.now() > new Date(assignment.deadline).getTime();
    const canSubmit = !isPastDeadline && (!previousAttempt || previousAttempt.grade === undefined); // allow resubmit if not graded and not past deadline

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            alert('Please select a file to submit.');
            return;
        }

        setSubmitting(true);
        const data = new FormData();
        data.append('file', file);

        try {
            await api.post(`/courses/${courseId}/assignments/${assignment._id}/submit`, data);
            alert('Assignment submitted successfully!');
            onBack();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Submission failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white dark:bg-card-dark p-8 rounded-3xl border border-slate-200 dark:border-border-dark shadow-sm">
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-border-dark pb-6 mb-6">
                <div>
                    <h2 className="text-2xl font-bold mb-2">{assignment.title}</h2>
                    <p className="text-slate-500">Deadline: {new Date(assignment.deadline).toLocaleString()}</p>
                </div>
                <button onClick={onBack} className="text-sm font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Back</button>
            </div>

            <div className="prose dark:prose-invert max-w-none mb-8">
                <h4 className="font-bold text-slate-800 dark:text-slate-200">Instructions:</h4>
                <p className="text-sm bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 mt-2 whitespace-pre-wrap">
                    {assignment.description}
                </p>
                {assignment.facultyAttachment && (
                    <div className="mt-4">
                        <a href={assignment.facultyAttachment?.startsWith('http') ? assignment.facultyAttachment : `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000'}${assignment.facultyAttachment}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            <span className="material-symbols-rounded text-[18px]">attachment</span> Faculty Attachment
                        </a>
                    </div>
                )}
            </div>

            {previousAttempt && (
                <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl">
                    <h4 className="font-bold mb-4">Your Submission</h4>
                    <div className="flex items-center justify-between">
                        <a href={previousAttempt.submissionFile?.startsWith('http') ? previousAttempt.submissionFile : `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000'}${previousAttempt.submissionFile}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium text-sm flex items-center gap-2">
                            <span className="material-symbols-rounded text-sm">download</span> Download your uploaded file
                        </a>
                        <span className="text-xs text-slate-500">Submitted: {new Date(previousAttempt.submittedAt).toLocaleString()}</span>
                    </div>

                    {previousAttempt.grade !== undefined && (
                        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                            <h5 className="font-bold text-primary mb-2 flex items-center gap-2">
                                <span className="material-symbols-rounded">stars</span> Graded: {previousAttempt.grade} Marks
                            </h5>
                            {previousAttempt.feedback && (
                                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 mt-2">
                                    <p className="text-sm font-semibold text-slate-500 mb-1">Faculty Feedback:</p>
                                    <p className="text-sm">{previousAttempt.feedback}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {canSubmit ? (
                <form onSubmit={handleSubmit} className="p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-card-dark">
                    <h4 className="font-bold mb-4">{previousAttempt ? 'Resubmit Assignment' : 'Upload Submission'}</h4>
                    <div className="mb-6">
                        <input
                            type="file" required onChange={e => setFile(e.target.files[0])}
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none transition-all dark:text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary file:text-slate-900 hover:file:bg-teal-500 cursor-pointer"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-primary hover:bg-teal-500 text-slate-900 font-bold px-8 py-3 rounded-xl transition-colors disabled:opacity-50 shadow-sm"
                        >
                            {submitting ? 'Uploading...' : (previousAttempt ? 'Update Submission' : 'Submit Assignment')}
                        </button>
                    </div>
                </form>
            ) : (
                !previousAttempt && isPastDeadline && (
                    <div className="p-6 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 rounded-2xl text-center">
                        <span className="material-symbols-rounded text-3xl mb-2">error</span>
                        <p className="font-bold">Submission Closed</p>
                        <p className="text-sm">The deadline for this assignment has passed.</p>
                    </div>
                )
            )}
        </div>
    );
};
