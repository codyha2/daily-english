import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../lib/api';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    language: string;
    dailyGoal: number;
    streak: number;
    xp: number;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
    language?: string;
    dailyGoal?: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Check if user is already logged in on mount, or use demo user
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('accessToken');
            const savedUser = localStorage.getItem('user');

            if (token && savedUser) {
                try {
                    // Verify token is still valid by fetching user
                    const { data } = await api.get('/auth/me');
                    if (data.success) {
                        setUser(data.user);
                        localStorage.setItem('user', JSON.stringify(data.user));
                    }
                } catch (error) {
                    // Token invalid, use demo user
                    const demoUser = {
                        id: 'demo-user',
                        name: 'Demo User',
                        email: 'demo@example.com',
                        role: 'student',
                        language: 'vi',
                        dailyGoal: 10,
                        streak: 0,
                        xp: 0
                    };
                    setUser(demoUser);
                    localStorage.setItem('user', JSON.stringify(demoUser));
                }
            } else {
                // No token, use demo user by default
                const demoUser = {
                    id: 'demo-user',
                    name: 'Demo User',
                    email: 'demo@example.com',
                    role: 'student',
                    language: 'vi',
                    dailyGoal: 10,
                    streak: 0,
                    xp: 0
                };
                setUser(demoUser);
                localStorage.setItem('user', JSON.stringify(demoUser));
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });

            if (data.success) {
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                localStorage.setItem('user', JSON.stringify(data.user));
                setUser(data.user);
            } else {
                throw new Error(data.error || 'Login failed');
            }
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Login failed');
        }
    };

    const register = async (registerData: RegisterData) => {
        try {
            const { data } = await api.post('/auth/register', registerData);

            if (data.success) {
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                localStorage.setItem('user', JSON.stringify(data.user));
                setUser(data.user);
            } else {
                throw new Error(data.error || 'Registration failed');
            }
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Registration failed');
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            // Even if API call fails, clear local storage
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            // Set back to demo user
            const demoUser = {
                id: 'demo-user',
                name: 'Demo User',
                email: 'demo@example.com',
                role: 'student',
                language: 'vi',
                dailyGoal: 10,
                streak: 0,
                xp: 0
            };
            setUser(demoUser);
            localStorage.setItem('user', JSON.stringify(demoUser));
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
