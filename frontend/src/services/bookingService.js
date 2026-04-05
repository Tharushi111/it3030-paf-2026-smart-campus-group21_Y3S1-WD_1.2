import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9090/api/bookings",
});

export const createBooking = (data) => API.post("", data);
export const updateBooking = (id, data) => API.put(`/${id}`, data); // ✅ NEW
export const getAllBookings = () => API.get("");
export const getBookingsByUserId = (userId) =>
  API.get(`/user/${encodeURIComponent(userId)}`);
export const getBookingById = (id) => API.get(`/${id}`);
export const approveBooking = (id) => API.patch(`/${id}/approve`);
export const rejectBooking = (id, remark) =>
  API.patch(`/${id}/reject`, null, { params: { remark } });
export const cancelBooking = (id, userId) =>
  API.patch(`/${id}/cancel`, null, { params: { userId } });
export const deleteBooking = (id) => API.delete(`/${id}`);