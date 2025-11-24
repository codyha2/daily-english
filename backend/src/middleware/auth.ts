import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.js';

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
        role: string;
    };
}

/**
 * Middleware to verify JWT token and attach user to request
 */
export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'No token provided'
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const payload = AuthService.verifyAccessToken(token);
        if (!payload) {
            return res.status(401).json({
                success: false,
                error: 'Invalid or expired token'
            });
        }

        // Attach user to request
        req.user = payload;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: 'Authentication failed'
        });
    }
}

/**
 * Optional auth - doesn't fail if no token, but attaches user if valid token
 */
export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const payload = AuthService.verifyAccessToken(token);
            if (payload) {
                req.user = payload;
            }
        }
        next();
    } catch (error) {
        // Continue without user
        next();
    }
}

/**
 * Require specific role
 */
export function requireRole(...roles: string[]) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Not authenticated'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: 'Insufficient permissions'
            });
        }

        next();
    };
}
