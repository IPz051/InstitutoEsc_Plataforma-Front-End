# API Contract — `GET /enrollments/courses/{courseId}/access`

Checks whether the authenticated user (identified by the JWT accessToken) is enrolled in a specific course and whether that enrollment status grants content access.

> Shared context (base URL, auth model, error shape): see [`README.md`](../README.md).

## Summary

| Item | Value |
|------|-------|
| Method / Path | `GET /enrollments/courses/{courseId}/access` |
| Base URL (local) | `http://localhost:8080/api` |
| Auth required | **Yes** — valid accessToken (any role) |
| Path parameters | `courseId` (UUID) — unique course identifier |
| Query parameters | None |
| Request body | None |

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `courseId` | string (UUID) | **Yes** | The UUID of the course to check access for. |

## Request Headers

| Header | Value | Required |
|--------|-------|----------|
| `Authorization` | `Bearer <accessToken>` | Yes |

## Success Response — `200 OK`

Returned for **every valid request**, regardless of whether the user has a matching enrollment or not. A missing enrollment is **not** an error — it is represented by `hasAccess: false` and `status: null`.

```json
{
  "courseId": "8f73b982-61b6-40a7-8f73-b9826a9a4542",
  "hasAccess": true,
  "status": "ATIVA"
}
```

### Response Schema

| Field | Type | Nullable | Description |
|-------|------|----------|-------------|
| `courseId` | string (UUID) | No | Echoes back the `courseId` from the path. |
| `hasAccess` | boolean | No | `true` if the user may access the course content; `false` otherwise. See access rules below. |
| `status` | string (enum) | **Yes** | Current enrollment status. `null` when the user has no enrollment record for this course. Possible values: `PENDENTE`, `ATIVA`, `CONCLUIDA`, `CANCELADA`, `REEMBOLSADA`. |

### Access Rules

| `status` value | `hasAccess` | Meaning |
|----------------|-------------|---------|
| `ATIVA` | `true` | Enrollment is active — full content access granted. |
| `CONCLUIDA` | `true` | Course completed — content still accessible. |
| `PENDENTE` | `false` | Enrollment created but payment/confirmation pending. |
| `CANCELADA` | `false` | Enrollment cancelled. |
| `REEMBOLSADA` | `false` | Payment was refunded/charged back; access revoked. |
| *(no enrollment)* | `false` | User has no enrollment record for this course. `status` is `null`. |

### Status Enum — All Valid Values

The `status` field is case-sensitive and always returned as uppercase.

| Value | Description |
|-------|-------------|
| `PENDENTE` | Enrollment exists but awaiting payment or confirmation. |
| `ATIVA` | Active enrollment with full content access. |
| `CONCLUIDA` | The student completed the course. |
| `CANCELADA` | Enrollment was cancelled. |
| `REEMBOLSADA` | Access revoked because the payment was refunded or charged back via Asaas. |

## Error Responses

| Status | When | Body |
|--------|------|------|
| `400 Bad Request` | `courseId` is not a valid UUID format | `ErrorResponse` with details on failed value conversion |
| `403 Forbidden` | Access token missing, invalid, or expired | Empty or standard 403 response |

> **Note:** There is **no `404`** for an unknown `courseId`. The endpoint only queries the enrollment table; it does not validate whether the course exists. If `courseId` refers to a non-existent course, the response is `200` with `hasAccess: false` and `status: null` — identical to a user with no enrollment.

## Examples

### Example 1 — User has an active enrollment

**Request**
```http
GET http://localhost:8080/api/enrollments/courses/8f73b982-61b6-40a7-8f73-b9826a9a4542/access
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response — `200 OK`**
```json
{
  "courseId": "8f73b982-61b6-40a7-8f73-b9826a9a4542",
  "hasAccess": true,
  "status": "ATIVA"
}
```

### Example 2 — User completed the course

**Request**
```http
GET http://localhost:8080/api/enrollments/courses/8f73b982-61b6-40a7-8f73-b9826a9a4542/access
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response — `200 OK`**
```json
{
  "courseId": "8f73b982-61b6-40a7-8f73-b9826a9a4542",
  "hasAccess": true,
  "status": "CONCLUIDA"
}
```

### Example 3 — User has no enrollment (or course does not exist)

**Request**
```http
GET http://localhost:8080/api/enrollments/courses/3fa85f64-5717-4562-b3fc-2c963f66afa6/access
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response — `200 OK`**
```json
{
  "courseId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "hasAccess": false,
  "status": null
}
```

### Example 4 — Enrollment refunded (access revoked)

**Request**
```http
GET http://localhost:8080/api/enrollments/courses/8f73b982-61b6-40a7-8f73-b9826a9a4542/access
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response — `200 OK`**
```json
{
  "courseId": "8f73b982-61b6-40a7-8f73-b9826a9a4542",
  "hasAccess": false,
  "status": "REEMBOLSADA"
}
```

### Example 5 — Missing or invalid token

**Request**
```http
GET http://localhost:8080/api/enrollments/courses/8f73b982-61b6-40a7-8f73-b9826a9a4542/access
```

**Response — `403 Forbidden`**
```json
{}
```

### Example 6 — Invalid UUID format for `courseId`

**Request**
```http
GET http://localhost:8080/api/enrollments/courses/not-a-valid-uuid/access
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response — `400 Bad Request`**
```json
{
  "timestamp": "2026-06-28T10:15:00.000",
  "status": 400,
  "error": "Bad Request",
  "message": "Failed to convert value of type 'String' to required type 'UUID'"
}
```
