import { create } from "zustand"
import type { LoginRequest } from "@/types"
import { login as loginRequest } from "@/services/auth/authService"
import { clearAuthTokens, getAccessToken, setAuthTokens } from "@/lib/auth-tokens"

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginRequest, rememberMe?: boolean) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  // Reads the cookie once on store init so a reload keeps the session.
  isAuthenticated: Boolean(getAccessToken()),
  isLoading: false,

  login: async (credentials, rememberMe = true) => {
    set({ isLoading: true })
    try {
      const tokens = await loginRequest(credentials)
      setAuthTokens(tokens, { rememberMe })
      set({ isAuthenticated: true })
    } finally {
      set({ isLoading: false })
    }
  },

  logout: () => {
    clearAuthTokens()
    set({ isAuthenticated: false })
  },
}))
