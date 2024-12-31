import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await api.post('/user/refresh-token');
                return api(originalRequest);
            } catch (refreshError) {
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export const uploadFile = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/files/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const getAllFiles = () => api.get('/files/getAllFiles');
export const deleteFile = (fileId) => api.delete(`/files/deleteFile/${fileId}`);

export const createTemplate = (templateData) => api.post('/certificateTemplates/create-template', templateData);
export const getUserTemplates = () => api.get('/certificateTemplates/get-templates');
export const deleteTemplate = (templateId) => api.delete(`/certificateTemplates/delete-template/${templateId}`);

export default api;