import axios from 'axios'
import { getConfig } from '@portal/config'
const cfg = getConfig()
export const http = axios.create({
  baseURL: cfg.API_BASE_URL,
  timeout: 15000
})
http.interceptors.request.use((req) => {
  const token = localStorage.getItem('token')
  if (token) req.headers.Authorization = `Bearer ${token}`
  return req
})
