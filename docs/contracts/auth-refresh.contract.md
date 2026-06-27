# API Contract — `POST /auth/refresh`

Exchanges a valid refreshToken for a new accessToken. Does **not** issue a new refreshToken (no rotation) — the original refreshToken stays valid until it expires.

> Shared context (base URL, auth model, error shape): see [`README.md`](./README.md).

## Summary

| Item | Value |
|------|-------|
| Method / Path | `POST /auth/refresh` |
| Base URL (local) | `http://localhost:8080` |
| Auth required | No bearer header (the refreshToken is sent in the body, not the `Authorization` header) |
| Path / query params | None |

## Request headers

| Header | Value | Required |
|--------|-------|----------|
| `Content-Type` | `application/json` | Yes |

## Request body

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `refreshToken` | string (JWT) | Yes | The `refreshToken` returned by `POST /auth/login` |

## Success response — `200 OK`

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

| Field | Type | Description |
|-------|------|-------------|
| `accessToken` | string (JWT) | A fresh short-lived token (15 min) |

## Error responses

| Status | When | Body (`error` / `message`) |
|--------|------|-----------------------------|
| `401 Unauthorized` | refreshToken is invalid, expired, malformed, or is actually an accessToken | `"Invalid token"` / `"The provided token is invalid or expired"` |
| `401 Unauthorized` | The user referenced by the token no longer exists | same as above |
| `401 Unauthorized` | The user is deactivated (`active = false`) | same as above |

Example error body:

```json
{
  "timestamp": "2026-06-26T14:30:00.123",
  "status": 401,
  "error": "Invalid token",
  "message": "The provided token is invalid or expired"
}
```

## Example

```http
POST http://localhost:8080/auth/refresh
Content-Type: application/json

{
  "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
}
```
