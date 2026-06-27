# API Contract — `POST /auth/login`

Authenticates a user with email + password and returns a JWT token pair.

> Shared context (base URL, auth model, error shape): see [`README.md`](./README.md).

## Summary

| Item | Value |
|------|-------|
| Method / Path | `POST /auth/login` |
| Base URL (local) | `http://localhost:8080` |
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

| Status | When | Body |
|--------|------|------|
| `500 Internal Server Error` | Invalid credentials (wrong password or unknown email) | `ErrorResponse` with `error: "Erro interno do servidor"` |

> ⚠️ **Known limitation:** invalid credentials currently produce `500`, not `401`. There is no dedicated handler for Spring Security's `AuthenticationException`, so it falls through to the generic handler. **Treat any non-`200` response as a failed login** and do not rely on the specific status until this is fixed server-side.

## Example

```http
POST http://localhost:8080/auth/login
Content-Type: application/json

{
  "email": "iggor@email.com",
  "password": "123456"
}
```
