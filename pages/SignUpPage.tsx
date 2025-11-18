import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';

const SignUpPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Simulate an API call for registration
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock validation/registration logic
        if (!name.trim()) {
            setError('Please enter your full name.');
        } else if (email === 'user@example.com') {
            setError('This email is already registered. Please log in.');
        } else {
            alert('Sign up successful! You can now log in.');
            navigate('/login');
        }

        setIsLoading(false);
    };

    return (
        <div className="flex justify-center items-center py-12">
            <Card className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-text-main font-heading">Create Your Account</h1>
                    <p className="text-text-muted mt-2">Join ResumeCraft AI and get started.</p>
                </div>
                <form className="space-y-6" onSubmit={handleSignUp}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-text-muted">
                            Full Name
                        </label>
                        <div className="mt-1">
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={isLoading}
                                className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white disabled:opacity-50 transition-opacity"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-text-muted">
                            Email address
                        </label>
                        <div className="mt-1">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white disabled:opacity-50 transition-opacity"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-text-muted">
                            Password
                        </label>
                        <div className="mt-1">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white disabled:opacity-50 transition-opacity"
                            />
                        </div>
                    </div>

                    {error && (
                         <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-md text-sm text-center" role="alert">
                            {error}
                        </div>
                    )}

                    <div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                             {isLoading && <Spinner size="sm" color="white" />}
                            <span className={isLoading ? 'ml-3' : ''}>
                                {isLoading ? 'Creating Account...' : 'Sign Up'}
                            </span>
                        </Button>
                    </div>
                </form>
                 <div className="mt-6">
                    <p className="text-center text-sm text-text-muted">
                        Already have an account?{' '}
                        <NavLink to="/login" className="font-medium text-primary hover:opacity-80">
                            Sign in
                        </NavLink>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default SignUpPage;