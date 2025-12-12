# Neighborly API Documentation

**Base URL:** `https://api.neighborly.in/v2`  
**Version:** v2

---

## Overview

The Neighborly API provides comprehensive services for managing user authentication, profiles, and helper onboarding. This document covers:

- User registration and authentication (Seeker/Helper/Admin)
- Session management via JWT tokens
- Password recovery flows
- Profile management
- Helper onboarding and availability management
- Booking

---

## Authentication Mechanism

The API uses a dual-token system for security:

### 1. Access Token (JWT)
- **Purpose:** Authorize API requests
- **Lifespan:** Short-lived (typically 15 minutes)
- **Usage:** Include in the `Authorization` header of protected endpoints
- **Format:** `Authorization: Bearer <access_token>`

### 2. Refresh Token
- **Purpose:** Obtain new access tokens when they expire
- **Lifespan:** Long-lived (typically 30 days)
- **Storage:** Stored securely in an `httpOnly`, secure cookie named `refreshToken`
- **Security:** Cannot be accessed via JavaScript, protecting against XSS attacks

---

## Standard Response Format

All API responses follow a consistent JSON structure:

### Success Response
```json
{
  "success": true,
  "data": {
    // Requested resources or results
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "A summary of the error that occurred.",
  "details": [
    // Optional array of specific validation field errors
  ]
}
```

---

## Authentication Endpoints

### 1. Register User

Create a new Neighborly account.

- **Endpoint:** `POST /auth/register`
- **Authentication:** None

#### Request Headers
| Header | Value |
|--------|-------|
| `Content-Type` | `application/json` |

#### Request Body
| Field | Type | Required | Description / Validation Rules |
|-------|------|----------|--------------------------------|
| `name` | string | Yes | Full name of the user |
| `email` | string | Yes | Must be a valid, unique email format |
| `password` | string | Yes | Min 8 chars. Must contain at least 1 letter, 1 number, and 1 special character |
| `phone` | string | Yes | Must be exactly 10 digits |
| `city` | string | Yes | User's current city |
| `role` | string | Yes | Must be one of: `seeker`, `helper`, `admin` |

**Example Request:**
```json
{
  "name": "Priya Menon",
  "email": "priya@example.com",
  "password": "SecurePass@123",
  "phone": "9876543210",
  "city": "Kochi",
  "role": "seeker"
}
```

