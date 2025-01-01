import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await api.post('/user/refresh-token');
                return api(originalRequest);
            } catch (refreshError) {
                console.error('Error refreshing token:', refreshError.response?.data || refreshError.message);
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export const loginUser = async (email, password) => {
    try {
        const response = await api.post('/user/login', { email, password });
        return response.data;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
};

export const uploadFile = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/files/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const getAllFiles = async () => {
    try {
        const response = await api.get('/files/getAllFiles');
        return response.data;
    } catch (error) {
        console.error("Error fetching files:", error.response?.data || error.message);
        throw error;
    }
};

export const deleteFile = (fileId) => api.delete(`/files/deleteFile/${fileId}`);

export const createTemplate = (templateData) => api.post('/certificateTemplates/create-template', templateData);

export const getUserTemplates = async () => {
    try {
        const response = await api.get('/certificateTemplates/get-templates');
        return response.data;
    } catch (error) {
        console.error("Error fetching templates:", error.response?.data || error.message);
        throw error;
    }
};

export const deleteTemplate = (templateId) => api.delete(`/certificateTemplates/delete-template/${templateId}`);

export const generateCertificates = (fileId, templateId) => api.get(`/genCertificates/generate?fileId=${fileId}&templateId=${templateId}`);
export const sendCertificatesToEmails = (generatedCertificateId) => api.post(`/genCertificates/send-certificates/${generatedCertificateId}`);
export const deleteGeneratedCertificates = (generatedCertificateId) => api.delete(`/genCertificates/delete/${generatedCertificateId}`);

export const getUserCertificates = async () => {
    try {
        const response = await api.get('/genCertificates/user-certificates');
        return response.data;
    } catch (error) {
        console.error("Error fetching user certificates:", error.response?.data || error.message);
        throw error;
    }
};

export const downloadCertificate = (certificateId) => api.get(`/genCertificates/download/${certificateId}`, { responseType: 'blob' });

export default api;