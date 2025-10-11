import axios from 'axios'

// Prefer build-time/runtime provided Vite env, fall back to the public IP used earlier
const BACKEND_HOST = (import.meta?.env?.VITE_BACKEND_URL) || 'http://54.147.4.213:8024'
const api = axios.create({
  baseURL: `${BACKEND_HOST}/api`,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    // small debug log to confirm token is attached to requests during development
    console.debug('[api] attaching token to request', token?.slice?.(0, 10) + '...')
  } else {
    // helpful debug message when requests are unauthenticated (dev only)
    console.debug('[api] no token in localStorage; request will be sent without Authorization header')
  }
  return config
})

// Placeholder helpers that log requests; to be replaced when backend is ready
export default api



