import axios from 'axios';

const BASE_URL = 'http://localhost:3000';  // 根据您的后端配置来设置这个端口

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registerUser = (userData) => {
  return api.post('/users/register', userData);
};

export const verifyEmail = (token) => {
  return api.get(`/users/verify-email/${token}`);
};

export const loginUser = (credentials) => {
  return api.post('/users/login', credentials);
};

export const logoutUser = () => {
  return api.get('/users/logout');
};

export const getUserProfile = () => {
  return api.get('/users/profile');
};

// TODO: 为 "/auth" 路由添加其他API函数，例如authentication相关的API调用
