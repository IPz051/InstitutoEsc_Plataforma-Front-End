# API Contract — `POST /courses/{id}/files`

Uploads a new file resource (such as a PDF syllabus, slides, or documents) and associates it with a specific course.

> Shared context (base URL, auth model, error shape): see [`README.md`](../README.md).

## Summary

| Item | Value |
|------|-------|
| Method / Path | `POST /courses/{id}/files` |
| Base URL (local) | `http://localhost:8080/api` |
| Auth required | **Yes** — valid accessToken with role `ADMIN` |
| Path parameters | `id` (UUID) - Unique course identifier |
| Query parameters | None |
| Request body | `multipart/form-data` |

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string (UUID) | **Yes** | The UUID of the course to upload the file to. |

## Request headers

| Header | Value | Required |
|--------|-------|----------|
| `Authorization` | `Bearer <accessToken>` | Yes |
| `Content-Type` | `multipart/form-data; boundary=<boundary>` | Yes |

## Request body (Multipart Form Fields)

This endpoint accepts form data fields and a file payload.

| Part/Field | Type | Required | Description |
|------------|------|----------|-------------|
| `title` | string | **Yes** | Descriptive title of the course file. |
| `file` | binary (file) | **Yes** | The file content (e.g. PDF, DOCX, ZIP) to be uploaded to storage. |

## Success response — `200 OK`

Returns the updated course representation with the newly added file.

```json
{
  "id": "8f73b982-61b6-40a7-8f73-b9826a9a4542",
  "name": "Teoria da Computação Presencial",
  "description": "Modelos de computação, máquina de Turing e decidibilidade.",
  "category": "FORMACAO",
  "type": "IN_PERSON",
  "active": true,
  "price": 499.00,
  "duration": "16 hours",
  "instructors": [
    {
      "id": "9d787ce5-f0dd-47b1-86d3-645dbf70079a",
      "name": "Alan Turing",
      "description": "Pioneiro da ciência da computação.",
      "profileImageUrl": "http://localhost:9000/coursefiles/instructors/turing.png"
    }
  ],
  "thumbnailUrl": "http://localhost:9000/coursefiles/courses/thumbnails/turing-course.png",
  "links": [
    {
      "title": "Course Slides",
      "url": "https://example.com/slides"
    }
  ],
  "files": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Course Syllabus"
    }
  ],
  "details": {
    "addressStreet": "Rua das Flores, 123",
    "addressCity": "São Paulo",
    "addressState": "SP",
    "addressZip": "01234-567",
    "establishmentName": "Auditório Principal",
    "eventStartsAt": "2026-08-10T09:00:00",
    "eventEndsAt": "2026-08-10T18:00:00",
    "registrationStartsAt": "2026-07-01T00:00:00",
    "registrationEndsAt": "2026-08-05T23:59:59",
    "totalSpots": 50
  }
}
```

### Response Schema

| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | Unique course identifier |
| `name` | string | Unique course name |
| `description` | string | Course description (can be null) |
| `category` | string (enum) | One of: `FORMACAO`, `CURSO_LIVRE` |
| `type` | string (enum) | One of: `ONLINE`, `IN_PERSON` |
| `active` | boolean | Whether the course is active |
| `price` | number (decimal) | Price of the course (can be null) |
| `duration` | string | Course duration (can be null) |
| `instructors` | array (object) | Instructors assigned to this course. Empty array if none. |
| `instructors[].id` | string (UUID) | Unique instructor identifier |
| `instructors[].name` | string | Instructor name |
| `instructors[].description` | string | Instructor description (can be null) |
| `instructors[].profileImageUrl` | string (URL) | Instructor profile image URL (can be null) |
| `thumbnailUrl` | string (URL) | Public URL of the uploaded thumbnail image (can be null) |
| `links` | array (object) | Associated links for this course |
| `links[].title` | string | Title of the link |
| `links[].url` | string | URL link target |
| `files` | array (object) | List of uploaded files associated with this course |
| `files[].id` | string (UUID) | Unique identifier for the uploaded file |
| `files[].title` | string | Display title of the uploaded file |
| `details` | object | Detailed address and schedule info (can be null; typically populated for `IN_PERSON` courses) |
| `details.addressStreet` | string | Street address (can be null) |
| `details.addressCity` | string | City (can be null) |
| `details.addressState` | string | State (can be null) |
| `details.addressZip` | string | ZIP code (can be null) |
| `details.establishmentName` | string | Venue/establishment name (can be null) |
| `details.eventStartsAt` | string (ISO-8601 date-time) | Event starting date-time (can be null) |
| `details.eventEndsAt` | string (ISO-8601 date-time) | Event ending date-time (can be null) |
| `details.registrationStartsAt` | string (ISO-8601 date-time) | Registration start date-time (can be null) |
| `details.registrationEndsAt` | string (ISO-8601 date-time) | Registration end date-time (can be null) |
| `details.totalSpots` | integer | Total available capacity/spots (can be null) |

## Error responses

| Status | When | Body |
|--------|------|------|
| `400 Bad Request` | Invalid UUID format for `id` | `ErrorResponse` with detail on failed value conversion |
| `403 Forbidden` | Access token missing, invalid, expired, or user doesn't have the `ADMIN` role | Empty or standard 403 response |
| `404 Not Found` | Course with the specified `{id}` does not exist | `ErrorResponse` with `error: "Recurso não encontrado"` and message: `"Course não encontrado com o ID: <id>"` |
| `500 Internal Server Error` | The `title` field or the `file` part is missing | `ErrorResponse` with `error: "Internal server error"`. Missing-part/missing-parameter failures are not mapped to `400` by the current global handler — they fall through to the generic `500` handler. |

## Example

```http
POST http://localhost:8080/api/courses/8f73b982-61b6-40a7-8f73-b9826a9a4542/files
Authorization: Bearer ADMIN_ACCESS_TOKEN_HERE
Content-Type: multipart/form-data; boundary=boundary123

--boundary123
Content-Disposition: form-data; name="title"

Course Syllabus
--boundary123
Content-Disposition: form-data; name="file"; filename="syllabus.pdf"
Content-Type: application/pdf

[BINARY_DATA]
--boundary123--
```
