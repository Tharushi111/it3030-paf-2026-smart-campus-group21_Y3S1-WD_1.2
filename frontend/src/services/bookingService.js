import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9090/api/bookings",
  withCredentials: true,
});

export const createBooking = (resourceId, data) =>
  API.post(`/resource/${resourceId}`, data);

export const updateBooking = (id, resourceId, data) =>
  API.put(`/${id}/resource/${resourceId}`, data);

export const getMyBookings = () => API.get("/my");

export const getAllBookings = () => API.get("");

export const getBookingById = (id) => API.get(`/${id}`);

export const approveBooking = (id, adminRemark = "") =>
  API.patch(`/${id}/approve`, { adminRemark });

export const rejectBooking = (id, adminRemark) =>
  API.patch(`/${id}/reject`, { adminRemark });

export const cancelBooking = (id) => API.patch(`/${id}/cancel`);

export const deleteBooking = (id) => API.delete(`/${id}`);

export const getBookingQr = (id) =>
  API.get(`/${id}/qr`, { responseType: "blob" });