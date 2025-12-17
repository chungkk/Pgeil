# Research & Technology Decisions: React Native Migration

**Feature**: Native iOS German Learning App  
**Date**: 2024-12-17  
**Status**: Phase 0 Complete

## Overview

This document resolves all "NEEDS CLARIFICATION" items from the Technical Context and documents technology choices for the React Native migration.

---

## 1. Audio/Video Playback Library

### Decision: **react-native-track-player** (Primary) + **react-native-video** (Fallback for YouTube)

### Rationale

**react-native-track-player** is selected for audio playback and background audio because:
- ✅ Robust background audio support (critical for shadowing exercises)
- ✅ Built-in support for remote control (lock screen, control center)
- ✅ Playback speed control (0.5x-1.5x as per spec)
- ✅ Progress tracking and seek functionality
- ✅ Excellent iOS support with native Media Player integration
- ✅ Active maintenance and large community

**react-native-video** is used for YouTube video playback because:
- ✅ Direct video URL support (extracted via backend)
- ✅ Synchronized subtitle/transcript display
- ✅ Lightweight for video-only scenarios
- ✅ Better control over playback compared to WebView

### Alternatives Considered

| Option | Pros | Cons | Rejected Because |
|--------|------|------|------------------|
| **expo-av** | All-in-one solution, simpler setup, Expo SDK integration | Requires Expo, heavier bundle, less control over background audio | We're using bare React Native for better native control; expo-av background audio limitations |
| **react-native-sound** | Lightweight, simple API | No background support, no video, minimal features | Insufficient for our complex audio requirements (background, speed control, seek) |
| **Native iOS AVPlayer** | Maximum control, best performance | Requires native bridge code, maintenance burden | react-native-track-player already provides excellent native integration |

### Implementation Notes

- Use `react-native-track-player` for:
  - Shadowing audio playback (background-enabled)
  - Dictation audio prompts
  - Pronunciation comparison audio
- Use `react-native-video` for:
  - YouTube video display in lesson detail
  - Synchronized transcript highlighting
- Download manager will cache both audio (m4a) and video (mp4) streams

---

## 2. YouTube Integration Strategy

### Decision: **Backend Streaming + react-native-video** (Hybrid Approach)

### Rationale

Given the clarification that **YouTube is the video source**, we'll use a hybrid approach:

1. **Online Mode**: Backend extracts YouTube stream URLs using existing `@distube/ytdl-core` and `youtubei.js`, returns signed temporary URLs to mobile app
2. **Offline Mode**: Backend pre-processes and caches audio/video files, mobile app downloads these cached files
3. **Mobile Player**: `react-native-video` plays the stream URLs (online) or local files (offline)

**Why this approach**:
- ✅ Complies with YouTube ToS (server-side processing only)
- ✅ Reuses existing backend YouTube extraction logic
- ✅ Avoids rate limits (backend manages this)
- ✅ Enables offline support (spec requirement FR-013)
- ✅ No WebView needed (better performance, native UX)
- ✅ Mobile app doesn't need YouTube API keys

### Alternatives Considered

| Option | Pros | Cons | Rejected Because |
|--------|------|------|------------------|
| **react-native-youtube-iframe** | Official YouTube support, WebView-based | Requires internet, no offline, poor performance, limited playback control | Cannot support offline (10-lesson download requirement), WebView performance issues |
| **Custom WebView** | Simple implementation | Poor UX, limited control, no offline, slow | Same issues as iframe approach, violates native UX goal |
| **Direct YouTube API** | Direct access | Rate limits, no offline, complex mobile auth, ToS complications | Offline support impossible, rate limit risks |
| **Fully cached on backend** | Simple mobile app | Massive storage costs, copyright concerns | Storage costs prohibitive for hundreds of lessons |

### Implementation Notes

**Backend API** (`/api/lessons/[id]/stream`):
```typescript
// Returns temporary stream URLs for online playback
GET /api/lessons/[lessonId]/stream
Response: {
  video: "https://backend.com/stream/video/[signed-url]",
  audio: "https://backend.com/stream/audio/[signed-url]",
  expiresAt: "2024-12-17T12:00:00Z"
}
```

**Backend API** (`/api/lessons/[id]/download`):
```typescript
// Pre-processes and returns downloadable files
GET /api/lessons/[lessonId]/download
Response: {
  video: "https://backend.com/downloads/[lesson-id]-video.mp4",
  audio: "https://backend.com/downloads/[lesson-id]-audio.m4a",
  transcript: { ... },
  size: 45678910  // bytes
}
```

**Mobile Implementation**:
- Online: Fetch stream URLs from `/stream` endpoint, play via `react-native-video`
- Download: Fetch from `/download` endpoint, save to `FileSystem.documentDirectory`
- Offline: Load local files, play via `react-native-video`

