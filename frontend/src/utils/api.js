import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1',
    withCredentials: true, // This is important for handling cookies/sessions
});

export default api;