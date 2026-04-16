import { API } from "../context/AuthContext";

export const getAllUsers = () => API.get("/api/admin/users");

export const createUser = (formData) => API.post("/api/admin/users", formData);

export const updateUser = (id, formData) =>
  API.put(`/api/admin/users/${id}`, formData);

export const deleteUser = (id) => API.delete(`/api/admin/users/${id}`);