#### Success Response (201 Created)
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6789abc12",
      "name": "Priya Menon",
      "email": "priya@example.com",
      "phone": "9876543210",
      "city": "Kochi",
      "role": "seeker",
      
    },
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci..."
  }
}
```

#### Error Responses
| Status | Error Message | Description |
|--------|--------------|-------------|
| **400** | `Validation failed` | Missing fields, invalid formats, weak password, or phone not 10 digits. See `details` array |
| **409** | `Email already registered` | The provided email address is already in use |

---

### 2. Login

Authenticate a user with email and password to receive access and refresh tokens.

- **Endpoint:** `POST /auth/login`
- **Authentication:** None

#### Request Headers
| Header | Value |
|--------|-------|
| `Content-Type` | `application/json` |

#### Request Body
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Registered email address |
| `password` | string | Yes | User password |

**Example Request:**
```json
{
  "email": "priya@example.com",
  "password": "SecurePass@123"
}
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64f8a...",
      "name": "Priya",
      "email": "priya@example.com",
      "role": "helper",
      "isVerified": true
    },
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci..."
  }
}
```

> **Note:** The refresh token is also set automatically in an `httpOnly` cookie.

#### Error Responses
| Status | Error Message | Description |
|--------|--------------|-------------|
| **400** | `Validation failed` | Missing email or password fields |
| **401** | `Invalid email or password` | Incorrect credentials provided |
| **403** | `Account suspended` | The user account has been banned (`isBanned = true`) |
| **429** | `Too many attempts` | Too many failed login attempts (e.g., >5). Try again later |
| **500** | `Service unavailable` | Internal server or database error |

---

### 3. Google Authentication

Register or login using a Google OAuth2 idToken. If the user does not exist, an account is created automatically.

- **Endpoint:** `POST /auth/google`
- **Authentication:** None

#### Request Headers
| Header | Value |
|--------|-------|
| `Content-Type` | `application/json` |

#### Request Body
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `googleToken` | string | Yes | The raw `id_token` received from Google on the client side |

**Example Request:**
```json
{
  "googleToken": "ya29.a0AfH6SMB..."
}
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6789abc12",
      "name": "Priya Menon",
      "email": "priya@gmail.com",
      "phone": null,
      "city": "Kochi",
      "role": "seeker",
      "isVerified": true,
      "googleId": "1140...",
      "createdAt": "2025-04-05T10:00:00.000Z"
    },
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci..."
  }
}
```

> **Note:** Creates user if new (default role: `seeker`), logs in if existing.

#### Error Responses
| Status | Error Message | Description |
|--------|--------------|-------------|
| **400** | `Invalid or missing Google token` | Token empty or malformed in request body |
| **401** | `Invalid Google token` | Token failed verification against Google servers |
| **403** | `Your account has been suspended` | The associated user account is banned |
| **500** | `Google authentication failed` | Google servers down or internal network issue |

---

### 4. Forgot Password

Initiate the password reset process by sending a secure link to the user's email.

- **Endpoint:** `POST /auth/forgot-password`
- **Authentication:** None

#### Request Body
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Must be a valid email format |

**Example Request:**
```json
{
  "email": "priya@example.com"
}
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "If your email is registered, a reset link has been sent."
}
```

> **Note:** This endpoint always returns success, even if the email is not registered, to prevent email enumeration attacks.

#### Error Responses
| Status | Error Message | Description |
|--------|--------------|-------------|
| **400** | `Invalid email format` | Email field missing or format is incorrect |
| **429** | `Too many requests. Try again later.` | Max 3 forgot-password requests per email per hour |

---

### 5. Reset Password

Set a new password using the secure token received via email.

- **Endpoint:** `POST /auth/reset-password`
- **Authentication:** None

#### Request Body
| Field | Type | Required | Description / Validation Rules |
|-------|------|----------|--------------------------------|
| `token` | string | Yes | The 32-char token received in the email link. Must not be expired (15 min lifespan) |
| `newPassword` | string | Yes | Min 8 chars. Must include at least 1 letter, 1 number, and 1 special character |

**Example Request:**
```json
{
  "token": "abc123xyz789...",
  "newPassword": "NewSecure@2025"
}
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Password reset successful. You can now login."
}
```

> **Note:** On success, all active refresh tokens for the user are invalidated, forcing re-login on all devices.

#### Error Responses
| Status | Error Message | Description |
|--------|--------------|-------------|
| **400** | `Invalid or missing token` | Token not provided or malformed |
| **400** | `Token expired` | The token is older than 15 minutes |
| **400** | `Password too weak` | `newPassword` does not meet complexity requirements |
| **404** | `Reset token not found` | Token does not exist or has already been used |
| **429** | `Too many attempts` | Max 5 reset attempts failed for this token |
| **500** | `Server error` | Unexpected backend issue |

---

### 6. Refresh Token

Obtain a new Access Token using a valid Refresh Token cookie.

- **Endpoint:** `POST /auth/refresh`
- **Authentication:** Cookie (`refreshToken`)

#### Request Headers
| Header | Value | Description |
|--------|-------|-------------|
| `Cookie` | `refreshToken=<token>` | The secure cookie containing the refresh token |

> **Note:** The browser automatically sends the `httpOnly` cookie.

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "expiresIn": 900
  }
}
```

> **Note:** The server may also rotate the refresh token by setting a new cookie in the response.

#### Error Responses
| Status | Error Message | Description |
|--------|--------------|-------------|
| **401** | `Invalid refresh token` | Token malformed or tampered with |
| **401** | `Refresh token expired` | Token is older than the allowed maximum lifespan (e.g., 30 days) |
| **401** | `Refresh token revoked` | Token has already been used or blacklisted |
| **403** | `Account suspended` | User is banned |
| **500** | `Token service unavailable` | Database/verification failure |

