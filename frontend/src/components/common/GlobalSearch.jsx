import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const GlobalSearch = ({ placeholder = "Search courses, materials..." }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.trim().length >= 2) {
                setIsLoading(true);
                try {
                    const res = await api.get(`/courses/search?q=${encodeURIComponent(query)}`);
                    setResults(res.data.data);
                    setIsOpen(true);
                } catch (err) {
                    console.error('Search failed', err);
                    setResults([]);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleSelectResult = (result) => {
        setIsOpen(false);
        setQuery('');
        navigate(result.url);
    };

    const getIconForType = (type) => {
        switch (type) {
            case 'course': return 'menu_book';
            case 'material': return 'description';
            case 'quiz': return 'quiz';
            case 'assignment': return 'assignment';
            default: return 'search';
        }
    };

    const getBadgeColorForType = (type) => {
        switch (type) {
            case 'course': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
            case 'material': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
            case 'quiz': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800';
            case 'assignment': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
            default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
        }
    };

    return (
        <div ref={wrapperRef} className="relative w-full max-w-sm">
            <div className="relative">
                <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">search</span>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (!isOpen && e.target.value.trim().length >= 2) setIsOpen(true);
                    }}
                    onFocus={() => {
                        if (query.trim().length >= 2) setIsOpen(true);
                    }}
                    className="w-full pl-10 pr-10 py-2 bg-slate-100 dark:bg-card-dark border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white"
                    placeholder={placeholder}
                />
                {isLoading && (
                    <span className="material-symbols-rounded absolute right-3 top-1/2 -translate-y-1/2 text-primary text-lg animate-spin">sync</span>
                )}
                {!isLoading && query && (
                    <button
                        onClick={() => { setQuery(''); setIsOpen(false); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                        <span className="material-symbols-rounded text-lg">close</span>
                    </button>
                )}
            </div>

            {/* Dropdown Results */}
            {isOpen && (
                <div className="absolute top-full mt-2 w-full bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden z-50">
                    {results.length > 0 ? (
                        <div className="max-h-96 overflow-y-auto python-scroll">
                            {results.map((result, idx) => (
                                <button
                                    key={`${result.type}-${result._id}-${idx}`}
                                    onClick={() => handleSelectResult(result)}
                                    className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0 group"
                                >
                                    <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${getBadgeColorForType(result.type)}`}>
                                        <span className="material-symbols-rounded text-sm">{getIconForType(result.type)}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">{result.title}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{result.type}</span>
                                            {result.courseName && (
                                                <>
                                                    <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
                                                    <span className="text-xs text-slate-500 truncate">{result.courseName}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="px-4 py-6 text-center">
                            <span className="material-symbols-rounded text-3xl text-slate-300 dark:text-slate-600 mb-2">search_off</span>
                            <p className="text-sm text-slate-500 font-medium">No results found for "{query}"</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GlobalSearch;
