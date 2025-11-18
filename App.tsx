import React from 'react';
import { HashRouter, Route, Routes, useLocation, Navigate, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import ResumeBuilderPage from './pages/ResumeBuilderPage';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage';
import AboutPage from './pages/AboutPage';
import { ResumeProvider } from './context/ResumeContext';
import CoverLetterPage from './pages/CoverLetterPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute: React.FC = () => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

const AppContent: React.FC = () => {
    const location = useLocation();
    const isBuilderPage = location.pathname === '/builder';

    return (
        <div className={`flex flex-col min-h-screen bg-background text-text-main ${isBuilderPage ? 'overflow-hidden h-screen' : ''}`}>
            {!isBuilderPage && <Header />}
            <main className={isBuilderPage ? 'flex-grow' : 'flex-grow container mx-auto p-4 md:p-6 lg:p-8'}>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="/builder" element={<ResumeBuilderPage />} />
                        <Route path="/cover-letter" element={<CoverLetterPage />} />
                    </Route>
                    <Route path="/features" element={<FeaturesPage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                </Routes>
            </main>
            {!isBuilderPage && <Footer />}
        </div>
    );
};


const App: React.FC = () => {
    return (
        <AuthProvider>
            <ResumeProvider>
                <HashRouter>
                    <AppContent />
                </HashRouter>
            </ResumeProvider>
        </AuthProvider>
    );
};

export default App;