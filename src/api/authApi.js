import axios from 'axios'

const base = '/api/auth'

export const registerUser = (data) =>
  axios.post(`${base}/register`, data).then(r => r.data.data)

export const loginUser = (data) =>
  axios.post(`${base}/login`, data).then(r => r.data.data)
