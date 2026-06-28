# API Contracts — Index

Contracts for the endpoints created/changed in the latest backend modification.
Audience: an external integrator (or AI) **without prior context** of this project.

Each contract file is self-contained. This index holds the shared context.

## Contracts

| Method | Path | Auth | File |
|--------|------|------|------|
| `POST` | `/auth/login` | Public | [`login.contract.md`](./auth/login.contract.md) |
| `POST` | `/auth/refresh` | Public (token in body) | [`refresh.contract.md`](./auth/refresh.contract.md) |
| `GET` | `/users/current` | Bearer accessToken | [`current.contract.md`](./user/current.contract.md) |
| `POST` | `/courses` | Bearer accessToken (ADMIN) | [`create.contract.md`](./course/create.contract.md) |
| `POST` | `/courses/{id}/files` | Bearer accessToken (ADMIN) | [`upload-file.contract.md`](./course/upload-file.contract.md) |
| `POST` | `/courses/{id}/links` | Bearer accessToken (ADMIN) | [`add-link.contract.md`](./course/add-link.contract.md) |
| `GET` | `/courses` | Bearer accessToken | [`list.contract.md`](./course/list.contract.md) |
| `GET` | `/courses/{id}` | Bearer accessToken | [`get-by-id.contract.md`](./course/get-by-id.contract.md) |
| `POST` | `/instructors` | Bearer accessToken (ADMIN) | [`create.contract.md`](./instructor/create.contract.md) |
| `GET` | `/instructors` | Bearer accessToken | [`list.contract.md`](./instructor/list.contract.md) |
| `GET` | `/instructors/{id}` | Bearer accessToken | [`get-by-id.contract.md`](./instructor/get-by-id.contract.md) |
| `PUT` | `/instructors/{id}` | Bearer accessToken (ADMIN) | [`update.contract.md`](./instructor/update.contract.md) |
| `DELETE` | `/instructors/{id}` | Bearer accessToken (ADMIN) | [`delete.contract.md`](./instructor/delete.contract.md) |
| `GET` | `/enrollments/courses/{courseId}/access` | Bearer accessToken | [`check-course-access.contract.md`](./enrollment/check-course-access.contract.md) |

## General information

| Item | Value |
|------|-------|
| Base URL (local) | `http://localhost:8080/api` |
| Content type | `application/json` (request and response) |
| Auth scheme | JWT Bearer token in the `Authorization` header |
| Date format | ISO-8601 date-time string, e.g. `2026-06-26T14:30:00.123` (no timezone offset) |
| ID format | UUID string, e.g. `3fa85f64-5717-4562-b3fc-2c963f66afa6` |

## Authentication model

- Authentication uses **JWT** tokens signed with HMAC-256.
- Two token kinds are issued, distinguished by an internal `type` claim:
  - **accessToken** — short-lived (**15 minutes**). Sent on every authenticated request.
  - **refreshToken** — long-lived (**7 days**). Used only to obtain a new accessToken.
- A token is sent in the header: `Authorization: Bearer <accessToken>`.
- The accessToken and refreshToken are **not interchangeable**: a refreshToken cannot access protected endpoints, and an accessToken cannot be used on the refresh endpoint.
- Tokens are **stateless** — they cannot be revoked individually before expiry. Logging out is a client-side action (discard the tokens).

### Token lifecycle (recommended client flow)

1. `POST /auth/login` → store `accessToken` and `refreshToken`.
2. Send `Authorization: Bearer <accessToken>` on protected requests.
3. When the accessToken expires (protected request returns `401`/`403`), call `POST /auth/refresh` with the `refreshToken` to get a new `accessToken`.
4. When the refreshToken also expires (refresh returns `401`), the user must log in again.

## Common error response shape

All handled business errors return this JSON body:

```json
{
  "timestamp": "2026-06-26T14:30:00.123",
  "status": 401,
  "error": "Invalid token",
  "message": "The provided token is invalid or expired"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `timestamp` | string (ISO-8601 date-time) | When the error occurred |
| `status` | integer | HTTP status code (mirrors the response status) |
| `error` | string | Short error label |
| `message` | string | Human-readable detail |
