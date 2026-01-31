import api from "./api";
import { TokenService } from "./token.service";

const API_URL = import.meta.env.VITE_BASE_URL;

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${TokenService.getAccessToken()}` },
});

export const authService = {
  login: async (credentials: { username: string; password: string }) => {
    return api.post(`${API_URL}/login`, credentials);
  },
  register: async (data: { username: string; email: string; phoneNumber: string; password: string; confirmPassword: string }) => {
    return api.post(`${API_URL}/register`, data);
  },
  getProfile: async () => {
    return api.get(`${API_URL}/profile`, getAuthHeader());
  },
  updateProfileImage: async (formData: FormData) => {
    return api.put(`${API_URL}/profile/image`, formData, {
      headers: {
        ...getAuthHeader().headers,
        "Content-Type": "multipart/form-data",
      },
    });
  },
};