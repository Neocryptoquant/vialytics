// TEMPORARY: Hardcoded for diagnosis - will revert to env var once working
export const API_BASE = 'https://vialytics-production.up.railway.app';

export const endpoints = {
    analytics: (wallet: string) => `${API_BASE}/api/analytics/${wallet}`,
    enrichment: (wallet: string) => `${API_BASE}/api/enrichment/${wallet}`,
    index: () => `${API_BASE}/api/index`,
    indexStatus: (jobId: string) => `${API_BASE}/api/index/status/${jobId}`,
    news: () => `${API_BASE}/api/news`,
    config: () => `${API_BASE}/api/config`,
    chat: () => `${API_BASE}/api/chat`,
};
