import api from "./api";
import { TokenService } from "./token.service";

const API_URL = import.meta.env.VITE_BASE_URL;

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${TokenService.getAccessToken()}` },
});

export const bookingService = {
  createBooking: async (data: { catId: string; serviceId: string; bookingDate: string }) => {
    return api.post(`${API_URL}/create`, data, getAuthHeader());
  },
  getMyBookings: async () => {
    return api.get(`${API_URL}/my-bookings`, getAuthHeader());
  },
  cancelBooking: async (id: string) => {
    return api.delete(`${API_URL}/${id}`, getAuthHeader());
  },
  // Admin Features
  getAllBookings: async () => {
    return api.get(`${API_URL}/all`, getAuthHeader());
  },
  getNotifications: async () => {
    return api.get(`${API_URL}/notifications`, getAuthHeader());
  },
  updateBookingStatus: async (id: string, status: string, adminMessage?: string) => {
    return api.put(`${API_URL}/${id}`, { status, adminMessage }, getAuthHeader());
  },
};