---

### 7. Logout

Log out the user by invalidating their current refresh token.

- **Endpoint:** `POST /auth/logout`
- **Authentication:** Cookie (`refreshToken`)

#### Request Headers
| Header | Value | Description |
|--------|-------|-------------|
| `Cookie` | `refreshToken=<token>` | The secure cookie containing the refresh token to invalidate |

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

> **Note:** The server invalidates the specific refresh token used in the request and instructs the browser to clear the cookie.

#### Error Responses
| Status | Error Message | Description |
|--------|--------------|-------------|
| **401** | `Unauthorized` | Missing or invalid refresh token cookie |
| **403** | `Forbidden` | Token belongs to an already logged-out session |
| **500** | `Server Error` | Unexpected DB or token verification issue |

---

## Profile & Helper Onboarding Endpoints

> **Authentication Required:** All endpoints require JWT (`Authorization: Bearer <access_token>`)

---

### 1. Get Current User Profile

Get the profile of the currently logged-in user (seeker or helper).

- **Endpoint:** `GET /profile/me`
- **Authentication:** Required (JWT)

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6789abc12",
      "name": "Priya",
      "email": "priya@gmail.com",
      "phone": "+919876543210",
      "city": "Kochi",
      "role": "helper",
      "isVerified": true,
      "totalJobsCompleted": 42,
      "onboardingStep": "complete"
    },
    "helperProfile": {
      "location": {
        "lat": 9.9816,
        "lng": 76.2998
      },
      "radiusKm": 20,
      "servicesOffered": ["general-2bhk", "deep-3bhk"]
    }
  }
}
```

> **Note:** `helperProfile` is `null` if the user is not a helper.

---

### 2. Update User Profile

Update basic profile information (name, phone, city, location).

- **Endpoint:** `PUT /profile/me`
- **Authentication:** Required (JWT)

#### Request Body
```json
{
  "name": "Priya Menon",
  "phone": "+919876543210",
  "city": "Kochi",
  "location": {
    "lat": 9.9816,
    "lng": 76.2998
  }
}
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6789abc12",
      "name": "Priya Menon",
      "email": "priya@gmail.com",
      "phone": "+919876543210",
      "city": "Kochi",
      "role": "helper",
      "isVerified": true
    }
  }
}
```

---

### 3. Complete Helper Profile

Helper completes or updates their service profile (only for users with role `helper`).

- **Endpoint:** `PUT /helper/profile`
- **Authentication:** Required (JWT, role: `helper`)

#### Request Body
```json
{
  "location": {
    "lat": 9.9816,
    "lng": 76.2998
  },
  "radiusKm": 18,
  "servicesOffered": [
    "64f8a1b2c3d4e5f6789abc01",   // ObjectId of General 1 BHK
    "64f8a1b2c3d4e5f6789abc07",   // ObjectId of Deep 3 BHK
    "64f8a1b2c3d4e5f6789abc99"    // Future: Plumbing AC repair
  ]
}
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "profile": {
      "location": {
        "lat": 9.9816,
        "lng": 76.2998
      },
      "radiusKm": 18,
      "servicesOffered": [
        "64f8a1b2c3d4e5f6789abc01",
        "64f8a1b2c3d4e5f6789abc07"
      ]
    }
  }
}
```

#### Error Responses
| Status | Error Message | Description |
|--------|--------------|-------------|
| **403** | `Forbidden` | User is not a helper |
| **400** | `Invalid radius` | Radius value is invalid or missing |
| **400** | `Missing services` | `servicesOffered` array is empty or invalid |

---

### 4. Set Weekly Availability

Set recurring weekly availability for general and deep cleaning services.

- **Endpoint:** `PUT /helper/availability/weekly`
- **Authentication:** Required (JWT, role: `helper`)

#### Request Body
```json

