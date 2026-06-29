# API Contract — `POST /charges/update-payment`

Updates the payment method of a course purchase for the **authenticated** student. It **cancels** the student's open, unpaid charges for the course (status `PENDENTE` or `VENCIDO` → `CANCELADA`) and **creates a new charge** in the `paymentMethod` sent in the body, returning the new Asaas payment link. The user is taken from the JWT — never passed in the request. A **paid** charge is never cancelled: if the course is already purchased, the request is rejected with `409`.

> Shared context (base URL, auth model, error shape): see [`README.md`](../README.md).

## Summary

| Item | Value |
|------|-------|
| Method / Path | `POST /charges/update-payment` |
| Base URL (local) | `http://localhost:8080/api` |
| Auth required | **Yes** — valid accessToken |
| Path parameters | None |
| Query parameters | None |
| Request body | `application/json` |

## Request headers

| Header | Value | Required |
|--------|-------|----------|
| `Authorization` | `Bearer <accessToken>` | Yes |
| `Content-Type` | `application/json` | Yes |

## Request body

```json
{
  "courseId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "paymentMethod": "CREDIT_CARD",
  "callbackUrl": "https://app.institutoesc.com.br/cursos/obrigado"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `courseId` | string (UUID) | Yes | Id of the course whose purchase is being switched. |
| `paymentMethod` | string (enum) | Yes | New payment method for the charge. One of: `PIX`, `BOLETO`, `CREDIT_CARD`. `CREDIT_CARD` enables installments (up to 3x); `PIX`/`BOLETO` are single payments. A value outside this set returns `400`. |
| `callbackUrl` | string | No | Absolute http(s) URL the Asaas page redirects the student to after paying. If omitted, the student stays on the Asaas confirmation screen. A non-http(s) value returns `400`. |

## Success response — `200 OK`

```json
{
  "invoiceUrl": "https://sandbox.asaas.com/c/def456"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `invoiceUrl` | string | Asaas hosted payment page URL for the **newly created** charge, locked to the chosen `paymentMethod`. Redirect the student here to pay. |

## Behavior notes

- The open, unpaid charges (`PENDENTE`, `VENCIDO`) for this user + course are set to `CANCELADA` before the new charge is created.
- Charges already in a terminal state (`CANCELADA`, `ESTORNADA`) are left untouched, preserving their history.
- A new `PENDENTE` charge is always created, even when the chosen method matches a charge that was just cancelled. The previous Asaas link is no longer valid for this purchase — use the returned `invoiceUrl`.
- After this call, `GET /charges/courses/{courseId}` reports the new charge (it is the most recently created one).

## Error responses

| Status | When | Body (`error` / `message`) |
|--------|------|-----------------------------|
| `400 Bad Request` | `courseId` or `paymentMethod` missing/invalid, or `callbackUrl` is not an absolute http(s) URL | `ErrorResponse` with `Bad Request` (validation) or `Invalid callback URL` |
| `400 Bad Request` | Course is not purchasable (`active = false` or `price <= 0`) | `ErrorResponse` with `Course not purchasable` / `This course is not available for purchase.` |
| `403 Forbidden` | Token absent, invalid or expired | standard 403 response |
| `404 Not Found` | `courseId` does not match any course | `ErrorResponse` with `Course not found: <courseId>` |
| `409 Conflict` | The student already has a `PAGA` charge for this course | `ErrorResponse` with `Course already purchased` / `You have already purchased this course.` |

Example error body:

```json
{
  "timestamp": "2026-06-28T14:30:00.123",
  "status": 409,
  "error": "Course already purchased",
  "message": "You have already purchased this course."
}
```

## Examples

### Example 1 — switch to credit card

```http
POST http://localhost:8080/api/charges/update-payment
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
Content-Type: application/json

{
  "courseId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "paymentMethod": "CREDIT_CARD"
}
```

### Example 2 — switch to PIX with a return URL

```http
POST http://localhost:8080/api/charges/update-payment
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
Content-Type: application/json

{
  "courseId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "paymentMethod": "PIX",
  "callbackUrl": "https://app.institutoesc.com.br/cursos/obrigado"
}
```

### Example response — success

```json
{
  "invoiceUrl": "https://sandbox.asaas.com/c/def456"
}
```

### Example response — error (already purchased)

```json
{
  "timestamp": "2026-06-28T14:30:00.123",
  "status": 409,
  "error": "Course already purchased",
  "message": "You have already purchased this course."
}
```
