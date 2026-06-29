# API Contract — `GET /charges/courses/{courseId}`

Returns whether the **authenticated** student already has a charge (payment) for a given course, and its current state. The user is taken from the JWT — never passed in the request. When more than one charge exists for the course (there can be one pending charge per payment method), the endpoint always reports the **most recently created** charge, regardless of status.

> Shared context (base URL, auth model, error shape): see [`README.md`](../README.md).

## Summary

| Item | Value |
|------|-------|
| Method / Path | `GET /charges/courses/{courseId}` |
| Base URL (local) | `http://localhost:8080/api` |
| Auth required | **Yes** — valid accessToken |
| Path parameters | `courseId` |
| Query parameters | None |
| Request body | None |

## Request headers

| Header | Value | Required |
|--------|-------|----------|
| `Authorization` | `Bearer <accessToken>` | Yes |

## Path parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `courseId` | string (UUID) | Yes | Id of the course to check. Must be a valid UUID; a malformed value returns `400`. |

## Success response — `200 OK`

Returned whether or not a charge exists. When no charge exists, `hasPayment` is `false` and `status`, `invoiceUrl` and `paymentMethod` are `null`.

```json
{
  "courseId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "hasPayment": true,
  "paid": false,
  "status": "PENDENTE",
  "invoiceUrl": "https://sandbox.asaas.com/c/abc123",
  "paymentMethod": "CREDIT_CARD"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `courseId` | string (UUID) | The course id echoed from the path. |
| `hasPayment` | boolean | `true` when the student has at least one charge for this course (any status); `false` otherwise. |
| `paid` | boolean | `true` when there is a charge with status `PAGA` (course already purchased). |
| `status` | string (enum) \| null | Status of the reported charge. One of: `PENDENTE` (awaiting payment), `PAGA` (paid), `VENCIDO` (overdue), `CANCELADA` (cancelled), `ESTORNADA` (refunded/charged back). `null` when `hasPayment` is `false`. |
| `invoiceUrl` | string \| null | Asaas hosted payment page URL. Present **only** when the reported charge is `PENDENTE`, so the frontend can redirect the student to finish paying. `null` otherwise. |
| `paymentMethod` | string (enum) \| null | Payment method chosen for the reported charge. One of: `PIX`, `BOLETO`, `CREDIT_CARD`. `null` when `hasPayment` is `false`, or when the charge was created before this field existed. |

### Selection rule when multiple charges exist

The endpoint always reports the **most recently created** charge (highest `createdAt`) for this user + course, regardless of its status. `paid` reflects that charge's status (`true` only when it is `PAGA`), and `invoiceUrl` is set only when that charge is `PENDENTE`.

## Error responses

| Status | When | Body (`error` / `message`) |
|--------|------|-----------------------------|
| `400 Bad Request` | `courseId` is not a valid UUID | `ErrorResponse` with `Bad Request` / type conversion message |
| `403 Forbidden` | Token absent, invalid or expired | standard 403 response |

> Note: a `courseId` that is a valid UUID but does not match any course (or any charge) is **not** an error — the endpoint returns `200 OK` with `hasPayment: false`.

Example error body:

```json
{
  "timestamp": "2026-06-28T14:30:00.123",
  "status": 400,
  "error": "Bad Request",
  "message": "Failed to convert value of type 'java.lang.String' to required type 'java.util.UUID'"
}
```

## Examples

### Example 1 — basic request

```http
GET http://localhost:8080/api/charges/courses/3fa85f64-5717-4562-b3fc-2c963f66afa6
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```

### Example response — pending charge (resume payment)

```json
{
  "courseId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "hasPayment": true,
  "paid": false,
  "status": "PENDENTE",
  "invoiceUrl": "https://sandbox.asaas.com/c/abc123",
  "paymentMethod": "PIX"
}
```

### Example response — already purchased

```json
{
  "courseId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "hasPayment": true,
  "paid": true,
  "status": "PAGA",
  "invoiceUrl": null,
  "paymentMethod": "CREDIT_CARD"
}
```

### Example response — no charge yet

```json
{
  "courseId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "hasPayment": false,
  "paid": false,
  "status": null,
  "invoiceUrl": null,
  "paymentMethod": null
}
```

### Example response — error (missing/invalid token)

```json
{
  "timestamp": "2026-06-28T14:30:00.123",
  "status": 403,
  "error": "Forbidden",
  "message": "Access Denied"
}
```
