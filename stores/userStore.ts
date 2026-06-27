import { create } from "zustand"
import type { User } from "@/types"
import { getCurrentUser } from "@/services/users/usersService"

interface UserState {
  user: User | null
  isLoading: boolean
  hasError: boolean
  // Fetches GET /users/current and stores the profile globally. Errors are kept
  // internal (does not throw) so the login flow isn't tied to the profile fetch.
  fetchCurrentUser: () => Promise<void>
  setUser: (user: User | null) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  hasError: false,

  fetchCurrentUser: async () => {
    set({ isLoading: true, hasError: false })
    try {
      const user = await getCurrentUser()
      set({ user })
    } catch {
      set({ user: null, hasError: true })
    } finally {
      set({ isLoading: false })
    }
  },

  setUser: (user) => set({ user }),

  clearUser: () => set({ user: null, hasError: false }),
}))
