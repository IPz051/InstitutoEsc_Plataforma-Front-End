import type { UserRole } from "@/types"

// Presentational helpers derived from the GET /users/current profile. The API
// returns only `name`, `email` and `role`, so first name / initials are computed
// from the full name here.

export function getFirstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? ""
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ""
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function getRoleLabel(role: UserRole): string {
  switch (role) {
    case "ADMIN":
      return "Administrador"
    case "STUDENT":
      return "Aluno"
    default:
      return ""
  }
}
