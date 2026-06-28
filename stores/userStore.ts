import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { User } from "@/types"
import { getCurrentUser } from "@/services/users/usersService"

interface UserState {
  user: User | null
  isLoading: boolean
  hasError: boolean
  fetchCurrentUser: () => Promise<void>
  setUser: (user: User | null) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
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
    }),
    {
      name: "esc-user",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
)
