import api from "./api";
import { TokenService } from "./token.service";

const API_URL = import.meta.env.VITE_BASE_URL;

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${TokenService.getAccessToken()}` },
});

export const serviceService = {
  getServices: async () => {
    return api.get(`${API_URL}/list`);
  },
  getService: async (id: string) => {
      return api.get(`${API_URL}/${id}`);
  },
  createService: async (data: FormData) => {
    return api.post(`${API_URL}/add`, data, {
      headers: {
        ...getAuthHeader().headers,
        "Content-Type": "multipart/form-data",
      },
    });
  },
  updateService: async (id: string, data: FormData) => {
    return api.put(`${API_URL}/${id}`, data, {
      headers: {
        ...getAuthHeader().headers,
        "Content-Type": "multipart/form-data",
      },
    });
  },
  deleteService: async (id: string) => {
    return api.delete(`${API_URL}/${id}`, getAuthHeader());
  }
};