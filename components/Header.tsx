import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';

const HamburgerIcon: React.FC = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
);

const CloseIcon: React.FC = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const Header: React.FC = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const activeLinkClass = "text-primary font-semibold";
    const inactiveLinkClass = "text-text-muted hover:text-primary transition-colors";
    const mobileLinkClass = "block py-2 text-lg";

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        navigate('/');
    };
    
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <NavLink to="/" className="text-2xl font-bold font-heading" onClick={closeMenu}>
                        <span className="text-gradient">ResumeCraft AI</span>
                    </NavLink>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <NavLink to="/builder" className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}>Resume Builder</NavLink>
                        <NavLink to="/cover-letter" className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}>Cover Letter</NavLink>
                        <NavLink to="/features" className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}>Features</NavLink>
                        <NavLink to="/pricing" className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}>Pricing</NavLink>
                        <NavLink to="/about" className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}>About Us</NavLink>
                        
                        <div className="w-px h-6 bg-slate-200"></div>

                        {isAuthenticated ? (
                            <Button onClick={handleLogout} variant="secondary" className="px-4 py-2 text-sm">Logout</Button>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <NavLink to="/login" className="text-text-muted hover:text-primary transition-colors text-sm font-semibold">Login</NavLink>
                                <NavLink to="/signup">
                                    <Button variant="primary" className="px-4 py-2 text-sm">Sign Up</Button>
                                </NavLink>
                            </div>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-text-main" aria-label="Toggle menu">
                            {isMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
                        </button>
                    </div>
                </div>
            </div>

             {/* Mobile Navigation Menu */}
            {isMenuOpen && (
                <nav className="md:hidden absolute top-16 left-0 w-full bg-white shadow-lg border-t border-slate-200 animate-fade-in max-h-[calc(100vh-4rem)] overflow-y-auto" onClick={closeMenu}>
                    <div className="px-4 pt-4 pb-6 space-y-4">
                        <NavLink to="/builder" className={({ isActive }) => `${mobileLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}>Resume Builder</NavLink>
                        <NavLink to="/cover-letter" className={({ isActive }) => `${mobileLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}>Cover Letter</NavLink>
                        <NavLink to="/features" className={({ isActive }) => `${mobileLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}>Features</NavLink>
                        <NavLink to="/pricing" className={({ isActive }) => `${mobileLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}>Pricing</NavLink>
                        <NavLink to="/about" className={({ isActive }) => `${mobileLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}>About Us</NavLink>
                        
                        <div className="border-t border-slate-200 pt-4 space-y-3">
                             {isAuthenticated ? (
                                <Button onClick={handleLogout} variant="secondary" className="w-full text-center">Logout</Button>
                            ) : (
                                <>
                                    <NavLink to="/login" className="block text-center text-text-muted hover:text-primary transition-colors py-2">Login</NavLink>
                                    <NavLink to="/signup">
                                        <Button variant="primary" className="w-full text-center">Sign Up</Button>
                                    </NavLink>
                                </>
                            )}
                        </div>
                    </div>
                </nav>
            )}
        </header>
    );
};

export default Header;