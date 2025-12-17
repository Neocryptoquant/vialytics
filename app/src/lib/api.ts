// API configuration for Vialytics
// Uses VITE_API_URL environment variable for production, falls back to localhost for dev

export const API_BASE = import.meta.env?.VITE_API_URL || 'http://localhost:8000';

export const endpoints = {
    analytics: (wallet: string) => `${API_BASE}/api/analytics/${wallet}`,
    enrichment: (wallet: string) => `${API_BASE}/api/enrichment/${wallet}`,
    index: () => `${API_BASE}/api/index`,
    indexStatus: (jobId: string) => `${API_BASE}/api/index/status/${jobId}`,
    news: () => `${API_BASE}/api/news`,
    config: () => `${API_BASE}/api/config`,
    chat: () => `${API_BASE}/api/chat`,
};
