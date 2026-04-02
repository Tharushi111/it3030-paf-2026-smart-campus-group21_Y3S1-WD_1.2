import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9090/api/tickets",
});

export const createTicket = (ticketData) => API.post("", ticketData);

export const getAllTickets = () => API.get("");

export const getTicketById = (id) => API.get(`/${id}`);

export const updateTicket = (id, ticketData) => API.put(`/${id}`, ticketData);

export const deleteTicket = (id) => API.delete(`/${id}`);

export const updateTicketStatus = (id, statusData) => API.patch(`/${id}/status`, statusData);

export const assignTicket = (id, assignData) => API.patch(`/${id}/assign`, assignData);
