# API Contracts: Mobile Backend Communication

**Feature**: React Native Migration  
**Date**: 2024-12-17  
**Status**: Phase 1

## Overview

This directory contains OpenAPI 3.0 specifications for all mobile-backend API endpoints. The mobile app communicates with the existing Next.js backend via REST APIs.

**Base URL**: `https://api.papageil.com` (production) / `http://localhost:3000` (development)

**Authentication**: JWT Bearer tokens in `Authorization` header

---

## API Domains

### 1. Authentication (`auth-api.md`)
Mobile-specific authentication endpoints (JWT + refresh tokens)
- Login (email/password, Google OAuth)
- Token refresh
- Logout
- Password reset

### 2. Lessons (`lessons-api.md`)
Lesson management, streaming, and downloads
- List lessons (with filters)
- Get lesson details
- Stream URLs (online playback)
- Download preparation (offline)
- Progress tracking

### 3. Dictionary (`dictionary-api.md`)
Word lookup with caching
- Lookup word
- Get cached definitions

### 4. Progress (`progress-api.md`)
User progress tracking
- Update progress
- Get user progress
- Statistics

### 5. Pronunciation (`pronunciation-api.md`)
Recording upload and scoring
- Upload recording
- Get pronunciation feedback

### 6. Leaderboard (`leaderboard-api.md`)
Rankings and achievements
- Get leaderboard
- Get user achievements

### 7. Vocabulary (`vocabulary-api.md`)
Personal vocabulary management
- Save word
- Get vocabulary list
- Mark as learned

---

## Common Response Structures

### Success Response
```json
{
  "success": true,
  "data": { /* resource data */ },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { /* additional context */ }
  }
}
```

### Pagination
```json
{
  "success": true,
  "data": [ /* items */ ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

## Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid auth token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |
| `SERVICE_UNAVAILABLE` | 503 | External service (YouTube, OpenAI) unavailable |

---

## Authentication Flow

1. **Login**: `POST /api/auth/mobile/login` → Returns `accessToken` + `refreshToken`
2. **API Requests**: Include `Authorization: Bearer {accessToken}` header
3. **Token Expiry**: When 401 received, call `POST /api/auth/mobile/refresh`
4. **Refresh**: Send `refreshToken` → Get new `accessToken` + rotated `refreshToken`
5. **Logout**: `POST /api/auth/mobile/logout` → Invalidate refresh token

---

## Rate Limits

| Endpoint Group | Limit | Window |
|----------------|-------|--------|
| Authentication | 10 requests | 15 minutes |
| Lessons (list/get) | 100 requests | 1 minute |
| Streaming | 50 requests | 1 minute |
| Dictionary | 60 requests | 1 minute |
| Pronunciation | 20 uploads | 1 hour |
| Progress updates | 100 requests | 1 minute |

---

## File Specifications

### [auth-api.md](./auth-api.md)
Mobile authentication endpoints (JWT-based)

### [lessons-api.md](./lessons-api.md)
Lesson CRUD, streaming, and downloads

### [dictionary-api.md](./dictionary-api.md) *(TBD)*
Dictionary lookups and caching

### [progress-api.md](./progress-api.md) *(TBD)*
Progress tracking and statistics

### [pronunciation-api.md](./pronunciation-api.md) *(TBD)*
Recording upload and pronunciation scoring

### [leaderboard-api.md](./leaderboard-api.md) *(TBD)*
Rankings and achievements

### [vocabulary-api.md](./vocabulary-api.md) *(TBD)*
Personal vocabulary management

---

## Development Notes

1. **Backward Compatibility**: Existing web API routes are preserved; mobile endpoints are additive
2. **API Versioning**: Not implemented initially; consider `/api/v1/` prefix if breaking changes needed
3. **CORS**: Backend must allow mobile app origin (React Native requests)
4. **File Uploads**: Use `multipart/form-data` for recording uploads
5. **Streaming**: Use signed temporary URLs (expire after 1 hour)
6. **Offline Sync**: Client queues mutations while offline, syncs on reconnect

---

## Testing

Use the provided Postman/Insomnia collection:
- `postman-collection.json` (TBD)
- Test all endpoints with mock JWT tokens
- Verify error responses and edge cases

---

## Next Steps

✅ **Contracts directory created**  
✅ **README documented**  
→ **Generate individual API spec files** (auth-api.md, lessons-api.md, etc.)
