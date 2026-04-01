import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9090/api/resources",
});

export const getAllResources = () => API.get("");

export const createResource = (formData) =>
  API.post("", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const updateResource = (id, formData) =>
  API.put(`/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteResource = (id) => API.delete(`/${id}`);