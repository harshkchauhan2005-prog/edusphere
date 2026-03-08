import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const FacultyContentList = ({ type }) => {
    // type can be 'materials', 'quizzes', 'assignments'
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            try {
                // To display all materials/quizzes/assignments across all courses for the faculty,
                // we first need a dedicated endpoint, or we can fetch courses and then aggregate.
                // Since an aggregation endpoint wasn't planned directly, we'll fetch all managed courses
                // and then fetch their respective items, or use the search endpoint, OR
                // ideally, we have dedicated endpoints like /api/materials/faculty (if they existed).
                // Let's aggregate via courses as a fallback, or build a quick aggregation.

                // Let's first fetch managed courses
                const coursesRes = await api.get('/courses/managed');
                const courses = coursesRes.data.data;
                const courseIds = courses.map(c => c._id);

                // Fetching all might be heavy, but for this scope it works since we don't have a cross-course endpoint setup yet.
                // Actually, wait, let's just make concurrent calls for the specific type for each course they manage.

                const fetchPromises = courses.map(course =>
                    api.get(`/courses/${course._id}/${type}`).then(res =>
                        res.data.data.map(item => ({ ...item, courseName: course.courseName, courseId: course._id }))
                    )
                );

                const results = await Promise.all(fetchPromises);
                const aggregatedItems = results.flat().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                setItems(aggregatedItems);
            } catch (err) {
                console.error(`Failed to fetch ${type}`, err);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [type]);

    const getIcon = () => {
        switch (type) {
            case 'materials': return 'description';
            case 'quizzes': return 'quiz';
            case 'assignments': return 'assignment';
            default: return 'folder';
        }
    };

    const getTitle = () => {
        switch (type) {
            case 'materials': return 'All Output Materials';
            case 'quizzes': return 'All Quizzes';
            case 'assignments': return 'All Assignments';
            default: return 'Content';
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <span className="material-symbols-rounded animate-spin text-4xl text-primary mb-4 block">sync</span>
                <p className="text-slate-500 font-medium tracking-wide">Gathering your {type}...</p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-primary/20 text-primary rounded-2xl flex items-center justify-center shrink-0">
                    <span className="material-symbols-rounded text-2xl">{getIcon()}</span>
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white capitalize">{getTitle()}</h1>
                    <p className="text-slate-500 dark:text-slate-400">View and manage all your {type} across your courses.</p>
                </div>
            </div>

            {items.length === 0 ? (
                <div className="bg-white dark:bg-card-dark border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center text-slate-500 shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-rounded text-4xl text-slate-400">{getIcon()}</span>
                    </div>
                    <p className="font-bold text-slate-700 dark:text-slate-300 mb-2 text-lg">No {type} found.</p>
                    <p className="text-sm">You haven't created any {type} in any of your courses yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item, idx) => (
                        <div
                            key={`${item._id}-${idx}`}
                            onClick={() => navigate(`/faculty/courses/${item.courseId}`)}
                            className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:border-primary/50 hover:shadow-md cursor-pointer transition-all group flex flex-col h-full"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    <span className="material-symbols-rounded">{getIcon()}</span>
                                </div>
                                <span className="text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                {item.title}
                            </h3>

                            {type === 'assignments' && item.deadline && (
                                <p className="text-xs font-medium text-red-500 dark:text-red-400 mb-3 flex items-center gap-1 bg-red-50 dark:bg-red-900/10 px-2 py-1 rounded w-fit">
                                    <span className="material-symbols-rounded text-[14px]">calendar_clock</span>
                                    Due: {new Date(item.deadline).toLocaleDateString()}
                                </p>
                            )}

                            {type === 'quizzes' && item.questions && (
                                <p className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-3 flex items-center gap-1">
                                    <span className="material-symbols-rounded text-[14px]">format_list_numbered</span>
                                    {item.questions.length} Questions
                                </p>
                            )}

                            <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/60">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Course</p>
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                                    {item.courseName}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FacultyContentList;
