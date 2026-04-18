import axios from "axios";

// Notification API instance 

const API = axios.create({
  baseURL: "http://localhost:9090/api/notifications",
  withCredentials: true,
});


//Get my notifications
export const getMyNotifications = () => API.get("");



//Mark notifications as read 
export const markNotificationRead = (id) =>
  API.patch(`/${id}/read`);




//Delete notifications
export const deleteNotification = (id) =>
  API.delete(`/${id}`);




//Get user notification settings
export const getMyNotificationPreferences = () =>
  API.get("/preferences");




// Save user notification settings
export const saveMyNotificationPreferences = (payload) =>
  API.put("/preferences", payload);




// ADMIN - send system notification
export const sendSystemNotification = (message) =>
  axios.post(
    "http://localhost:9090/api/admin/notifications/system",
    { message },
    { withCredentials: true }
  );