{
  "weekly_schedule": [
    {
      "day_of_week": 1,                 // Monday (0=Sunday, 6=Saturday)
      "windows": [
        { "from_minutes": 540, "to_minutes": 780 },    
        { "from_minutes": 960, "to_minutes": 1260 }    
      ]     
    },
  
    // … rest of the week
  ]
}
```


#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Weekly availability saved"
}
```

---

### 5. Get Current Availability

Get the helper's current weekly availability and exceptions (blocked dates).

- **Endpoint:** `GET /helper/availability`
- **Authentication:** Required (JWT, role: `helper`)

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "weekly_schedule": [ /* same format as above */ ],
    "exceptions": [
      { "date": "2026-04-09", "blocked": true, "reason": "Vacation" }
    ]
  }
}
```

---

### 6. Add Availability Exception

Block specific dates (holidays, vacation, etc.).

- **Endpoint:** `POST /helper/availability/exceptions`
- **Authentication:** Required (JWT, role: `helper`)

#### Request Body
```json
{
  "date": "2026-04-09",
  "blocked": true,
  "reason": "Family function"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `date` | string | Yes | Date in `YYYY-MM-DD` format |
| `blocked` | boolean | Yes | Whether the date is blocked |
| `reason` | string | No | Reason for blocking the date |

#### Success Response (201 Created)
```json
{
  "success": true,
  "data": {
    "exception": {
      "date": "2026-04-09",
      "blocked": true,
      "reason": "Family function"
    }
  }
}
```

---

### 7. Remove Availability Exception

Remove a previously blocked date.

- **Endpoint:** `DELETE /helper/availability/exceptions/:date`
- **Authentication:** Required (JWT, role: `helper`)

**Example:** `DELETE /helper/availability/exceptions/2026-04-09`

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Exception removed successfully"
}
```

#### Error Responses
| Status | Error Message | Description |
|--------|--------------|-------------|
| **404** | `Exception not found` | No exception exists for the specified date |

---

## Services & Booking Flow Module

> **Authentication Required:** All endpoints require JWT (`Authorization: Bearer <access_token>`) **except** `/services/catalog` (public).

---

```markdown
## Services & Booking Flow Module

> **Authentication Required:** All endpoints require JWT (`Authorization: Bearer <access_token>`) **except** `/services/catalog` (public).

---

### 1. Get Service Catalog

Get the list of all active services. Response fields vary by user role.

- **Endpoint:** `GET /services/catalog`
- **Authentication:** Not required (public)

#### Query Parameters (optional)
- `role=public|seeker|helper|admin` — defaults to `public` if no JWT

#### Success Response (200 OK)

**Public (no token)**
```json
{
  "success": true,
  "data": [
    {
      "name": "General Cleaning - 1 BHK",
      "price": 999
    },
    {
      "name": "Deep Cleaning - 3 BHK",
      "price": 4999
    }
  ]
}
```

**Seeker / Helper**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6789abc01",
      "name": "General Cleaning - 1 BHK",
      "category": "Cleaning",
      "subcategory": "General",
      "price": 999,
      "deposit": 399,
      "duration_minutes": 560,
      "buffer_time": 30
    },
    {
      "_id": "64f8a1b2c3d4e5f6789abc07",
      "name": "Deep Cleaning - 3 BHK",
      "category": "Cleaning",
      "subcategory": "Deep",
      "price": 4999,
      "deposit": 999,
      "duration_minutes": 560,
      "buffer_time": 30
    }
  ]
}
```

**Admin**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6789abc01",
      "code": "gen-1bhk",
      "name": "General Cleaning - 1 BHK",
      "category": "Cleaning",
      "subcategory": "General",
      "price": 999,
      "deposit": 399,
      "duration_minutes": 120,
      "buffer_time": 30,
      "consultation_required":false,
      "isActive": true,
      "createdAt": "2025-12-01T10:00:00.000Z"
    }
  ]
}
```

