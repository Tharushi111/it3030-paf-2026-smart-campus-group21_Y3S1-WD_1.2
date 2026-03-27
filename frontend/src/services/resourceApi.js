import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:9090/api/resources',
})

export const getAllResources = () => API.get('')
export const createResource = (data) => API.post('', data)
export const updateResource = (id, data) => API.put(`/${id}`, data)
export const deleteResource = (id) => API.delete(`/${id}`)