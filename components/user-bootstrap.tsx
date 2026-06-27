"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/stores/authStore"
import { useUserStore } from "@/stores/userStore"

// On mount of the authenticated area, makes sure the global user profile is
// loaded. login() already fetches it, but a full page reload starts the client
// stores empty while the auth cookie is still valid — this rehydrates it.
export function UserBootstrap() {
  useEffect(() => {
    const { isAuthenticated } = useAuthStore.getState()
    const { user, isLoading, fetchCurrentUser } = useUserStore.getState()
    if (isAuthenticated && !user && !isLoading) {
      void fetchCurrentUser()
    }
  }, [])

  return null
}
