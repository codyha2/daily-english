import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-in-production';
const JWT_EXPIRES_IN = '15m'; // Access token expires in 15 minutes
const JWT_REFRESH_EXPIRES_IN = '7d'; // Refresh token expires in 7 days

export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
}

export class AuthService {
    /**
     * Hash password using bcrypt
     */
    static async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }

    /**
     * Verify password against hash
     */
    static async verifyPassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    /**
     * Generate JWT access token
     */
    static generateAccessToken(payload: TokenPayload): string {
        return jwt.sign(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN
        });
    }

    /**
     * Generate JWT refresh token
     */
    static generateRefreshToken(payload: TokenPayload): string {
        return jwt.sign(payload, JWT_REFRESH_SECRET, {
            expiresIn: JWT_REFRESH_EXPIRES_IN
        });
    }

    /**
     * Verify access token
     */
    static verifyAccessToken(token: string): TokenPayload | null {
        try {
            return jwt.verify(token, JWT_SECRET) as TokenPayload;
        } catch (error) {
            return null;
        }
    }

    /**
     * Verify refresh token
     */
    static verifyRefreshToken(token: string): TokenPayload | null {
        try {
            return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
        } catch (error) {
            return null;
        }
    }

    /**
     * Generate both access and refresh tokens
     */
    static generateTokens(payload: TokenPayload) {
        return {
            accessToken: this.generateAccessToken(payload),
            refreshToken: this.generateRefreshToken(payload)
        };
    }
}
