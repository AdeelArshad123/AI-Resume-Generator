import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Footer: React.FC = () => {
    const { isAuthenticated } = useAuth();
    return (
        <footer className="bg-white border-t border-slate-200">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl font-bold font-heading text-gradient mb-4">ResumeCraft AI</h3>
                        <p className="text-text-muted">Your dream job awaits. Let AI build the resume to get you there.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg text-text-main mb-4">Product</h4>
                        <ul className="space-y-2">
                            <li><Link to="/features" className="text-text-muted hover:text-primary">Features</Link></li>
                            <li><Link to="/pricing" className="text-text-muted hover:text-primary">Pricing</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg text-text-main mb-4">Company</h4>
                        <ul className="space-y-2">
                            <li><Link to="/about" className="text-text-muted hover:text-primary">About Us</Link></li>
                            <li><a href="#" className="text-text-muted hover:text-primary">Contact</a></li>
                            <li><a href="#" className="text-text-muted hover:text-primary">Careers</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg text-text-main mb-4">Account</h4>
                        <ul className="space-y-2">
                            {!isAuthenticated && (
                                <>
                                    <li><Link to="/login" className="text-text-muted hover:text-primary">Login</Link></li>
                                    <li><Link to="/signup" className="text-text-muted hover:text-primary">Sign Up</Link></li>
                                </>
                            )}
                            <li><a href="#" className="text-text-muted hover:text-primary">Privacy Policy</a></li>
                            <li><a href="#" className="text-text-muted hover:text-primary">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-slate-200 text-center text-slate-500">
                    <p>&copy; {new Date().getFullYear()} ResumeCraft AI. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;