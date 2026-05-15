import axios from 'axios';
const BASE = 'http://localhost:5000/api';

export const tripsAPI = {
  getAll: () => axios.get(`${BASE}/trips`).then(r => r.data),
  getById: (id) => axios.get(`${BASE}/trips/${id}`).then(r => r.data),
  create: (data) => axios.post(`${BASE}/trips`, data).then(r => r.data),
  update: (id, data) => axios.put(`${BASE}/trips/${id}`, data).then(r => r.data),
  delete: (id) => axios.delete(`${BASE}/trips/${id}`).then(r => r.data),
  like: (id) => axios.post(`${BASE}/trips/${id}/like`).then(r => r.data),
  comment: (id, text) => axios.post(`${BASE}/trips/${id}/comment`, { text }).then(r => r.data),
  explore: () => axios.get(`${BASE}/trips/explore`).then(r => r.data),
  collaborate: (id, email) => axios.post(`${BASE}/trips/${id}/collaborate`, { email }).then(r => r.data),
};
export const itineraryAPI = {
  get: (tripId) => axios.get(`${BASE}/itineraries/${tripId}`).then(r => r.data),
  updateDay: (tripId, dayId, data) => axios.put(`${BASE}/itineraries/${tripId}/day/${dayId}`, data).then(r => r.data),
};
export const expensesAPI = {
  get: (tripId) => axios.get(`${BASE}/expenses/${tripId}`).then(r => r.data),
  add: (tripId, data) => axios.post(`${BASE}/expenses/${tripId}`, data).then(r => r.data),
  delete: (tripId, id) => axios.delete(`${BASE}/expenses/${tripId}/${id}`).then(r => r.data),
};
export const socialAPI = {
  getUsers: () => axios.get(`${BASE}/social/users`).then(r => r.data),
  follow: (userId) => axios.post(`${BASE}/social/follow/${userId}`).then(r => r.data),
  getFeed: () => axios.get(`${BASE}/social/feed`).then(r => r.data),
};
export const dashboardAPI = {
  get: () => axios.get(`${BASE}/dashboard`).then(r => r.data),
};
export const recommendationsAPI = {
  get: () => axios.get(`${BASE}/recommendations`).then(r => r.data),
};
export const weatherAPI = {
  get: (destination) => axios.get(`${BASE}/weather/${encodeURIComponent(destination)}`).then(r => r.data),
};
export const flightsAPI = {
  search: (params) => axios.get(`${BASE}/flights/search`, { params }).then(r => r.data),
  fareCalendar: (params) => axios.get(`${BASE}/flights/fare-calendar`, { params }).then(r => r.data),
};
export const hotelsAPI = {
  search: (params) => axios.get(`${BASE}/hotels/search`, { params }).then(r => r.data),
};
export const visaAPI = {
  check: (passport, destination) => axios.get(`${BASE}/visa/check`, { params: { passport, destination } }).then(r => r.data),
  countries: () => axios.get(`${BASE}/visa/countries`).then(r => r.data),
};
export const loyaltyAPI = {
  get: () => axios.get(`${BASE}/loyalty`).then(r => r.data),
  earn: (action) => axios.post(`${BASE}/loyalty/earn`, { action }).then(r => r.data),
};
export const mapsAPI = {
  nearby: (destination, type) => axios.get(`${BASE}/maps/nearby`, { params: { destination, type } }).then(r => r.data),
  route: (origin, destination) => axios.get(`${BASE}/maps/route`, { params: { origin, destination } }).then(r => r.data),
};
export const alertsAPI = {
  create: (data) => axios.post(`${BASE}/alerts`, data).then(r => r.data),
  get: () => axios.get(`${BASE}/alerts`).then(r => r.data),
};
