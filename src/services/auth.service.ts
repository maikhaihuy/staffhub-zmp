import { getAccessToken, nativeStorage } from 'zmp-sdk';
import apiClient from './api';
import { LoginResponse } from '../types/auth';

export const loginWithZalo = async (): Promise<LoginResponse | null> => {
  try {
    // 1. Gọi Zalo SDK để lấy Access Token của User (Zalo cấp cho App của bạn)
    const zaloAccessToken = await getAccessToken();
    
    if (!zaloAccessToken) {
      throw new Error("Không lấy được Access Token từ Zalo SDK");
    }

    // 2. Gửi Zalo Token này lên Backend NestJS để verify và đổi lấy JWT hệ thống
    const response = await apiClient.post<LoginResponse>('/auth/zalo-login', {
      zaloToken: zaloAccessToken,
    });

    const { accessToken, employee } = response.data;

    // 3. Lưu JWT của NestJS vào Zalo Storage để dùng cho các request sau
    await nativeStorage.setItem('jwt_token', accessToken);

    return response.data;
  } catch (error) {
    console.error("Lỗi luồng xử lý Login Zalo:", error);
    return null;
  }
};