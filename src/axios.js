import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? 'https://baxterdms.vercel.app/api' : 'http://localhost:3001',
});

export default instance;
