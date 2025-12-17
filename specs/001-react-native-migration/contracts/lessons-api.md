# Lessons API Contract

**Version**: 1.0  
**Base URL**: `/api/lessons`  
**Authentication**: Bearer token required

---

## Endpoints

### 1. List Lessons

**GET** `/api/lessons`

Get paginated list of lessons with optional filters.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Items per page (default: 20, max: 100) |
| `difficulty` | string | No | Filter by: "Beginner", "Intermediate", "Advanced" |
| `category` | string | No | Filter by category |
| `search` | string | No | Search in title/description |
| `sort` | string | No | Sort by: "newest", "popular", "difficulty" (default: "newest") |

#### Request

```http
GET /api/lessons?page=1&limit=20&difficulty=Beginner&sort=popular
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response (Success)

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "Greetings and Introductions",
      "description": "Learn basic German greetings...",
      "youtubeVideoId": "dQw4w9WgXcQ",
      "thumbnailUrl": "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      "difficultyLevel": "Beginner",
      "category": "Daily Conversation",
      "tags": ["greetings", "basic", "conversation"],
      "duration": 300,
      "viewCount": 1250,
      "completionCount": 450,
      "averageRating": 4.5,
      "fileSize": {
        "video": 45678910,
        "audio": 5678910
      },
      "isDownloaded": false,
      "userProgress": {
        "completionPercentage": 0,
        "isCompleted": false
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

### 2. Get Lesson Details

**GET** `/api/lessons/:id`

Get full details for a specific lesson including transcript.

#### Request

```http
GET /api/lessons/507f1f77bcf86cd799439011
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response (Success)

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Greetings and Introductions",
    "description": "Learn basic German greetings and how to introduce yourself...",
    "youtubeVideoId": "dQw4w9WgXcQ",
    "thumbnailUrl": "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    "difficultyLevel": "Beginner",
    "category": "Daily Conversation",
    "tags": ["greetings", "basic"],
    "duration": 300,
    "transcript": {
      "id": "507f1f77bcf86cd799439012",
      "segments": [
        {
          "id": "seg_001",
          "startTime": 0,
          "endTime": 5.2,
          "textGerman": "Guten Morgen!",
          "textVietnamese": "Chào buổi sáng!",
          "textEnglish": "Good morning!",
          "words": [
            {
              "word": "guten",
              "startTime": 0,
              "endTime": 1.5,
              "partOfSpeech": "adjective"
            },
            {
              "word": "morgen",
              "startTime": 1.5,
              "endTime": 2.8,
              "partOfSpeech": "noun"
            }
          ]
        }
      ]
    },
    "dictationExercises": [
      {
        "id": "dict_001",
        "type": "fill-in-blank",
        "prompt": "seg_001",
        "correctAnswer": "Guten Morgen",
        "hints": ["Greeting", "Morning"],
        "difficulty": "easy"
      }
    ],
    "userProgress": {
      "completionPercentage": 45,
      "timeSpent": 450,
      "lastWatchedPosition": 135,
      "isCompleted": false,
      "shadowingAttempts": 3,
      "shadowingAverageScore": 75,
      "dictationAttempts": 2,
      "dictationAverageAccuracy": 80
    }
  }
}
```

---

### 3. Get Stream URLs

**GET** `/api/lessons/:id/stream`

Get temporary signed URLs for online video/audio streaming.

#### Request

```http
GET /api/lessons/507f1f77bcf86cd799439011/stream
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response (Success)

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "data": {
    "videoUrl": "https://backend.com/stream/video/abc123def456?expires=1702890000&signature=xyz789",
    "audioUrl": "https://backend.com/stream/audio/abc123def456?expires=1702890000&signature=xyz789",
    "expiresAt": "2024-12-17T12:00:00Z",
    "duration": 300
  }
}
```

#### Response (Error - YouTube Unavailable)

```http
HTTP/1.1 503 Service Unavailable
Content-Type: application/json

