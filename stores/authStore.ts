import { create } from "zustand"
import type { LoginRequest } from "@/types"
import { login as loginRequest } from "@/services/auth/authService"
import { clearAuthTokens, getAccessToken, setAuthTokens } from "@/lib/auth-tokens"
import { useUserStore } from "@/stores/userStore"

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
      // Right after authenticating, load the user profile into the global store.
      // The token cookie is already set, so the api interceptor sends the Bearer.
      await useUserStore.getState().fetchCurrentUser()
    } finally {
      set({ isLoading: false })
    }
  },

  logout: () => {
    clearAuthTokens()
    set({ isAuthenticated: false })
    useUserStore.getState().clearUser()
  },
}))
