import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (email: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        // Check for auth status in session storage on initial load
        return sessionStorage.getItem('isAuthenticated') === 'true';
    });

    const login = (email: string) => {
        // In a real app, you'd verify credentials against a backend
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('userEmail', email);
        setIsAuthenticated(true);
    };

    const logout = () => {
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('userEmail');
        setIsAuthenticated(false);
        // Navigation is now handled in the component that calls logout
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
