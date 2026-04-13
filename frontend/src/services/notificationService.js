import axios from "axios";

/* Notification API instance */

const API = axios.create({
  baseURL: "http://localhost:9090/api/notifications",
  withCredentials: true,
});


/*GET MY NOTIFICATIONS */
export const getMyNotifications = () => API.get("");



/* MARK NOTIFICATION AS READ */
export const markNotificationRead = (id) =>
  API.patch(`/${id}/read`);




/*DELETE NOTIFICATION */
export const deleteNotification = (id) =>
  API.delete(`/${id}`);




/*GET USER NOTIFICATION SETTINGs */
export const getMyNotificationPreferences = () =>
  API.get("/preferences");




/* SAVE USER NOTIFICATION SETTINGS */
export const saveMyNotificationPreferences = (payload) =>
  API.put("/preferences", payload);




/* ADMIN: SEND SYSTEM NOTIFICATION*/
export const sendSystemNotification = (message) =>
  axios.post(
    "http://localhost:9090/api/admin/notifications/system",
    { message },
    { withCredentials: true }
  );