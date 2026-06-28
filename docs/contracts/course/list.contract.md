# API Contract — `GET /courses`

Retrieves a paginated list of active courses. The results can be filtered by name, type, and category.

> Shared context (base URL, auth model, error shape): see [`README.md`](../README.md).

## Summary

| Item | Value |
|------|-------|
| Method / Path | `GET /courses` |
| Base URL (local) | `http://localhost:8080/api` |
| Auth required | **Yes** — valid accessToken (any role) |
| Path parameters | None |
| Query parameters | `name`, `type`, `category`, `page`, `size`, `sort` |
| Request body | None |

## Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `name` | string | No | - | Case-insensitive partial name match (e.g. `java`). |
| `type` | string (enum) | No | - | Filter by type: `ONLINE` or `IN_PERSON`. |
| `category` | string (enum) | No | - | Filter by category: `FORMACAO` or `CURSO_LIVRE`. |
| `page` | integer | No | `0` | Page index (0-indexed). |
| `size` | integer | No | `20` | Number of items per page. |
| `sort` | string | No | - | Sort parameters. Format: `property(,asc\|desc)`. Example: `name,asc`. Multiple sort parameters can be provided. |

## Request headers

| Header | Value | Required |
|--------|-------|----------|
| `Authorization` | `Bearer <accessToken>` | Yes |

## Success response — `200 OK`

```json
{
  "content": [
    {
      "id": "8f73b982-61b6-40a7-8f73-b9826a9a4542",
      "name": "Formação Java Fullstack",
      "description": "A complete Java course from zero to hero",
      "category": "FORMACAO",
      "thumbnailUrl": "https://s3.amazonaws.com/bucket/courses/thumbnails/java-thumbnail.png",
      "type": "ONLINE"
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 20,
    "sort": {
      "empty": false,
      "sorted": true,
      "unsorted": false
    },
    "offset": 0,
    "paged": true,
    "unpaged": false
  },
  "totalPages": 1,
  "totalElements": 1,
  "last": true,
  "size": 20,
  "number": 0,
  "sort": {
    "empty": false,
    "sorted": true,
    "unsorted": false
  },
  "numberOfElements": 1,
  "first": true,
  "empty": false
}
```

### Response Schema

| Field | Type | Description |
|-------|------|-------------|
| `content` | array (object) | List of courses in the current page |
| `content[].id` | string (UUID) | Unique course identifier |
| `content[].name` | string | Course name |
| `content[].description` | string | Course description |
| `content[].category` | string (enum) | Course category: `FORMACAO` or `CURSO_LIVRE` |
| `content[].type` | string (enum) | Course type: `ONLINE` or `IN_PERSON` |
| `content[].thumbnailUrl` | string (URL) | Public URL of the course thumbnail image |
| `pageable` | object | Pagination request settings details |
| `pageable.pageNumber` | integer | Page index (0-indexed) |
| `pageable.pageSize` | integer | Page size limit |
| `totalPages` | integer | Total pages available given the current page size |
| `totalElements` | integer | Total matching courses in the database |
| `last` | boolean | `true` if this is the last page |
| `size` | integer | Page size limit (mirrors `pageable.pageSize`) |
| `number` | integer | Current page index (mirrors `pageable.pageNumber`) |
| `numberOfElements` | integer | Number of items returned in the current page |
| `first` | boolean | `true` if this is the first page |
| `empty` | boolean | `true` if no records were found on this page |

## Error responses

| Status | When | Body |
|--------|------|------|
| `400 Bad Request` | Invalid query parameter value (e.g. invalid type/category or non-integer pagination) | `ErrorResponse` with detail on type mismatch or translation error |
| `403 Forbidden` | Access token missing, invalid, or expired | Empty or standard 403 response |

## Example

```http
GET http://localhost:8080/api/courses?name=java&category=FORMACAO&page=0&size=10&sort=name,asc
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```
