import api from "./api";
import { TokenService } from "./token.service";

const API_URL = import.meta.env.VITE_CATS_URL;

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${TokenService.getAccessToken()}` },
});

export const catService = {
  createCat: async (formData: FormData) => {
    return api.post(`${API_URL}/add`, formData, {
      headers: {
        ...getAuthHeader().headers,
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getCats: async () => {
    return api.get(`${API_URL}/my-cats`, getAuthHeader());
  },
  getCat: async (id: string) => {
    return api.get(`${API_URL}/${id}`, getAuthHeader());
  },
  updateCat: async (id: string, formData: FormData) => {
    return api.put(`${API_URL}/${id}`, formData, {
      headers: {
        ...getAuthHeader().headers,
        "Content-Type": "multipart/form-data",
      },
    });
  },
  deleteCat: async (id: string) => {
    return api.delete(`${API_URL}/${id}`, getAuthHeader());
  }
};