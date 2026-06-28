# API Contract — `POST /courses`

Creates a new course with an optional formation association and a thumbnail image.

> Shared context (base URL, auth model, error shape): see [`README.md`](../README.md).

## Summary

| Item | Value |
|------|-------|
| Method / Path | `POST /courses` |
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

This endpoint accepts form data fields and a file payload.

| Part/Field | Type | Required | Description |
|------------|------|----------|-------------|
| `formationId` | string (UUID) | No | Optional parent formation ID. If provided, the formation must exist. |
| `name` | string | **Yes** | Unique course name. Must not be blank. |
| `description` | string | No | Course description. |
| `category` | string (enum) | **Yes** | One of: `FORMACAO`, `CURSO_LIVRE`. Case-insensitive. |
| `type` | string (enum) | **Yes** | One of: `ONLINE`, `IN_PERSON`. Case-insensitive. |
| `active` | boolean | No | Course status (defaults to server-side logic/database default if null). |
| `price` | number (decimal) | No | Price of the course. |
| `duration` | string | No | Duration of the course (e.g. `"20 hours"`). |
| `instructorIds` | array of string (UUID) | No | Zero or more instructor IDs. Repeat the field once per instructor (e.g. multiple `instructorIds` form parts). Every provided instructor must exist. |
| `thumbnail` | binary (file) | **Yes** | Thumbnail image file to be uploaded to storage. |
| `addressStreet` | string | No | Street address (applicable only for `IN_PERSON` courses). |
| `addressCity` | string | No | City (applicable only for `IN_PERSON` courses). |
| `addressState` | string | No | State (applicable only for `IN_PERSON` courses). |
| `addressZip` | string | No | ZIP code (applicable only for `IN_PERSON` courses). |
| `establishmentName` | string | No | Establishment/venue name (applicable only for `IN_PERSON` courses). |
| `eventStartsAt` | string (ISO-8601 date-time) | No | Event start date-time (applicable only for `IN_PERSON` courses). Format: `yyyy-MM-dd'T'HH:mm:ss`. |
| `eventEndsAt` | string (ISO-8601 date-time) | No | Event end date-time (applicable only for `IN_PERSON` courses). Format: `yyyy-MM-dd'T'HH:mm:ss`. |
| `registrationStartsAt` | string (ISO-8601 date-time) | No | Registration start date-time. Format: `yyyy-MM-dd'T'HH:mm:ss`. |
| `registrationEndsAt` | string (ISO-8601 date-time) | No | Registration end date-time. Format: `yyyy-MM-dd'T'HH:mm:ss`. |
| `totalSpots` | integer | No | Total capacity/spots available (applicable only for `IN_PERSON` courses). |

## Success response — `201 Created`

```json
{
  "id": "8f73b982-61b6-40a7-8f73-b9826a9a4542",
  "name": "Formação Java Fullstack",
  "description": "A complete Java course from zero to hero",
  "category": "FORMACAO",
  "type": "ONLINE",
  "active": true,
  "price": 1299.90,
  "thumbnailUrl": "https://s3.amazonaws.com/bucket/courses/thumbnails/java-thumbnail.png"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | Unique course identifier |
| `name` | string | Unique course name |
| `description` | string | Course description (can be null) |
| `category` | string (enum) | One of: `FORMACAO`, `CURSO_LIVRE` |
| `type` | string (enum) | One of: `ONLINE`, `IN_PERSON` |
| `active` | boolean | Whether the course is active (visible to students) |
| `price` | number (decimal) | Price of the course (can be null) |
| `thumbnailUrl` | string (URL) | Public URL of the uploaded thumbnail image |

## Error responses

| Status | When | Body |
|--------|------|------|
| `400 Bad Request` | Course name already exists | `ErrorResponse` with `error: "Erro de regra de negócio"` and message: `"A course with this name already exists."` |
| `403 Forbidden` | Access token missing, invalid, expired, or user doesn't have the `ADMIN` role | Empty or standard 403 response. |
| `404 Not Found` | Parent formation with the specified `formationId` does not exist | `ErrorResponse` with `error: "Recurso não encontrado"` and message: `"Formação não encontrada com o ID: <formationId>"` |
| `404 Not Found` | Any instructor in `instructorIds` does not exist | `ErrorResponse` with `error: "Recurso não encontrado"` and message: `"Instructor not found with id: <instructorId>"` |
| `500 Internal Server Error` | A required field is missing/blank (`name`, `category`, `type`), the `thumbnail` file part is missing, the `category`/`type` enum value is invalid, or a field value is malformed (e.g. non-numeric `price`) | `ErrorResponse` with `error: "Internal server error"`. Bean Validation, binding, missing-part and illegal-argument failures are not mapped to `400` by the current global handler — they fall through to the generic `500` handler. |

## Examples

### Example 1: Creating an ONLINE Course

```http
POST http://localhost:8080/api/courses
Authorization: Bearer ADMIN_ACCESS_TOKEN_HERE
Content-Type: multipart/form-data; boundary=boundary123

