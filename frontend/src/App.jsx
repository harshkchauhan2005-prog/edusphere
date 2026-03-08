import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Import Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage';
import ResetPasswordPage from './pages/public/ResetPasswordPage';
import VerifyEmailPage from './pages/public/VerifyEmailPage';
import CheckEmailPage from './pages/public/CheckEmailPage';
import StudentDashboard from './pages/student/StudentDashboard';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

// Shared Layout component (Optional MVP wrapping)
const Layout = ({ children }) => (
    <div className="layout-container">
        {/* We would place shared Navigation/Sidebar components here */}
        <main>{children}</main>
    </div>
);

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) return <div>Loading EduSphere...</div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    // Check if the route requires a specific role and the user does not have it
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        // Fallback to their base dashboard
        switch (user?.role) {
            case 'admin': return <Navigate to="/admin" replace />;
            case 'faculty': return <Navigate to="/faculty" replace />;
            default: return <Navigate to="/student" replace />;
        }
    }

    return children;
};

const App = () => {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <Layout>
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
                            <Route path="/resetpassword/:resettoken" element={<ResetPasswordPage />} />
                            <Route path="/verifyemail/:verificationtoken" element={<VerifyEmailPage />} />
                            <Route path="/check-email" element={<CheckEmailPage />} />

                            {/* Student Routes */}
                            <Route
                                path="/student/*"
                                element={
                                    <ProtectedRoute allowedRoles={['student']}>
                                        <StudentDashboard />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Faculty Routes */}
                            <Route
                                path="/faculty/*"
                                element={
                                    <ProtectedRoute allowedRoles={['faculty']}>
                                        <FacultyDashboard />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Admin Routes */}
                            <Route
                                path="/admin/*"
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Catch all */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </Layout>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;
