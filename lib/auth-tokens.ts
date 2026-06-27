import Cookies from "js-cookie"
import type { LoginResponse } from "@/types"

export const ACCESS_TOKEN_COOKIE = "accessToken"
export const REFRESH_TOKEN_COOKIE = "refreshToken"

// Refresh token lives 7 days (see auth contract). The access token JWT itself
// expires in 15 min, but we keep its cookie around for the same window so the
// session survives reloads until auto-refresh is wired up.
const PERSISTENT_DAYS = 7

const baseOptions: Cookies.CookieAttributes = {
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
}

export function setAuthTokens(
  { accessToken, refreshToken }: LoginResponse,
  { rememberMe = true }: { rememberMe?: boolean } = {}
) {
  // rememberMe === false → session cookies (cleared when the browser closes).
  const options: Cookies.CookieAttributes = rememberMe
    ? { ...baseOptions, expires: PERSISTENT_DAYS }
    : baseOptions

  Cookies.set(ACCESS_TOKEN_COOKIE, accessToken, options)
  Cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, options)
}

export function getAccessToken() {
  return Cookies.get(ACCESS_TOKEN_COOKIE)
}

export function getRefreshToken() {
  return Cookies.get(REFRESH_TOKEN_COOKIE)
}

export function updateAccessToken(accessToken: string) {
  const persistent = !!Cookies.get(REFRESH_TOKEN_COOKIE)
  const options: Cookies.CookieAttributes = persistent
    ? { ...baseOptions, expires: PERSISTENT_DAYS }
    : baseOptions
  Cookies.set(ACCESS_TOKEN_COOKIE, accessToken, options)
}

export function clearAuthTokens() {
  Cookies.remove(ACCESS_TOKEN_COOKIE, { path: "/" })
  Cookies.remove(REFRESH_TOKEN_COOKIE, { path: "/" })
}
