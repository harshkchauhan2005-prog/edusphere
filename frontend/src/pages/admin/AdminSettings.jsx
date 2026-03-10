import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';

const AdminSettings = () => {
    const { isDark, isThemeLocked, setIsThemeLocked, setIsDark } = useTheme();
    const [loading, setLoading] = useState(false);

    const handleThemeChange = async () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);

        if (isThemeLocked) {
            try {
                await api.put('/settings', { forcedTheme: newIsDark ? 'dark' : 'light' });
            } catch (e) { console.error('Failed to sync forced theme', e); }
        }
    };

    const handleLockToggle = async () => {
        setLoading(true);
        try {
            const newLockedState = !isThemeLocked;
            await api.put('/settings', { isThemeLocked: newLockedState, forcedTheme: isDark ? 'dark' : 'light' });
            setIsThemeLocked(newLockedState);
        } catch (err) {
            console.error('Failed to update lock setting', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">Platform Settings</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Configure global application behaviors and interface preferences.</p>
            </div>

            <div className="space-y-6">
                {/* Interface Settings */}
                <div className="bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center">
                            <span className="material-symbols-rounded">palette</span>
                        </div>
                        <h2 className="text-lg font-bold">Interface Preferences</h2>
                    </div>
                    <div className="p-6 md:p-8">
                        <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800/50">
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">Dark Mode</h3>
                                <p className="text-sm text-slate-500 mt-1">Switch between light and dark themes</p>
                            </div>
                            <button
                                onClick={handleThemeChange}
                                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:ring-2 focus:ring-primary focus:outline-none ${isDark ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDark ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800/50">
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">Enforce Theme Globally</h3>
                                <p className="text-sm text-slate-500 mt-1">Prevent users from changing their theme locally</p>
                            </div>
                            <button
                                onClick={handleLockToggle}
                                disabled={loading}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-primary focus:outline-none ${isThemeLocked ? 'bg-red-500' : 'bg-slate-300 dark:bg-slate-700'} ${loading ? 'opacity-50' : ''}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isThemeLocked ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* System Configuration placeholder */}
                <div className="bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                            <span className="material-symbols-rounded">build</span>
                        </div>
                        <h2 className="text-lg font-bold">System Configuration</h2>
                    </div>
                    <div className="p-12 text-center text-slate-500">
                        <span className="material-symbols-rounded text-4xl mb-4 opacity-50">engineering</span>
                        <p className="font-bold">Advanced Settings Coming Soon</p>
                        <p className="text-sm mt-2 max-w-sm mx-auto">Future updates will include global email server settings, storage quotas, and maintenance mode toggles.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
