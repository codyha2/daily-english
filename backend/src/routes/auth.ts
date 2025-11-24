import express from 'express';
import { z } from 'zod';
import { v4 as uuid } from 'uuid';
import { dataStore } from '../services/dataStore.js';
import { AuthService } from '../services/auth.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';

export const authRouter = express.Router();

// Validation schemas
const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    language: z.enum(['vi', 'en']).default('vi'),
    dailyGoal: z.number().min(5).max(50).default(10)
});

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
});

/**
 * POST /auth/register
 * Register a new user
 */
authRouter.post('/register', async (req, res) => {
    try {
        const parsed = registerSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: parsed.error.errors
            });
        }

        const { name, email, password, language, dailyGoal } = parsed.data;

        // Check if user already exists
        const db = dataStore.snapshot;
        const existingUser = db.users.find(u => u.email === email);

        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: 'User with this email already exists'
            });
        }

        // Hash password
        const hashedPassword = await AuthService.hashPassword(password);

        // Create user
        const userId = uuid();
        const newUser = {
            id: userId,
            name,
            email,
            password: hashedPassword,
            role: 'student' as const,
            dailyGoal,
            language,
            streak: 0,
            xp: 0,
            notificationTime: '20:00'
        };

        await dataStore.save((store) => {
            store.users.push(newUser);
        });

        // Generate tokens
        const tokens = AuthService.generateTokens({
            userId,
            email,
            role: 'student'
        });

        // Save refresh token
        await dataStore.save((store) => {
            const user = store.users.find(u => u.id === userId);
            if (user) {
                (user as any).refreshToken = tokens.refreshToken;
            }
        });

        res.status(201).json({
            success: true,
            user: {
                id: userId,
                name,
                email,
                role: 'student',
                language,
                dailyGoal
            },
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

/**
 * POST /auth/login
 * Login with email and password
 */
authRouter.post('/login', async (req, res) => {
    try {
        const parsed = loginSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: parsed.error.errors
            });
        }

        const { email, password } = parsed.data;

        // Find user
        const db = dataStore.snapshot;
        const user = db.users.find(u => u.email === email);

        if (!user || !(user as any).password) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }

        // Verify password
        const isValid = await AuthService.verifyPassword(password, (user as any).password);

        if (!isValid) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }

        // Generate tokens
        const tokens = AuthService.generateTokens({
            userId: user.id,
            email: user.email,
            role: user.role
        });

        // Save refresh token
        await dataStore.save((store) => {
            const u = store.users.find(u => u.id === user.id);
            if (u) {
                (u as any).refreshToken = tokens.refreshToken;
            }
        });

        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                language: user.language,
                dailyGoal: user.dailyGoal,
                streak: user.streak,
                xp: user.xp
            },
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

/**
 * POST /auth/refresh
 * Refresh access token using refresh token
 */
authRouter.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                error: 'Refresh token is required'
            });
        }

        // Verify refresh token
        const payload = AuthService.verifyRefreshToken(refreshToken);

        if (!payload) {
            return res.status(401).json({
                success: false,
                error: 'Invalid or expired refresh token'
            });
        }

        // Check if refresh token matches stored token
        const db = dataStore.snapshot;
        const user = db.users.find(u => u.id === payload.userId);

        if (!user || (user as any).refreshToken !== refreshToken) {
            return res.status(401).json({
                success: false,
                error: 'Invalid refresh token'
            });
        }

        // Generate new access token
        const accessToken = AuthService.generateAccessToken({
            userId: user.id,
            email: user.email,
            role: user.role
        });

        res.json({
            success: true,
            accessToken
        });
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

/**
 * POST /auth/logout
 * Logout user by invalidating refresh token
 */
authRouter.post('/logout', requireAuth, async (req: AuthRequest, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Not authenticated'
            });
        }

        // Clear refresh token
        await dataStore.save((store) => {
            const user = store.users.find(u => u.id === userId);
            if (user) {
                (user as any).refreshToken = null;
            }
        });

        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

/**
 * GET /auth/me
 * Get current user info
 */
authRouter.get('/me', requireAuth, async (req: AuthRequest, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Not authenticated'
            });
        }

        const db = dataStore.snapshot;
        const user = db.users.find(u => u.id === userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                language: user.language,
                dailyGoal: user.dailyGoal,
                streak: user.streak,
                xp: user.xp,
                lastSessionAt: user.lastSessionAt,
                notificationTime: user.notificationTime
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