#### Error Responses
| Status | Response | When |
|--------|----------|------|
| **400** | ```json { "success": false, "error": "Invalid role", "details": [{ "field": "role", "message": "Must be public, seeker, helper or admin" }] } ``` | Invalid `role` query |
| **500** | ```json { "success": false, "error": "Failed to fetch catalog" } ``` | DB error |


---

### 2. Search Available Helpers

Search for verified helpers near the seeker who can perform the selected cleaning service on a specific date.

- **Endpoint:** `GET /api/v1/helpers/search`
- **Authentication:** Required (JWT + role: `seeker`)

#### Query Parameters (all required)
| Param       | Type   | Example                            | Description |
|-------------|--------|------------------------------------|-------------|
| `lat`       | number | `9.9816`                           | Seeker's latitude |
| `lng`       | number | `76.2998`                          | Seeker's longitude |
| `serviceId` | string | `64f8a1b2c3d4e5f6789abc01`         | Service _id from catalog |
| `date`      | string | `2025-12-25`                       | Date in YYYY-MM-DD format |

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "helperId": "helper_123",
      "name": "Reena K.",
      "avatarUrl": "https://res.cloudinary.com/.../reena.jpg",
      "totalJobsCompleted": 67,
      "distanceKm": 2.4,
      "price": 1299,
      "deposit": 399,
      "duration_minutes": 240,
      "duration_slots": 1,
      "slotType": "partial",
      "availableSlots": [1, 2],
      "canBookFullDay": true
    },
    {
      "helperId": "helper_456",
      "name": "Lakshmi P.",
      "distanceKm": 5.1,
      "price": 1299,
      "deposit": 399,
      "duration_minutes": 240,
      "duration_slots": 1,
      "slotType": "partial",
      "availableSlots": [1, 2, 3],
      "canBookFullDay": true
    }
  ]
}
Error Responses

Status,Response,When
400,Invalid latitude/longitude,Wrong coordinates
400,Service not found,Invalid serviceId
400,Date must be in future,Past date
400,Invalid date format,Not YYYY-MM-DD
404,No helpers found,Zero results (still return 200 with empty array for better UX)
500,Failed to search helpers,DB error


```
---


## Common Error Codes

| Status Code | Meaning |
|------------|---------|
| **200** | OK - Request succeeded |
| **201** | Created - Resource successfully created |
| **400** | Bad Request - Invalid input or validation error |
| **401** | Unauthorized - Missing or invalid authentication token |
| **403** | Forbidden - User doesn't have permission or account is suspended |
| **404** | Not Found - Resource doesn't exist |
| **409** | Conflict - Resource already exists (e.g., duplicate email) |
| **429** | Too Many Requests - Rate limit exceeded |
| **500** | Internal Server Error - Unexpected server error |

---

## Security Best Practices

1. **Always use HTTPS** in production to protect tokens in transit
2. **Store access tokens securely** (memory, not localStorage) on the client
3. **Never expose refresh tokens** to JavaScript - they're httpOnly cookies
4. **Implement token rotation** - refresh tokens should be rotated on use
5. **Set appropriate CORS policies** to prevent unauthorized domains from accessing the API
6. **Validate all input** on both client and server side
7. **Use rate limiting** to prevent brute force attacks
8. **Log security events** for monitoring and auditing

---

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Login attempts:** Max 5 failed attempts per email per hour
- **Forgot password:** Max 3 requests per email per hour
- **Reset password:** Max 5 attempts per token
- **General API calls:** Varies by endpoint (typically 100-1000 requests/hour per user)

When rate limited, the API returns a `429 Too Many Requests` status with details about when to retry.

---

## Webhook Events (Future Enhancement)

The following webhook events may be implemented in future versions:

- `user.registered` - New user registration
- `user.verified` - User email verification completed
- `helper.onboarded` - Helper completed onboarding
- `availability.updated` - Helper availability changed
- `password.reset` - Password reset completed

---

## Support

For API support or to report issues:
- **Email:** support@neighborly.in
- **Documentation:** https://docs.neighborly.in
- **Status Page:** https://status.neighborly.in

---

**Document Version:** 2.0  
**Last Updated:** December 2025