import axios from 'axios';
import { nativeStorage } from 'zmp-sdk';

// Thay bằng URL deploy hoặc IP Local máy tính chạy NestJS của bạn
// Lưu ý: Nếu test trên điện thoại thật, không được dùng 'localhost', phải dùng IP nội bộ (ví dụ: 192.168.1.X)
const BASE_URL = 'http://192.168.1.5:3000/api'; 

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Đọc token từ Zalo Storage
      const token = await nativeStorage.getItem('jwt_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Không lấy được token từ Zalo Storage", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;