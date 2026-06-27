"use client"

import { useUserStore } from "@/stores/userStore"
import { getFirstName } from "@/lib/user-display"

export function DashboardGreeting() {
  const user = useUserStore((s) => s.user)
  const firstName = user ? getFirstName(user.name) : ""
  return <>{firstName ? `Olá, ${firstName}` : "Olá"}</>
}
