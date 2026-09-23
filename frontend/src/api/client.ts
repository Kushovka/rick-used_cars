import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001'

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
  headers: apiBaseUrl.includes('.ngrok-free.dev')
    ? { 'ngrok-skip-browser-warning': 'true' }
    : undefined,
})
