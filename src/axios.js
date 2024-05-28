import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:3001/api' : 'https://baxterdms.vercel.app/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 60000 // 30 seconds timeout
});


export default axiosInstance;
