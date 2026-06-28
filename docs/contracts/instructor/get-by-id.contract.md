# API Contract — `GET /instructors/{id}`

Retrieves details of a specific instructor by their unique ID.

> Shared context (base URL, auth model, error shape): see [`README.md`](../README.md).

## Summary

| Item | Value |
|------|-------|
| Method / Path | `GET /instructors/{id}` |
| Base URL (local) | `http://localhost:8080/api` |
| Auth required | **Yes** — valid accessToken (any role) |
| Path / query params | `id` (path, required) |
| Request body | None |

## Request headers

| Header | Value | Required |
|--------|-------|----------|
| `Authorization` | `Bearer <accessToken>` | Yes |

## Path parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string (UUID) | **Yes** | The unique identifier of the instructor to retrieve. |

## Success response — `200 OK`

```json
{
  "id": "9d787ce5-f0dd-47b1-86d3-645dbf70079a",
  "name": "Jane Doe",
  "description": "Experienced Software Engineer and educator.",
  "profileImageUrl": "https://s3.amazonaws.com/bucket/instructors/profiles/jane-doe.png"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | Unique instructor identifier. |
| `name` | string | Full name of the instructor. |
| `description` | string | Biography of the instructor (can be null). |
| `profileImageUrl` | string (URL) | Public URL of the uploaded profile image (can be null). |

## Error responses

| Status | When | Body |
|--------|------|------|
| `400 Bad Request` | Provided `id` parameter is not a valid UUID format | `ErrorResponse` with `error: "Bad Request"` and `message: "Failed to convert value '<id>' of parameter 'id' to required type 'UUID'"` |
| `403 Forbidden` | Access token missing, invalid, or expired | Empty or standard 403 response. |
| `404 Not Found` | No instructor exists with the specified `id` | `ErrorResponse` with `error: "Recurso não encontrado"` and `message: "Instructor not found with id: <id>"` |

## Examples

### Example 1: Retrieving an existing instructor by ID

```http
GET http://localhost:8080/api/instructors/9d787ce5-f0dd-47b1-86d3-645dbf70079a
Authorization: Bearer USER_ACCESS_TOKEN_HERE
```

Response:
```http
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8

{
  "id": "9d787ce5-f0dd-47b1-86d3-645dbf70079a",
  "name": "Jane Doe",
  "description": "Experienced Software Engineer and educator.",
  "profileImageUrl": "https://s3.amazonaws.com/bucket/instructors/profiles/jane-doe.png"
}
```

### Example 2: Requesting a non-existent instructor

```http
GET http://localhost:8080/api/instructors/00000000-0000-0000-0000-000000000000
Authorization: Bearer USER_ACCESS_TOKEN_HERE
```

Response:
```http
HTTP/1.1 404 Not Found
Content-Type: application/json;charset=UTF-8

{
  "timestamp": "2026-06-28T12:45:00.123",
  "status": 404,
  "error": "Recurso não encontrado",
  "message": "Instructor not found with id: 00000000-0000-0000-0000-000000000000"
}
```
