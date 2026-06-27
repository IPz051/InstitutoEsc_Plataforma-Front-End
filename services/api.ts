import axios from "axios"
import { getAccessToken } from "@/lib/auth-tokens"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 403 on /users/current means expired/invalid token — trigger refresh or re-login
    return Promise.reject(error)
  }
)

export default api
