// API Configuration
// This centralizes the API base URL configuration for the entire app

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Helper function to build API URLs
export const buildApiUrl = (path: string): string => {
    // Ensure path starts with /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE_URL}${normalizedPath}`;
};
