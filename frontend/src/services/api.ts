import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 认证相关API
export const authAPI = {
  register: (userData: any) => api.post('/auth/register', userData),
  login: (credentials: any) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
};

// 用户相关API
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (userData: any) => api.put('/user/profile', userData),
  getPoints: () => api.get('/user/points'),
};

// AI功能相关API
export const aiAPI = {
  getFunctions: () => api.get('/ai/functions'),
  getFunctionPoints: () => api.get('/ai/functions/points'),
  processFunction: (functionName: string, input: string) => 
    api.post(`/ai/${functionName}`, { input }),
  movieClip: (formData: FormData) => 
    api.post('/ai/movie-clip', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};

export default api; 