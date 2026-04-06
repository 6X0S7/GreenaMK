const fallbackBaseUrl = 'http://localhost:3000';

export const apiBaseUrl = (process.env.EXPO_PUBLIC_API_BASE_URL || fallbackBaseUrl).replace(/\/$/, '');
