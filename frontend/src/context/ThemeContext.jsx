import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    // Check local storage or system preference on initial load
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                return savedTheme === 'dark';
            }
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return true; // Default to dark mode for EduSphere MVP aesthetic
    });

    const [isThemeLocked, setIsThemeLocked] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/settings');
                const settings = res.data.data;
                if (settings) {
                    setIsThemeLocked(settings.isThemeLocked);
                    if (settings.isThemeLocked) {
                        setIsDark(settings.forcedTheme === 'dark');
                    }
                }
            } catch (err) {
                console.error("Failed fetching theme settings", err);
            }
        };
        fetchSettings();
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const toggleTheme = () => {
        if (!isThemeLocked) {
            setIsDark(!isDark);
        }
    };

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme, isThemeLocked, setIsThemeLocked, setIsDark }}>
            {children}
        </ThemeContext.Provider>
    );
};
