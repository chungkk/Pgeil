# Authentication API Contract

**Version**: 1.0  
**Base URL**: `/api/auth/mobile`  
**Authentication**: Public (login/register), Bearer token (refresh/logout)

---

## Endpoints

### 1. Login

**POST** `/api/auth/mobile/login`

Authenticate user with email/password and return JWT tokens.

#### Request

```http
POST /api/auth/mobile/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

#### Response (Success)

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "name": "John Doe",
      "avatar": "https://example.com/avatar.jpg",
      "preferredLanguage": "vi",
      "theme": "light",
      "playbackSpeed": 1,
      "totalLessonsCompleted": 5,
      "totalPracticeTime": 3600,
      "averageAccuracyScore": 85,
      "currentStreak": 3,
      "totalPoints": 450
    }
  },
  "message": "Login successful"
}
```

#### Response (Error - Invalid Credentials)

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email or password is incorrect"
  }
}
```

#### Response (Error - Email Not Verified)

```http
HTTP/1.1 403 Forbidden
Content-Type: application/json

{
  "success": false,
  "error": {
    "code": "EMAIL_NOT_VERIFIED",
    "message": "Please verify your email before logging in"
  }
}
```

---

### 2. Register

**POST** `/api/auth/mobile/register`

Create a new user account.

#### Request

```http
POST /api/auth/mobile/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "SecurePass123!",
  "name": "Jane Doe",
  "preferredLanguage": "vi"
}
```

#### Response (Success)

```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "success": true,
  "data": {
    "userId": "507f1f77bcf86cd799439012",
    "email": "newuser@example.com",
    "name": "Jane Doe"
  },
  "message": "Registration successful. Please check your email for verification link."
}
```

#### Response (Error - Email Already Exists)

```http
HTTP/1.1 409 Conflict
Content-Type: application/json

{
  "success": false,
  "error": {
    "code": "EMAIL_EXISTS",
    "message": "An account with this email already exists"
  }
}
```

#### Response (Error - Validation)

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": {
      "password": "Password must be at least 8 characters",
      "email": "Invalid email format"
    }
  }
}
```

---

### 3. Google OAuth Login

**POST** `/api/auth/mobile/google`

Authenticate using Google OAuth ID token.

#### Request

```http
POST /api/auth/mobile/google
Content-Type: application/json

{
  "idToken": "ya29.a0AfH6SMBx..."
}
```

#### Response (Success)

Same as `/login` response structure.

#### Response (Error - Invalid Token)

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "success": false,
  "error": {
    "code": "INVALID_TOKEN",
    "message": "Google ID token is invalid or expired"
  }
}
```

---

### 4. Refresh Token

**POST** `/api/auth/mobile/refresh`

Exchange refresh token for new access token.

#### Request

```http
POST /api/auth/mobile/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Response (Success)

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // New token
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // Rotated token
  },
  "message": "Token refreshed successfully"
}
```

#### Response (Error - Invalid Refresh Token)

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "success": false,
  "error": {
    "code": "INVALID_REFRESH_TOKEN",
    "message": "Refresh token is invalid or expired"
  }
}
```

---

### 5. Logout

**POST** `/api/auth/mobile/logout`

Invalidate refresh token (revoke session).

#### Request

```http
POST /api/auth/mobile/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Response (Success)

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "message": "Logout successful"
}
```

---

### 6. Request Password Reset

**POST** `/api/auth/mobile/reset-password`

Request password reset email.

#### Request

```http
POST /api/auth/mobile/reset-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Response (Success)

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "message": "Password reset email sent. Please check your inbox."
}
```

**Note**: Returns success even if email doesn't exist (security best practice to prevent email enumeration).

---

### 7. Verify Email

**GET** `/api/auth/mobile/verify-email?token={verificationToken}`

Verify user email address.

#### Request

```http
GET /api/auth/mobile/verify-email?token=abc123def456
```

#### Response (Success)

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "message": "Email verified successfully. You can now log in."
}
```

#### Response (Error - Invalid/Expired Token)

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "success": false,
  "error": {
    "code": "INVALID_VERIFICATION_TOKEN",
    "message": "Verification token is invalid or expired"
  }
}
```

---

## Data Models

### User (Response)

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  preferredLanguage: 'de' | 'vi' | 'en';
  theme: 'light' | 'dark';
  playbackSpeed: 0.5 | 0.75 | 1 | 1.25 | 1.5;
  totalLessonsCompleted: number;
  totalPracticeTime: number; // seconds
  averageAccuracyScore: number; // 0-100
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
  emailVerified: boolean;
  createdAt: string; // ISO 8601
}
```

### JWT Payload

```typescript
interface JWTPayload {
  userId: string;
  email: string;
  iat: number; // Issued at
  exp: number; // Expires at
}
```

**Access Token**: Expires in 15 minutes  
**Refresh Token**: Expires in 30 days

---

## Security Notes

1. **Password Requirements**:
   - Minimum 8 characters
   - At least one uppercase letter
   - At least one number
   - At least one special character

2. **Rate Limiting**:
   - Login: 10 attempts per 15 minutes per IP
   - Register: 5 attempts per hour per IP
   - Password reset: 3 requests per hour per email

3. **Token Storage** (Mobile):
   - Access token: In-memory only (lost on app close)
   - Refresh token: SecureStore (encrypted)

4. **Token Rotation**:
   - Refresh tokens are rotated on each refresh request
   - Old refresh token is invalidated immediately

5. **HTTPS Only**:
   - All endpoints must be accessed over HTTPS in production

---

## Error Codes Summary

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_CREDENTIALS` | 401 | Email/password mismatch |
| `EMAIL_NOT_VERIFIED` | 403 | User must verify email first |
| `EMAIL_EXISTS` | 409 | Email already registered |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `INVALID_TOKEN` | 401 | Google OAuth token invalid |
| `INVALID_REFRESH_TOKEN` | 401 | Refresh token invalid/expired |
| `INVALID_VERIFICATION_TOKEN` | 400 | Email verification token invalid |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |

---

## Testing Scenarios

1. **Happy Path**: Register → Verify email → Login → Use access token → Refresh → Logout
2. **Invalid Credentials**: Login with wrong password
3. **Token Expiry**: Wait 15 minutes, access token expires, auto-refresh
4. **Multiple Devices**: Login on two devices, logout from one doesn't affect other
5. **Rate Limiting**: Attempt 11 logins in 15 minutes, expect 429 on 11th

---

## Implementation Notes (Backend)

**File**: `ppgeil/pages/api/auth/mobile/*.ts`

```typescript
// /api/auth/mobile/login.ts
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const { email, password } = req.body;
  
  // 1. Find user
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: '...' } });
  
  // 2. Verify password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: '...' } });
  
  // 3. Check email verified
  if (!user.emailVerified) return res.status(403).json({ error: { code: 'EMAIL_NOT_VERIFIED', message: '...' } });
  
  // 4. Generate tokens
  const accessToken = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
  
  // 5. Store refresh token
  user.refreshTokens.push({ token: refreshToken, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) });
  await user.save();
  
  // 6. Return response
  res.status(200).json({
    success: true,
    data: {
      accessToken,
      refreshToken,
      user: { /* user data */ }
    }
  });
}
```

---

## Next Steps

✅ **Auth API contract complete**  
→ **Implement backend endpoints** (`ppgeil/pages/api/auth/mobile/`)  
→ **Implement mobile auth service** (`react-native/src/services/api/auth.ts`)  
→ **Setup Axios interceptor** for auto-refresh