---

## 3. E2E Testing Framework

### Decision: **Detox**

### Rationale

**Detox** is selected for end-to-end testing because:
- ✅ React Native-native (built by Wix for React Native)
- ✅ Gray-box testing (synchronization with React Native internals)
- ✅ Excellent iOS simulator support
- ✅ Fast execution (waits intelligently for animations/async ops)
- ✅ Jest integration (consistent with unit tests)
- ✅ Better developer experience for React Native projects

### Alternatives Considered

| Option | Pros | Cons | Rejected Because |
|--------|------|------|------------------|
| **Appium** | Cross-platform, mature, black-box testing | Slower, setup complexity, flaky, less React Native integration | Overkill for iOS-only app, slower execution, more brittle tests |
| **Manual Testing** | No setup, flexible | Not scalable, regression prone, time-consuming | Violates testing best practices, not sustainable for CI/CD |
| **Maestro** | Simple YAML config, fast | Newer (less mature), smaller community | Detox more established, better docs for React Native |

### Implementation Notes

**Test Structure**:
```text
__tests__/
├── unit/                      # Jest
│   ├── components/
│   ├── services/
│   └── utils/
├── integration/               # Jest + React Native Testing Library
│   ├── auth-flow.test.ts
│   ├── lesson-playback.test.ts
│   └── offline-sync.test.ts
└── e2e/                       # Detox
    ├── login.e2e.ts
    ├── lesson-shadowing.e2e.ts
    ├── dictation.e2e.ts
    └── offline-download.e2e.ts
```

**Detox Config** (`.detoxrc.js`):
```javascript
module.exports = {
  testRunner: 'jest',
  runnerConfig: 'e2e/config.json',
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/PapaGeil.app',
      build: 'xcodebuild -workspace ios/PapaGeil.xcworkspace -scheme PapaGeil -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build'
    }
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: { type: 'iPhone 14' }
    }
  }
};
```

---

## 4. Backend Testing Strategy

### Decision: **Jest + Supertest** (API Testing) + Existing Setup

### Rationale

For the existing Next.js backend:
- ✅ **Jest**: Already in devDependencies, industry standard for Node.js
- ✅ **Supertest**: HTTP assertion library, perfect for API endpoint testing
- ✅ **MongoDB Memory Server**: In-memory MongoDB for test isolation
- ✅ **Minimal disruption**: Works with existing Next.js API routes

**Why not change backend testing**:
- Backend is stable (72 existing routes)
- Migration focus is mobile app
- Only minor backend changes needed (mobile auth endpoints)
- Existing patterns should be preserved

### Implementation Notes

**Add to backend** (`ppgeil/package.json`):
```json
{
  "devDependencies": {
    "jest": "^29.7.0",
    "@types/jest": "^29.5.0",
    "supertest": "^6.3.3",
    "@types/supertest": "^2.0.12",
    "mongodb-memory-server": "^9.1.0"
  },
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

**Test Structure** (`ppgeil/__tests__/`):
```text
__tests__/
├── api/
│   ├── auth.test.ts
│   ├── lessons.test.ts
│   ├── progress.test.ts
│   └── pronunciation.test.ts
├── lib/
│   ├── mongodb.test.ts
│   └── auth.test.ts
└── models/
    ├── User.test.ts
    └── Lesson.test.ts
```

**Example Test**:
```typescript
import request from 'supertest';
import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/lessons/[id]';

describe('/api/lessons/[id]', () => {
  it('returns lesson with valid ID', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { id: 'test-lesson-id' }
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toHaveProperty('title');
  });
});
```

---

## 5. React Native Project Setup Approach

### Decision: **Bare React Native** (not Expo)

### Rationale

Based on the REACT_NATIVE_MIGRATION_PLAN.md analysis, **Bare React Native** is recommended because:
- ✅ Full control over native modules (audio, video, file system)
- ✅ Smaller bundle size (critical for 100MB target)
- ✅ No Expo limitations on native features
- ✅ Better suited for complex media handling
- ✅ Direct access to native iOS APIs when needed
- ✅ CocoaPods full control for iOS dependencies

**Why not Expo**:
- ❌ Larger bundle size (>150MB typical)
- ❌ Potential limitations with YouTube stream handling
- ❌ Extra layer of abstraction not needed
- ❌ Migration from existing Capacitor setup suggests bare RN closer to current architecture

### Implementation Notes

**Initialize Project**:
```bash
npx react-native@latest init PapaGeil --template react-native-template-typescript
```

**Key Dependencies** (`package.json`):
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-native": "^0.73.0",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/stack": "^6.3.20",
    "@react-navigation/bottom-tabs": "^6.5.11",
    "react-native-track-player": "^4.0.1",
    "react-native-video": "^6.0.0",
    "@react-native-voice/voice": "^3.2.4",
    "@react-native-async-storage/async-storage": "^1.21.0",
    "react-native-secure-storage": "^1.0.3",
    "@react-native-community/netinfo": "^11.1.0",
    "react-native-vector-icons": "^10.0.3",
    "react-native-gesture-handler": "^2.14.0",
    "react-native-reanimated": "^3.6.1",
    "react-i18next": "^13.5.0",
    "i18next": "^23.7.11",
    "axios": "^1.6.2",
    "date-fns": "^3.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.45",
    "@types/react-native": "^0.73.0",
    "typescript": "^5.3.3",
    "jest": "^29.7.0",
    "@testing-library/react-native": "^12.4.2",
    "detox": "^20.14.8"
  }
}
```

