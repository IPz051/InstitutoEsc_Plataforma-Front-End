# API Contract — `DELETE /instructors/{id}`

Deletes an instructor profile by their unique ID.

> Shared context (base URL, auth model, error shape): see [`README.md`](../README.md).

## Summary

| Item | Value |
|------|-------|
| Method / Path | `DELETE /instructors/{id}` |
| Base URL (local) | `http://localhost:8080/api` |
| Auth required | **Yes** — valid accessToken with role `ADMIN` |
| Path / query params | `id` (path, required) |
| Request body | None |

## Request headers

| Header | Value | Required |
|--------|-------|----------|
| `Authorization` | `Bearer <accessToken>` | Yes |

## Path parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string (UUID) | **Yes** | The unique identifier of the instructor to delete. |

## Success response — `204 No Content`

No content returned.

## Error responses

| Status | When | Body |
|--------|------|------|
| `400 Bad Request` | Provided `id` parameter is not a valid UUID format | `ErrorResponse` with `error: "Bad Request"` and `message: "Failed to convert value '<id>' of parameter 'id' to required type 'UUID'"` |
| `403 Forbidden` | Access token missing, invalid, expired, or user doesn't have the `ADMIN` role | Empty or standard 403 response. |
| `404 Not Found` | No instructor exists with the specified `id` | `ErrorResponse` with `error: "Recurso não encontrado"` and `message: "Instructor not found with id: <id>"` |

## Examples

### Example 1: Deleting an existing instructor

```http
DELETE http://localhost:8080/api/instructors/9d787ce5-f0dd-47b1-86d3-645dbf70079a
Authorization: Bearer ADMIN_ACCESS_TOKEN_HERE
```

Response:
```http
HTTP/1.1 204 No Content
```

### Example 2: Attempting to delete a non-existent instructor

```http
DELETE http://localhost:8080/api/instructors/00000000-0000-0000-0000-000000000000
Authorization: Bearer ADMIN_ACCESS_TOKEN_HERE
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
