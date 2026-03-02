import axios from 'axios';
import { auth } from '../lib/firebase';

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_BACKEND_URL || 'http://localhost:8000',
});

// Interceptor to add Firebase ID Token to requests
api.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const loginUser = () => api.post('/login');
export const getMyProfile = () => api.get('/me');
export const getUserProfile = () => api.get('/profile');
export const getOverallLeaderboard = () => api.get('/leaderboard/overall');
export const getDailyLeaderboard = (date) => api.get(`/leaderboard/${date}`);
export const getUserHistory = (rollNo) => api.get(`/user/${rollNo}/history`);
export const uploadExcel = (formData) => api.post('/upload-excel', formData, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});
export const getUploadStatus = (date) => api.get('/upload-status', { params: { score_date: date } });

export default api;
