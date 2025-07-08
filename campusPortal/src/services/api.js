import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  if (companyId) {
    config.headers['Company-ID'] = companyId;
  }
  
  return config;
});

export default api;