# API Contract — `GET /courses/{id}`

Retrieves details of a specific course, including its links and uploaded files, by its unique ID.

> Shared context (base URL, auth model, error shape): see [`README.md`](../README.md).

## Summary

| Item | Value |
|------|-------|
| Method / Path | `GET /courses/{id}` |
| Base URL (local) | `http://localhost:8080/api` |
| Auth required | **Yes** — valid accessToken (any role) |
| Path parameters | `id` (UUID) - Unique course identifier |
| Query parameters | None |
| Request body | None |

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string (UUID) | **Yes** | The UUID of the course to retrieve. |

## Request headers

| Header | Value | Required |
|--------|-------|----------|
| `Authorization` | `Bearer <accessToken>` | Yes |

## Success response — `200 OK`

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
  "instructorId": "9d787ce5-f0dd-47b1-86d3-645dbf70079a",
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
| `name` | string | Course name |
| `description` | string | Course description (can be null) |
| `category` | string (enum) | One of: `FORMACAO`, `CURSO_LIVRE` |
| `type` | string (enum) | One of: `ONLINE`, `IN_PERSON` |
| `active` | boolean | Whether the course is active |
| `price` | number (decimal) | Price of the course (can be null) |
| `duration` | string | Course duration (can be null) |
| `instructorId` | string (UUID) | Unique instructor identifier (can be null) |
| `thumbnailUrl` | string (URL) | Public URL of the course thumbnail image (can be null) |
| `links` | array (object) | Associated external links for this course |
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
| `400 Bad Request` | Invalid UUID format for `{id}` | `ErrorResponse` with details on failed value conversion |
| `403 Forbidden` | Access token missing, invalid, or expired | Empty or standard 403 response |
| `404 Not Found` | Course with the specified `{id}` does not exist | `ErrorResponse` with `error: "Recurso não encontrado"` and message: `"Course não encontrado com o ID: <id>"` |

## Example

```http
GET http://localhost:8080/api/courses/8f73b982-61b6-40a7-8f73-b9826a9a4542
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```
