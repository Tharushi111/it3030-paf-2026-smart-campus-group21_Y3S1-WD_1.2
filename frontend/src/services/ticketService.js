import { API } from "../context/AuthContext";

export const createTicket = (formData) =>
  API.post("/api/tickets", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getAllTickets = () => API.get("/api/tickets");

export const getMyTickets = () => API.get("/api/tickets/my");

export const getAssignedTickets = () => API.get("/api/tickets/assigned");

export const getTicketById = (id) => API.get(`/api/tickets/${id}`);

export const updateTicket = (id, formData) =>
  API.put(`/api/tickets/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteTicket = (id) => API.delete(`/api/tickets/${id}`);

export const updateTicketStatus = (id, statusData) =>
  API.patch(`/api/tickets/${id}/status`, statusData);

export const assignTicket = (id, assignData) =>
  API.patch(`/api/tickets/${id}/assign`, assignData);

export const getAllStaffUsers = () => API.get("/api/tickets/staff");