import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Simulate an API call for authentication
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock authentication logic - for demo, any valid email and password will work
        if (email.includes('@') && password) {
            login(email);
            navigate('/builder');
        } else {
            setError('Invalid email or password. Please try again.');
        }

        setIsLoading(false);
    };

    return (
        <div className="flex justify-center items-center py-12">
            <Card className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-text-main font-heading">Welcome Back</h1>
                    <p className="text-text-muted mt-2">Sign in to continue your journey.</p>
                </div>
                <form className="space-y-6" onSubmit={handleSignIn}>
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
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white disabled:opacity-50 transition-opacity"
                            />
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <a href="#" className="font-medium text-primary hover:opacity-80">
                                Forgot your password?
                            </a>
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
                                {isLoading ? 'Signing In...' : 'Sign in'}
                            </span>
                        </Button>
                    </div>
                </form>
                 <div className="mt-6">
                    <p className="text-center text-sm text-text-muted">
                        Not a member?{' '}
                        <NavLink to="/signup" className="font-medium text-primary hover:opacity-80">
                            Sign up now
                        </NavLink>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default LoginPage;