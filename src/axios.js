import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? 'https://baxterdms.vercel.app/api' : 'http://localhost:3001/api',
});

export default axiosInstance;
