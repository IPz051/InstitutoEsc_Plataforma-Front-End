# API Contract — `POST /auth/login`

Authenticates a user with email + password and returns a JWT token pair.

> Shared context (base URL, auth model, error shape): see [`README.md`](../README.md).

## Summary

| Item | Value |
|------|-------|
| Method / Path | `POST /auth/login` |
| Base URL (local) | `http://localhost:8080/api` |
| Auth required | No (public endpoint) |
| Path / query params | None |

## Request headers

| Header | Value | Required |
|--------|-------|----------|
| `Content-Type` | `application/json` | Yes |

## Request body

```json
{
  "email": "user@email.com",
  "password": "yourPassword"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Registered user email |
| `password` | string | Yes | User plain-text password (validated against the stored bcrypt hash) |

## Success response — `200 OK`

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

| Field | Type | Description |
|-------|------|-------------|
| `accessToken` | string (JWT) | Short-lived token (15 min) for authenticated requests |
| `refreshToken` | string (JWT) | Long-lived token (7 days) used to renew the accessToken |

## Error responses

| Status | When | Body (`error` / `message`) |
|--------|------|-----------------------------|
| `401 Unauthorized` | Invalid credentials (wrong password or unregistered email) | `"Unauthorized"` / `"Email or password is incorrect"` |
| `403 Forbidden` | User account is disabled (`active = false`) | `"Forbidden"` / `"User account is disabled"` |

Example error body (401):

```json
{
  "timestamp": "2026-06-26T14:30:00.123",
  "status": 401,
  "error": "Unauthorized",
  "message": "Email or password is incorrect"
}
```

## Example

```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "iggor@email.com",
  "password": "123456"
}
```
