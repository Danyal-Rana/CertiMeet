// import axios from 'axios';

// const api = axios.create({
//     baseURL: 'http://localhost:8000/api/v1',
//     withCredentials: true,
// });

// // Add request interceptor
// api.interceptors.request.use(
//     (config) => {
//         console.log('API Request:', config.method.toUpperCase(), config.url, config.data);
//         return config;
//     },
//     (error) => {
//         console.error('API Request Error:', error);
//         return Promise.reject(error);
//     }
// );

// // Add response interceptor
// api.interceptors.response.use(
//     (response) => {
//         console.log('API Response:', response.status, response.data);
//         return response;
//     },
//     (error) => {
//         console.error('API Response Error:', error.response?.status, error.response?.data || error.message);
//         return Promise.reject(error);
//     }
// );

// export default api;

import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    withCredentials: true,
});

// Add request interceptor
api.interceptors.request.use(
    (config) => {
        const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='));
        if (token) {
            config.headers.Authorization = `Bearer ${token.split('=')[1]}`;
        }
        console.log('API Request:', config.method.toUpperCase(), config.url, config.data);
        return config;
    },
    (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor
api.interceptors.response.use(
    (response) => {
        console.log('API Response:', response.status, response.data);
        return response;
    },
    (error) => {
        console.error('API Response Error:', error.response?.status, error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;