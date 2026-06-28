# API Contract — `PUT /instructors/{id}`

Updates an existing instructor profile with new data and an optional new profile image.

> Shared context (base URL, auth model, error shape): see [`README.md`](../README.md).

## Summary

| Item | Value |
|------|-------|
| Method / Path | `PUT /instructors/{id}` |
| Base URL (local) | `http://localhost:8080/api` |
| Auth required | **Yes** — valid accessToken with role `ADMIN` |
| Path / query params | `id` (path, required) |
| Request body | `multipart/form-data` |

## Request headers

| Header | Value | Required |
|--------|-------|----------|
| `Authorization` | `Bearer <accessToken>` | Yes |
| `Content-Type` | `multipart/form-data; boundary=<boundary>` | Yes |

## Path parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string (UUID) | **Yes** | The unique identifier of the instructor to update. |

## Request body (Multipart Form Fields)

This endpoint accepts form data fields and an optional profile image file.

| Part/Field | Type | Required | Description |
|------------|------|----------|-------------|
| `name` | string | **Yes** | The updated full name of the instructor. Must not be blank. |
| `description` | string | No | The updated biography or description of the instructor. Max 255 characters. |
| `profileImage` | binary (file) | No | Optional new image file for the instructor's profile photo. If provided, replaces the old one. |

## Success response — `200 OK`

```json
{
  "id": "9d787ce5-f0dd-47b1-86d3-645dbf70079a",
  "name": "Jane Doe Updated",
  "description": "Experienced Software Engineer and educator. Now doing online courses.",
  "profileImageUrl": "https://s3.amazonaws.com/bucket/instructors/profiles/jane-doe-new.png"
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
| `403 Forbidden` | Access token missing, invalid, expired, or user doesn't have the `ADMIN` role | Empty or standard 403 response. |
| `404 Not Found` | No instructor exists with the specified `id` | `ErrorResponse` with `error: "Recurso não encontrado"` and `message: "Instructor not found with id: <id>"` |
| `500 Internal Server Error` | A required field is missing/blank (`name`), `description` exceeds 255 characters, or the file payload is malformed | `ErrorResponse` with `error: "Internal server error"`. Bean Validation, binding, and missing-part failures fall through to the generic 500 handler. |

## Examples

### Example 1: Updating name and description with a new profile image

```http
PUT http://localhost:8080/api/instructors/9d787ce5-f0dd-47b1-86d3-645dbf70079a
Authorization: Bearer ADMIN_ACCESS_TOKEN_HERE
Content-Type: multipart/form-data; boundary=boundary123

--boundary123
Content-Disposition: form-data; name="name"

Jane Doe Updated
--boundary123
Content-Disposition: form-data; name="description"

Experienced Software Engineer and educator. Now doing online courses.
--boundary123
Content-Disposition: form-data; name="profileImage"; filename="jane-doe-new.png"
Content-Type: image/png

[BINARY_DATA]
--boundary123--
```

Response:
```http
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8

{
  "id": "9d787ce5-f0dd-47b1-86d3-645dbf70079a",
  "name": "Jane Doe Updated",
  "description": "Experienced Software Engineer and educator. Now doing online courses.",
  "profileImageUrl": "https://s3.amazonaws.com/bucket/instructors/profiles/jane-doe-new.png"
}
```