{
  "success": false,
  "error": {
    "code": "YOUTUBE_UNAVAILABLE",
    "message": "YouTube video is not available. It may have been removed or is restricted."
  }
}
```

---

### 4. Prepare Download

**POST** `/api/lessons/:id/download`

Prepare lesson for offline download (backend caches YouTube content).

#### Request

```http
POST /api/lessons/507f1f77bcf86cd799439011/download
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response (Success)

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "data": {
    "videoUrl": "https://backend.com/downloads/507f1f77bcf86cd799439011-video.mp4",
    "audioUrl": "https://backend.com/downloads/507f1f77bcf86cd799439011-audio.m4a",
    "transcriptUrl": "https://backend.com/downloads/507f1f77bcf86cd799439011-transcript.json",
    "totalSize": 51357820,
    "expiresAt": "2024-12-18T12:00:00Z"
  },
  "message": "Lesson prepared for download"
}
```

#### Response (Error - Download Limit)

```http
HTTP/1.1 403 Forbidden
Content-Type: application/json

{
  "success": false,
  "error": {
    "code": "DOWNLOAD_LIMIT_EXCEEDED",
    "message": "You have reached the maximum of 10 downloaded lessons. Please delete an existing download first.",
    "details": {
      "currentDownloads": 10,
      "maxDownloads": 10
    }
  }
}
```

---

### 5. Update Progress

**PATCH** `/api/lessons/:id/progress`

Update user progress for a lesson.

#### Request

```http
PATCH /api/lessons/507f1f77bcf86cd799439011/progress
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "completionPercentage": 50,
  "timeSpent": 150,
  "lastWatchedPosition": 150,
  "shadowingScore": 85,
  "dictationAccuracy": 90
}
```

#### Response (Success)

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "data": {
    "id": "progress_123",
    "completionPercentage": 50,
    "timeSpent": 600,
    "isCompleted": false,
    "shadowingAverageScore": 80,
    "dictationAverageAccuracy": 85
  },
  "message": "Progress updated successfully"
}
```

---

### 6. Mark Lesson Complete

**POST** `/api/lessons/:id/complete`

Mark a lesson as completed.

#### Request

```http
POST /api/lessons/507f1f77bcf86cd799439011/complete
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response (Success)

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "data": {
    "completionPercentage": 100,
    "isCompleted": true,
    "completedAt": "2024-12-17T10:30:00Z",
    "earnedPoints": 100,
    "newAchievements": [
      {
        "id": "ach_001",
        "badgeName": "First Lesson Complete",
        "pointsAwarded": 50
      }
    ]
  },
  "message": "Lesson completed! You earned 100 points."
}
```

---

## Data Models

### Lesson (List Item)

```typescript
interface LessonListItem {
  id: string;
  title: string;
  description: string;
  youtubeVideoId: string;
  thumbnailUrl: string;
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  tags: string[];
  duration: number; // seconds
  viewCount: number;
  completionCount: number;
  averageRating: number;
  fileSize?: {
    video: number;
    audio: number;
  };
  isDownloaded: boolean;
  userProgress?: {
    completionPercentage: number;
    isCompleted: boolean;
  };
}
```

### Lesson (Full Detail)

Extends `LessonListItem` with:
- `transcript`: Full transcript with segments
- `dictationExercises`: Array of exercises
- `userProgress`: Detailed progress object

---

## Business Rules

1. **Download Limit**: Max 10 lessons per user (spec FR-028)
2. **Stream Expiry**: Signed URLs expire after 1 hour
3. **Download Cache**: Backend caches expire after 24 hours
4. **Progress Auto-save**: Mobile app should auto-save every 30 seconds
5. **Completion Criteria**: Lesson marked complete when user watches 90%+ OR manually completes

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `LESSON_NOT_FOUND` | 404 | Lesson ID doesn't exist |
| `YOUTUBE_UNAVAILABLE` | 503 | YouTube video unavailable |
| `DOWNLOAD_LIMIT_EXCEEDED` | 403 | User reached 10-lesson limit |
| `INVALID_PROGRESS_DATA` | 400 | Progress update validation failed |

---

## Implementation Notes

**Backend YouTube Extraction** (`ppgeil/lib/youtube.js`):
```javascript
import ytdl from '@distube/ytdl-core';

export async function getStreamUrls(youtubeVideoId) {
  const info = await ytdl.getInfo(youtubeVideoId);
  const videoFormat = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' });
  const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
  
  // Sign URLs with JWT (expire in 1 hour)
  const videoUrl = signUrl(videoFormat.url, 3600);
  const audioUrl = signUrl(audioFormat.url, 3600);
  
  return { videoUrl, audioUrl, duration: info.videoDetails.lengthSeconds };
}
```

---

## Next Steps

✅ **Lessons API contract complete**  
→ **Implement backend endpoints**  
→ **Implement mobile lessons service**  
→ **Test online streaming and offline download flows**
