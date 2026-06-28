import api from "@/services/api"
import type { LoginRequest, LoginResponse, RefreshRequest, RefreshResponse } from "@/types"

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/api/auth/login", data)
  return response.data
}

export async function refresh(data: RefreshRequest): Promise<RefreshResponse> {
  const response = await api.post<RefreshResponse>("/api/auth/refresh", data)
  return response.data
}