--boundary123
Content-Disposition: form-data; name="formationId"

3fa85f64-5717-4562-b3fc-2c963f66afa6
--boundary123
Content-Disposition: form-data; name="name"

Formação Java Fullstack
--boundary123
Content-Disposition: form-data; name="description"

A complete Java course from zero to hero
--boundary123
Content-Disposition: form-data; name="category"

FORMACAO
--boundary123
Content-Disposition: form-data; name="type"

ONLINE
--boundary123
Content-Disposition: form-data; name="active"

true
--boundary123
Content-Disposition: form-data; name="price"

1299.90
--boundary123
Content-Disposition: form-data; name="duration"

40 hours
--boundary123
Content-Disposition: form-data; name="instructorIds"

9d787ce5-f0dd-47b1-86d3-645dbf70079a
--boundary123
Content-Disposition: form-data; name="thumbnail"; filename="java-thumbnail.png"
Content-Type: image/png

[BINARY_DATA]
--boundary123--
```

### Example 2: Creating an IN_PERSON Course with details

```http
POST http://localhost:8080/api/courses
Authorization: Bearer ADMIN_ACCESS_TOKEN_HERE
Content-Type: multipart/form-data; boundary=boundary123

--boundary123
Content-Disposition: form-data; name="name"

Teoria da Computação Presencial
--boundary123
Content-Disposition: form-data; name="description"

Modelos de computação, máquina de Turing e decidibilidade.
--boundary123
Content-Disposition: form-data; name="category"

FORMACAO
--boundary123
Content-Disposition: form-data; name="type"

IN_PERSON
--boundary123
Content-Disposition: form-data; name="active"

true
--boundary123
Content-Disposition: form-data; name="price"

499.00
--boundary123
Content-Disposition: form-data; name="duration"

16 hours
--boundary123
Content-Disposition: form-data; name="instructorIds"

9d787ce5-f0dd-47b1-86d3-645dbf70079a
--boundary123
Content-Disposition: form-data; name="instructorIds"

3b2e1a47-8c0d-4f6a-9b21-7d5e0c9a1f88
--boundary123
Content-Disposition: form-data; name="addressStreet"

Rua das Flores, 123
--boundary123
Content-Disposition: form-data; name="addressCity"

São Paulo
--boundary123
Content-Disposition: form-data; name="addressState"

SP
--boundary123
Content-Disposition: form-data; name="addressZip"

01234-567
--boundary123
Content-Disposition: form-data; name="establishmentName"

Auditório Principal
--boundary123
Content-Disposition: form-data; name="eventStartsAt"

2026-08-10T09:00:00
--boundary123
Content-Disposition: form-data; name="eventEndsAt"

2026-08-10T18:00:00
--boundary123
Content-Disposition: form-data; name="registrationStartsAt"

2026-07-01T00:00:00
--boundary123
Content-Disposition: form-data; name="registrationEndsAt"

2026-08-05T23:59:59
--boundary123
Content-Disposition: form-data; name="totalSpots"

50
--boundary123
Content-Disposition: form-data; name="thumbnail"; filename="turing-course.png"
Content-Type: image/png

[BINARY_DATA]
--boundary123--
```
