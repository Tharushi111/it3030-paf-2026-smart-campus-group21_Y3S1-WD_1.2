import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9090/api/notifications",
  withCredentials: true,
});

export const getMyNotifications = () => API.get("");

export const markNotificationRead = (id) => API.patch(`/${id}/read`);

export const getMyNotificationPreferences = () => API.get("/preferences");

export const saveMyNotificationPreferences = (payload) =>
  API.put("/preferences", payload);