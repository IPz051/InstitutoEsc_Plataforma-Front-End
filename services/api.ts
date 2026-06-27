import axios from "axios"
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  updateAccessToken,
} from "@/lib/auth-tokens"
import type { RefreshResponse } from "@/types"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Tracks an in-flight refresh so concurrent 401s don't trigger multiple refresh calls.
let isRefreshing = false
let refreshQueue: Array<(token: string) => void> = []

function processQueue(newToken: string) {
  refreshQueue.forEach((resolve) => resolve(newToken))
  refreshQueue = []
}

function forceLogout() {
  clearAuthTokens()
  if (typeof window !== "undefined") {
    window.location.href = "/"
  }
}

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    const status = error.response?.status
    if ((status !== 403) || originalRequest._retry) {
      return Promise.reject(error)
    }

    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      forceLogout()
      return Promise.reject(error)
    }

    // If a refresh is already running, queue this request until it resolves.
    if (isRefreshing) {
      return new Promise((resolve) => {
        refreshQueue.push((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          resolve(api(originalRequest))
        })
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const { data } = await axios.post<RefreshResponse>(
        `${BASE_URL}/auth/refresh`,
        { refreshToken }
      )

      updateAccessToken(data.accessToken)
      processQueue(data.accessToken)

      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
      return api(originalRequest)
    } catch {
      refreshQueue = []
      forceLogout()
      return Promise.reject(error)
    } finally {
      isRefreshing = false
    }
  }
)

export default api
