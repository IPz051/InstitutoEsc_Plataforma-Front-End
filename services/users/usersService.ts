import api from "@/services/api"
import type { User } from "@/types"

export async function getCurrentUser(): Promise<User> {
  const response = await api.get<User>("/users/current")
  return response.data
}
