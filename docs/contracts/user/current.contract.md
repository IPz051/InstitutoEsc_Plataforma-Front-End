# API Contract — `GET /users/current`

Returns the profile of the user identified by the accessToken in the request. The server reads the email (subject) from the token, loads the user from the database, and returns it.

> Shared context (base URL, auth model, error shape): see [`README.md`](../README.md).

## Summary

| Item | Value |
|------|-------|
| Method / Path | `GET /users/current` |
| Base URL (local) | `http://localhost:8080/api` |
| Auth required | **Yes** — valid accessToken |
| Path / query params | None |
| Request body | None |

## Request headers

| Header | Value | Required |
|--------|-------|----------|
| `Authorization` | `Bearer <accessToken>` | Yes |

## Success response — `200 OK`

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "Iggor",
  "email": "iggor@email.com",
  "role": "STUDENT",
  "active": true,
  "createdAt": "2026-06-26T14:30:00.123",
  "updatedAt": "2026-06-26T14:30:00.123"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | User unique identifier |
| `name` | string | Full name |
| `email` | string | User email (login) |
| `role` | string (enum) | One of: `ADMIN`, `STUDENT` |
| `active` | boolean | Whether the account is active |
| `createdAt` | string (ISO-8601 date-time) | Creation timestamp |
| `updatedAt` | string (ISO-8601 date-time) | Last update timestamp |

> Note: the password is **never** returned.

## Error responses

| Status | When |
|--------|------|
| `403 Forbidden` | No `Authorization` header, or the accessToken is missing/invalid/expired, or a refreshToken was sent instead of an accessToken |

> The protected-resource entry point returns `403` (not `401`) when authentication is absent or invalid, because no `WWW-Authenticate` challenge mechanism is configured. Trigger a token refresh (or re-login) on `403` for this endpoint.

## Example

```http
GET http://localhost:8080/api/users/current
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```