---

## 6. Dictionary API Selection

### Decision: **Free Dictionary API** + Local Cache (MongoDB + AsyncStorage)

### Rationale

Based on the clarification of "Hybrid (API online + database offline cache)", we'll use:

**Primary**: **Free Dictionary API** (https://dictionaryapi.dev/)
- ✅ Free, no authentication required
- ✅ German language support
- ✅ Provides definitions, phonetics, examples
- ✅ No rate limits for reasonable usage
- ✅ RESTful, simple integration

**Fallback**: **Wiktionary API** (if Free Dictionary lacks German-Vietnamese)
- ✅ Comprehensive multilingual support
- ✅ Community-maintained
- ✅ Free

**Cache Strategy**:
- Backend caches lookups in MongoDB (`DictionaryCache` collection)
- Mobile app caches in AsyncStorage for offline use
- TTL: 90 days for cached entries
- Backend translates to Vietnamese using Google Translate API (paid, low volume)

### Alternatives Considered

| Option | Pros | Cons | Rejected Because |
|--------|------|------|------------------|
| **Linguee API** | High quality, German-English | No free tier, expensive for scale | Cost prohibitive ($100+/month) |
| **Collins Dictionary** | Professional | Paid only | Cost prohibitive |
| **Dict.cc API** | German-focused, free | Rate limits, inconsistent availability | Less reliable than Free Dictionary API |
| **Self-hosted Dictionary** | Full control, offline | Massive data import, maintenance | Complexity not justified when hybrid cache works |

### Implementation Notes

**Backend Service** (`ppgeil/lib/dictionary.js`):
```javascript
async function lookupWord(word, targetLang = 'vi') {
  // 1. Check cache
  const cached = await DictionaryCache.findOne({ word, targetLang });
  if (cached && cached.cachedAt > Date.now() - 90 * 24 * 60 * 60 * 1000) {
    return cached.data;
  }
  
  // 2. Fetch from Free Dictionary API
  const definition = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/de/${word}`);
  
  // 3. Translate to Vietnamese using Google Translate
  const translation = await googleTranslate(definition, 'vi');
  
  // 4. Cache result
  await DictionaryCache.updateOne(
    { word, targetLang },
    { word, targetLang, data: { definition, translation }, cachedAt: new Date() },
    { upsert: true }
  );
  
  return { definition, translation };
}
```

**Mobile Implementation** (`src/services/api/dictionary.ts`):
```typescript
// Checks AsyncStorage cache first, then calls backend API
async function lookupWord(word: string): Promise<DictionaryEntry> {
  // 1. Check local cache
  const cached = await AsyncStorage.getItem(`dict:${word}`);
  if (cached) return JSON.parse(cached);
  
  // 2. Call backend API
  const result = await api.get(`/dictionary/lookup`, { params: { word } });
  
  // 3. Cache locally for offline
  await AsyncStorage.setItem(`dict:${word}`, JSON.stringify(result.data));
  
  return result.data;
}
```

---

## 7. Authentication Flow Adaptation

### Decision: **JWT with Refresh Tokens** (Custom Flow, not NextAuth)

### Rationale

The existing backend uses **NextAuth** which is optimized for web sessions. For mobile:
- ✅ **JWT Access Tokens** (short-lived, 15 minutes) stored in memory
- ✅ **Refresh Tokens** (long-lived, 30 days) stored in SecureStore
- ✅ Refresh token rotation on each use (security best practice)
- ✅ Reuse existing backend JWT infrastructure (`jsonwebtoken` library)
- ✅ Add mobile-specific endpoints: `/api/auth/mobile/login`, `/api/auth/mobile/refresh`

**Why not NextAuth directly**:
- NextAuth designed for server-side sessions with cookies
- Mobile needs token-based auth (no cookies)
- NextAuth mobile support is complex and limited

**Why not modify NextAuth**:
- Cleaner to add dedicated mobile endpoints
- Preserves existing web auth (if needed)
- Simpler testing and maintenance

### Implementation Notes

**New Backend Endpoints**:

`/api/auth/mobile/login` (POST):
```typescript
{
  email: string,
  password: string
}
→ Response: {
  accessToken: string,  // JWT, 15min expiry
  refreshToken: string, // 30 days
  user: { id, name, email, avatar }
}
```

`/api/auth/mobile/refresh` (POST):
```typescript
{
  refreshToken: string
}
→ Response: {
  accessToken: string,  // New JWT
  refreshToken: string  // Rotated
}
```

`/api/auth/mobile/logout` (POST):
```typescript
{
  refreshToken: string
}
→ Invalidates refresh token in database
```

**Mobile Storage Strategy**:
- **AccessToken**: In-memory only (React state/context), cleared on app close
- **RefreshToken**: SecureStore (encrypted on device)
- **User data**: AsyncStorage (name, avatar, preferences)

**Mobile Auth Flow**:
1. User logs in → Store refresh token in SecureStore, access token in memory
2. API requests → Attach access token to `Authorization: Bearer` header
3. Access token expires → Auto-refresh using refresh token
4. Refresh succeeds → Update access token in memory, rotate refresh token
5. Refresh fails → Redirect to login

**Axios Interceptor** (`src/services/api/client.ts`):
```typescript
// Auto-refresh on 401
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      const newAccessToken = await refreshAccessToken();
      error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
      return api(error.config);
    }
    return Promise.reject(error);
  }
);
```

---

## 8. Offline Sync Strategy

### Decision: **Queue-based Background Sync** with Conflict Resolution

### Rationale

For offline capability with 10-lesson downloads:
- ✅ **Queue all mutations** while offline (progress updates, recordings, vocabulary saves)
- ✅ **Sync on reconnect** using background task
- ✅ **Last-write-wins** for conflict resolution (simple, works for our use case)
- ✅ **Exponential backoff** for failed syncs
- ✅ **User notification** on sync completion/failure

**Why this approach**:
- Progress updates don't conflict (user-specific)
- Recordings are single-user (no conflicts)
- Vocabulary saves are append-only (minimal conflicts)
- Last-write-wins sufficient (no collaborative editing)

### Implementation Notes

**Sync Queue Storage** (AsyncStorage):
```typescript
interface SyncQueueItem {
  id: string;
  type: 'progress' | 'recording' | 'vocabulary';
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
  retries: number;
}
```

**Background Sync** (using `react-native-background-fetch`):
```typescript
// Triggered on network reconnect or app foreground
async function processSyncQueue() {
  const queue = await getSyncQueue();
  for (const item of queue) {
    try {
      await syncItem(item);
      await removeFromQueue(item.id);
    } catch (error) {
      item.retries++;
      if (item.retries > 3) {
        // Move to failed queue, notify user
        await moveTo FailedQueue(item);
      } else {
        // Exponential backoff
        await delay(Math.pow(2, item.retries) * 1000);
      }
    }
  }
}
```

**Conflict Resolution**:
- **Progress**: Merge (take max completion percentage, sum practice time)
- **Recordings**: Last-write-wins (only latest matters per spec clarification)
- **Vocabulary**: Append (no conflicts, all saves preserved)

---

## Summary of Decisions

| Component | Decision | Key Reason |
|-----------|----------|------------|
| **Audio Player** | react-native-track-player | Background audio, native iOS integration |
| **Video Player** | react-native-video | Direct stream support, lightweight |
| **YouTube Integration** | Backend streaming + local caching | Offline support, ToS compliance, reuse backend logic |
| **E2E Testing** | Detox | React Native-native, fast, great iOS support |
| **Backend Testing** | Jest + Supertest | Standard Node.js stack, minimal changes |
| **Project Type** | Bare React Native | Full control, smaller bundle, native access |
| **Dictionary API** | Free Dictionary + Wiktionary (fallback) | Free, reliable, hybrid cache strategy |
| **Authentication** | JWT + Refresh Tokens | Mobile-optimized, secure, reuse backend JWT |
| **Offline Sync** | Queue-based with background fetch | Simple, reliable, last-write-wins |

---

## Next Steps

✅ **Phase 0 Complete** - All technical decisions documented  
→ **Proceed to Phase 1**: Generate data models and API contracts

**Phase 1 Deliverables**:
1. `data-model.md` - MongoDB schemas and TypeScript types
2. `contracts/` - OpenAPI specs for mobile-backend APIs
3. `quickstart.md` - Developer setup guide
