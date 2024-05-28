import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:3001/api' : 'https://baxterdms.vercel.app/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default axiosInstance;
