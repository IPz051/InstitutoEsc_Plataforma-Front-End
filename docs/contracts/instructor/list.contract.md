# API Contract — `GET /instructors`

Retrieves a list of all registered instructors.

> Shared context (base URL, auth model, error shape): see [`README.md`](../README.md).

## Summary

| Item | Value |
|------|-------|
| Method / Path | `GET /instructors` |
| Base URL (local) | `http://localhost:8080/api` |
| Auth required | **Yes** — valid accessToken (any role) |
| Path / query params | None |
| Request body | None |

## Request headers

| Header | Value | Required |
|--------|-------|----------|
| `Authorization` | `Bearer <accessToken>` | Yes |

## Success response — `200 OK`

```json
[
  {
    "id": "9d787ce5-f0dd-47b1-86d3-645dbf70079a",
    "name": "Jane Doe",
    "description": "Experienced Software Engineer and educator.",
    "profileImageUrl": "https://s3.amazonaws.com/bucket/instructors/profiles/jane-doe.png"
  },
  {
    "id": "8f73b982-61b6-40a7-8f73-b9826a9a4542",
    "name": "John Smith",
    "description": "Expert mathematician.",
    "profileImageUrl": null
  }
]
```

| Field | Type | Description |
|-------|------|-------------|
| `[].id` | string (UUID) | Unique instructor identifier. |
| `[].name` | string | Full name of the instructor. |
| `[].description` | string | Biography of the instructor (can be null). |
| `[].profileImageUrl` | string (URL) | Public URL of the uploaded profile image (can be null). |

## Error responses

| Status | When | Body |
|--------|------|------|
| `403 Forbidden` | Access token missing, invalid, or expired | Empty or standard 403 response. |

## Examples

### Example 1: Retrieving all instructors

```http
GET http://localhost:8080/api/instructors
Authorization: Bearer USER_ACCESS_TOKEN_HERE
```

Response:
```http
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8

[
  {
    "id": "9d787ce5-f0dd-47b1-86d3-645dbf70079a",
    "name": "Jane Doe",
    "description": "Experienced Software Engineer and educator.",
    "profileImageUrl": "https://s3.amazonaws.com/bucket/instructors/profiles/jane-doe.png"
  },
  {
    "id": "8f73b982-61b6-40a7-8f73-b9826a9a4542",
    "name": "John Smith",
    "description": "Expert mathematician.",
    "profileImageUrl": null
  }
]
```
