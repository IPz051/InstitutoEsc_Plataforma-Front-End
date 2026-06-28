# API Contract — `POST /instructors`

Creates a new instructor profile with an optional profile image.

> Shared context (base URL, auth model, error shape): see [`README.md`](../README.md).

## Summary

| Item | Value |
|------|-------|
| Method / Path | `POST /instructors` |
| Base URL (local) | `http://localhost:8080/api` |
| Auth required | **Yes** — valid accessToken with role `ADMIN` |
| Path / query params | None |
| Request body | `multipart/form-data` |

## Request headers

| Header | Value | Required |
|--------|-------|----------|
| `Authorization` | `Bearer <accessToken>` | Yes |
| `Content-Type` | `multipart/form-data; boundary=<boundary>` | Yes |

## Request body (Multipart Form Fields)

This endpoint accepts form data fields and an optional profile image file.

| Part/Field | Type | Required | Description |
|------------|------|----------|-------------|
| `name` | string | **Yes** | The full name of the instructor. Must not be blank. |
| `description` | string | No | Short biography or description of the instructor. Max 255 characters. |
| `profileImage` | binary (file) | No | Optional image file for the instructor's profile photo. |

## Success response — `201 Created`

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
| `profileImageUrl` | string (URL) | Public URL of the uploaded profile image (can be null if not provided). |

## Error responses

| Status | When | Body |
|--------|------|------|
| `403 Forbidden` | Access token missing, invalid, expired, or user doesn't have the `ADMIN` role | Empty or standard 403 response. |
| `500 Internal Server Error` | A required field is missing/blank (`name`), `description` exceeds 255 characters, or the file payload is malformed | `ErrorResponse` with `error: "Internal server error"`. Bean Validation, binding, and missing-part failures fall through to the generic 500 handler. |

## Examples

### Example 1: Creating an Instructor with Profile Image

```http
POST http://localhost:8080/api/instructors
Authorization: Bearer ADMIN_ACCESS_TOKEN_HERE
Content-Type: multipart/form-data; boundary=boundary123

--boundary123
Content-Disposition: form-data; name="name"

Jane Doe
--boundary123
Content-Disposition: form-data; name="description"

Experienced Software Engineer and educator.
--boundary123
Content-Disposition: form-data; name="profileImage"; filename="jane-doe.jpg"
Content-Type: image/jpeg

[BINARY_DATA]
--boundary123--
```

### Example 2: Creating an Instructor without Profile Image

```http
POST http://localhost:8080/api/instructors
Authorization: Bearer ADMIN_ACCESS_TOKEN_HERE
Content-Type: multipart/form-data; boundary=boundary123

--boundary123
Content-Disposition: form-data; name="name"

John Smith
--boundary123
Content-Disposition: form-data; name="description"

Expert mathematician.
--boundary123--
```
