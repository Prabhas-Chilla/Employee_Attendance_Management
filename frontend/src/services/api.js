import axios from 'axios';

const API = axios.create({
  baseURL:
    window.location.hostname.includes('localhost')
      ? 'http://localhost:5000/api'
      : 'https://employee-attendance-management-336l.onrender.com/api',
});


API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
