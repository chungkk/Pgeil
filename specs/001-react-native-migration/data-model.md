# Data Model: Native iOS German Learning App

**Feature**: React Native Migration  
**Date**: 2024-12-17  
**Status**: Phase 1

## Overview

This document defines the data models for the German Learning App, covering both backend MongoDB schemas (existing, to be maintained) and mobile TypeScript types (new). The backend serves as the source of truth, with mobile types mirroring the API responses.

---

## Backend Data Models (MongoDB + Mongoose)

### User

Represents a learner using the app.

**Collection**: `users`

**Schema** (`ppgeil/models/User.js`):
```javascript
const UserSchema = new mongoose.Schema({
  // Authentication
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() { return !this.googleId; } // Required if not OAuth
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true
  },
  
  // Profile
  name: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String, // URL
    default: null
  },
  preferredLanguage: {
    type: String,
    enum: ['de', 'vi', 'en'],
    default: 'vi'
  },
  
  // Settings
  theme: {
    type: String,
    enum: ['light', 'dark'],
    default: 'light'
  },
  playbackSpeed: {
    type: Number,
    enum: [0.5, 0.75, 1, 1.25, 1.5],
    default: 1
  },
  
  // Statistics
  totalLessonsCompleted: {
    type: Number,
    default: 0
  },
  totalPracticeTime: {
    type: Number, // seconds
    default: 0
  },
  averageAccuracyScore: {
    type: Number, // 0-100
    default: 0
  },
  currentStreak: {
    type: Number, // days
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  lastPracticeDate: {
    type: Date,
    default: null
  },
  
  // Gamification
  achievementBadges: [{
    badgeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' },
    earnedAt: { type: Date, default: Date.now }
  }],
  totalPoints: {
    type: Number,
    default: 0
  },
  
  // Auth Tokens (Mobile)
  refreshTokens: [{
    token: String,
    expiresAt: Date,
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Metadata
  emailVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ googleId: 1 });
UserSchema.index({ totalPoints: -1 }); // For leaderboard
UserSchema.index({ 'refreshTokens.token': 1 });

// Pre-save hook to update streak
UserSchema.pre('save', function(next) {
  if (this.lastPracticeDate) {
    const daysSinceLastPractice = Math.floor(
      (Date.now() - this.lastPracticeDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceLastPractice === 1) {
      this.currentStreak++;
      if (this.currentStreak > this.longestStreak) {
        this.longestStreak = this.currentStreak;
      }
    } else if (daysSinceLastPractice > 1) {
      this.currentStreak = 0;
    }
  }
  next();
});
```

**Validation Rules**:
- Email must be unique and valid format
- Password min 8 characters (if not OAuth)
- Name required, max 100 characters
- Preferred language must be one of: de, vi, en
- Playback speed must be one of: 0.5, 0.75, 1, 1.25, 1.5

---

### Lesson

Represents a German learning lesson with YouTube video source.

**Collection**: `lessons`

**Schema** (`ppgeil/models/Lesson.js`):
```javascript
const LessonSchema = new mongoose.Schema({
  // Basic Info
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  youtubeVideoId: {
    type: String,
    required: true,
    unique: true
  },
  thumbnailUrl: {
    type: String,
    required: true
  },
  
  // Classification
  difficultyLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Daily Conversation', 'Business', 'Travel', 'Grammar', 'Vocabulary', 'Culture', 'Other']
  },
  tags: [String],
  
  // Content
  duration: {
    type: Number, // seconds
    required: true
  },
  transcript: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transcript',
    required: true
  },
  
  // Dictation Exercises
  dictationExercises: [{
    type: {
      type: String,
      enum: ['fill-in-blank', 'full-sentence'],
      required: true
    },
    prompt: String, // Audio segment reference (timestamp)
    correctAnswer: String,
    hints: [String],
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard']
    }
  }],
  
  // Metadata
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  published: {
    type: Boolean,
    default: false
  },
  publishedAt: Date,
  viewCount: {
    type: Number,
    default: 0
  },
  completionCount: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  
  // File Caching (for offline)
  cachedVideoUrl: String, // Backend-cached video file
  cachedAudioUrl: String, // Backend-cached audio file
  cacheExpiry: Date,
  fileSize: {
    video: Number, // bytes
    audio: Number
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
LessonSchema.index({ difficultyLevel: 1, category: 1 });
LessonSchema.index({ published: 1, publishedAt: -1 });
LessonSchema.index({ youtubeVideoId: 1 });
LessonSchema.index({ tags: 1 });
```

**Validation Rules**:
- Title max 200 characters
- YouTube video ID must be valid format (11 characters)
- Duration must be positive number
- Difficulty level: Beginner, Intermediate, Advanced only
- Category from predefined enum

---

### Transcript

Represents time-synchronized text for a lesson.

**Collection**: `transcripts`

**Schema** (`ppgeil/models/Transcript.js`):
```javascript
const TranscriptSchema = new mongoose.Schema({
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  
  segments: [{
    startTime: {
      type: Number, // seconds
      required: true
    },
    endTime: {
      type: Number,
      required: true
    },
    textGerman: {
      type: String,
      required: true
    },
    textVietnamese: {
      type: String,
      required: true
    },
    textEnglish: {
      type: String,
      required: true
    },
    words: [{
      word: String,
      startTime: Number,
      endTime: Number,
      partOfSpeech: String // For dictionary integration
    }]
  }],
  
  metadata: {
    totalWords: Number,
    language: {
      type: String,
      default: 'de'
    },
    version: {
      type: Number,
      default: 1
    }
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
TranscriptSchema.index({ lessonId: 1 });
```

**Validation Rules**:
- startTime < endTime for all segments
- Segments must be chronologically ordered
- All three text fields required (German, Vietnamese, English)

---

### Progress

Tracks user progress on lessons.

**Collection**: `progress`

**Schema** (`ppgeil/models/Progress.js`):
```javascript
const ProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  
  // Progress Tracking
  completionPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  timeSpent: {
    type: Number, // seconds
    default: 0
  },
  lastWatchedPosition: {
    type: Number, // seconds
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
  
  // Shadowing Stats
  shadowingAttempts: {
    type: Number,
    default: 0
  },
  shadowingAverageScore: {
    type: Number, // 0-100
    default: 0
  },
  shadowingBestScore: {
    type: Number,
    default: 0
  },
  
  // Dictation Stats
  dictationAttempts: {
    type: Number,
    default: 0
  },
  dictationAverageAccuracy: {
    type: Number, // 0-100
    default: 0
  },
  dictationBestAccuracy: {
    type: Number,
    default: 0
  },
  
  // Activity
  firstStartedAt: {
    type: Date,
    default: Date.now
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  totalSessions: {
    type: Number,
    default: 1
  },
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
ProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });
ProgressSchema.index({ userId: 1, isCompleted: 1 });
ProgressSchema.index({ lessonId: 1 });

// Mark as completed if percentage reaches 100%
ProgressSchema.pre('save', function(next) {
  if (this.completionPercentage >= 100 && !this.isCompleted) {
    this.isCompleted = true;
    this.completedAt = new Date();
  }
  next();
});
```

**Validation Rules**:
- Completion percentage: 0-100
- Time spent must be non-negative
- Scores: 0-100 range

---

### Recording

Represents a user's pronunciation attempt.

**Collection**: `recordings`

**Schema** (`ppgeil/models/Recording.js`):
```javascript
const RecordingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  transcriptSegmentId: String, // Segment being practiced
  
  // Recording Data
  audioFileUrl: {
    type: String,
    required: true
  },
  audioFileSize: Number, // bytes
  duration: Number, // seconds
  
  // Analysis
  similarityScore: {
    type: Number, // 0-100
    required: true,
    min: 0,
    max: 100
  },
  isPassed: {
    type: Boolean,
    default: function() {
      return this.similarityScore > 80; // Spec clarification
    }
  },
  feedbackNotes: String, // AI-generated feedback
  
  // Metadata
  recordedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: function() {
      // Auto-delete after 30 days (spec clarification)
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
  }
}, {
  timestamps: true
});

// Indexes
RecordingSchema.index({ userId: 1, lessonId: 1, transcriptSegmentId: 1 });
RecordingSchema.index({ expiresAt: 1 }); // For TTL cleanup
RecordingSchema.index({ recordedAt: 1 });

// TTL Index - auto-delete after 30 days
RecordingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
```

**Validation Rules**:
- Only most recent recording per segment is retained (spec clarification)
- Similarity score: 0-100
- Auto-delete after 30 days
- isPassed = true if similarityScore > 80%

---

### VocabularyItem

Represents a word saved by a user.

**Collection**: `vocabulary`

**Schema** (`ppgeil/models/VocabularyItem.js`):
```javascript
const VocabularyItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Word Data
  word: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  definition: {
    type: String,
    required: true
  },
  translations: {
    vietnamese: String,
    english: String
  },
  partOfSpeech: String, // noun, verb, adjective, etc.
  exampleSentences: [{
    german: String,
    vietnamese: String,
    english: String
  }],
  pronunciationAudioUrl: String,
  
  // Context
  sourceLessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  },
  sourceContext: String, // Sentence where word was encountered
  
  // Learning Status
  isLearned: {
    type: Boolean,
    default: false
  },
  learnedAt: Date,
  reviewCount: {
    type: Number,
    default: 0
  },
  lastReviewedAt: Date,
  
  // Metadata
  savedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
VocabularyItemSchema.index({ userId: 1, word: 1 }, { unique: true });
VocabularyItemSchema.index({ userId: 1, isLearned: 1 });
VocabularyItemSchema.index({ savedAt: -1 });
```

**Validation Rules**:
- Word max 100 characters
- Definition required
- userId + word combination must be unique

---

### DictionaryCache

Represents cached dictionary lookup results.

**Collection**: `dictionary_cache`

**Schema** (`ppgeil/models/DictionaryCache.js`):
```javascript
const DictionaryCacheSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  targetLanguage: {
    type: String,
    enum: ['vi', 'en'],
    required: true
  },
  
  // Cached Data
  data: {
    definition: String,
    translations: {
      vietnamese: String,
      english: String
    },
    partOfSpeech: String,
    exampleSentences: [{
      german: String,
      translated: String
    }],
    pronunciationAudioUrl: String,
    phonetic: String
  },
  
  // Source
  sourceApi: {
    type: String,
    enum: ['free-dictionary', 'wiktionary', 'google-translate'],
    required: true
  },
  
  // Cache Management
  cachedAt: {
    type: Date,
    default: Date.now
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  accessCount: {
    type: Number,
    default: 1
  },
  expiresAt: {
    type: Date,
    default: function() {
      // 90 days TTL
      return new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
    }
  }
}, {
  timestamps: true
});

// Indexes
DictionaryCacheSchema.index({ word: 1, targetLanguage: 1 }, { unique: true });
DictionaryCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL
```

**Validation Rules**:
- Word max 100 characters
- Cache expires after 90 days
- word + targetLanguage combination must be unique

---

### Download

Tracks offline lesson downloads.

**Collection**: `downloads`

**Schema** (`ppgeil/models/Download.js`):
```javascript
const DownloadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  
  // Download Info
  downloadedAt: {
    type: Date,
    default: Date.now
  },
  fileSize: {
    type: Number, // bytes
    required: true
  },
  storageLocation: String, // File path reference (mobile-side)
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'failed'],
    default: 'pending'
  },
  progress: {
    type: Number, // 0-100
    default: 0
  },
  
  // Metadata
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: Date // Optional expiry
}, {
  timestamps: true
});

// Indexes
DownloadSchema.index({ userId: 1, lessonId: 1 }, { unique: true });
DownloadSchema.index({ userId: 1, status: 1 });
```

**Validation Rules**:
- userId can have max 10 completed downloads (spec clarification FR-028)
- fileSize must be positive

---

### Achievement

Represents a gamification milestone.

**Collection**: `achievements`

**Schema** (`ppgeil/models/Achievement.js`):
```javascript
const AchievementSchema = new mongoose.Schema({
  badgeName: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  iconUrl: {
    type: String,
    required: true
  },
  
  // Criteria
  criteria: {
    type: String, // JSON string or MongoDB query format
    required: true
    // Examples: '{"lessonsCompleted": 10}', '{"currentStreak": 7}'
  },
  criteriaType: {
    type: String,
    enum: ['lesson-count', 'streak', 'accuracy', 'time-spent', 'custom'],
    required: true
  },
  
  // Rewards
  pointsAwarded: {
    type: Number,
    default: 100
  },
  
  // Metadata
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
AchievementSchema.index({ badgeName: 1 });
AchievementSchema.index({ criteriaType: 1 });
```

**Example Achievements**:
- "Week Warrior": 7-day streak
- "First Steps": Complete first lesson
- "Perfect Score": 100% pronunciation accuracy on a lesson
- "Vocabulary Master": Save 50 words

---

### LeaderboardEntry

Tracks user rankings.

**Collection**: `leaderboard`

**Schema** (`ppgeil/models/LeaderboardEntry.js`):
```javascript
const LeaderboardEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Ranking
  totalScore: {
    type: Number,
    required: true,
    default: 0
  },
  rankPosition: {
    type: Number,
    default: null
  },
  
  // Time Period
  period: {
    type: String,
    enum: ['weekly', 'monthly', 'all-time'],
    required: true
  },
  periodStart: Date,
  periodEnd: Date,
  
  // Stats
  achievementCount: {
    type: Number,
    default: 0
  },
  lessonsCompleted: {
    type: Number,
    default: 0
  },
  
  // Metadata
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
LeaderboardEntrySchema.index({ period: 1, totalScore: -1 });
LeaderboardEntrySchema.index({ userId: 1, period: 1 }, { unique: true });
```

**Validation Rules**:
- totalScore must be non-negative
- period: weekly, monthly, or all-time only

---

## Mobile TypeScript Types

Located in `react-native/src/types/models.ts`:

```typescript
// User Types
export interface User {
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
  lastPracticeDate: string | null; // ISO date
  achievementBadges: AchievementBadge[];
  totalPoints: number;
  createdAt: string;
  updatedAt: string;
}

export interface AchievementBadge {
  badgeId: string;
  badgeName: string;
  iconUrl: string;
  earnedAt: string;
}

// Lesson Types
export interface Lesson {
  id: string;
  title: string;
  description: string;
  youtubeVideoId: string;
  thumbnailUrl: string;
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  tags: string[];
  duration: number; // seconds
  transcriptId: string;
  dictationExercises: DictationExercise[];
  viewCount: number;
  completionCount: number;
  averageRating: number;
  fileSize?: {
    video: number;
    audio: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DictationExercise {
  id: string;
  type: 'fill-in-blank' | 'full-sentence';
  prompt: string;
  correctAnswer: string;
  hints: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

// Transcript Types
export interface Transcript {
  id: string;
  lessonId: string;
  segments: TranscriptSegment[];
  metadata: {
    totalWords: number;
    language: string;
    version: number;
  };
}

export interface TranscriptSegment {
  id: string;
  startTime: number; // seconds
  endTime: number;
  textGerman: string;
  textVietnamese: string;
  textEnglish: string;
  words: WordMetadata[];
}

export interface WordMetadata {
  word: string;
  startTime: number;
  endTime: number;
  partOfSpeech?: string;
}

// Progress Types
export interface Progress {
  id: string;
  userId: string;
  lessonId: string;
  completionPercentage: number; // 0-100
  timeSpent: number; // seconds
  lastWatchedPosition: number; // seconds
  isCompleted: boolean;
  completedAt?: string;
  shadowingAttempts: number;
  shadowingAverageScore: number;
  shadowingBestScore: number;
  dictationAttempts: number;
  dictationAverageAccuracy: number;
  dictationBestAccuracy: number;
  lastAccessedAt: string;
  totalSessions: number;
}

// Recording Types
export interface Recording {
  id: string;
  userId: string;
  lessonId: string;
  transcriptSegmentId: string;
  audioFileUrl: string;
  duration: number;
  similarityScore: number; // 0-100
  isPassed: boolean; // true if >80%
  feedbackNotes?: string;
  recordedAt: string;
  expiresAt: string; // 30 days from recordedAt
}

// Vocabulary Types
export interface VocabularyItem {
  id: string;
  userId: string;
  word: string;
  definition: string;
  translations: {
    vietnamese?: string;
    english?: string;
  };
  partOfSpeech?: string;
  exampleSentences: ExampleSentence[];
  pronunciationAudioUrl?: string;
  sourceLessonId?: string;
  sourceContext?: string;
  isLearned: boolean;
  learnedAt?: string;
  reviewCount: number;
  lastReviewedAt?: string;
  savedAt: string;
}

export interface ExampleSentence {
  german: string;
  vietnamese?: string;
  english?: string;
}

// Dictionary Types
export interface DictionaryEntry {
  word: string;
  definition: string;
  translations: {
    vietnamese?: string;
    english?: string;
  };
  partOfSpeech?: string;
  exampleSentences: ExampleSentence[];
  pronunciationAudioUrl?: string;
  phonetic?: string;
}

// Download Types
export interface Download {
  id: string;
  userId: string;
  lessonId: string;
  downloadedAt: string;
  fileSize: number; // bytes
  storageLocation: string; // Local file path
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  progress: number; // 0-100
  lastAccessedAt: string;
}

// Achievement Types
export interface Achievement {
  id: string;
  badgeName: string;
  description: string;
  iconUrl: string;
  criteriaType: 'lesson-count' | 'streak' | 'accuracy' | 'time-spent' | 'custom';
  pointsAwarded: number;
  isActive: boolean;
}

// Leaderboard Types
export interface LeaderboardEntry {
  userId: string;
  userName: string;
  userAvatar: string | null;
  totalScore: number;
  rankPosition: number;
  period: 'weekly' | 'monthly' | 'all-time';
  achievementCount: number;
  lessonsCompleted: number;
  lastUpdated: string;
}

// Auth Types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse extends AuthTokens {
  user: User;
}
```

---

## Data Relationships

```
User
├── has many Progress (user → lessons completed)
├── has many Recording (pronunciation attempts)
├── has many VocabularyItem (saved words)
├── has many Download (offline lessons)
├── has many LeaderboardEntry (rankings per period)
└── has many Achievement badges (earned)

Lesson
├── has one Transcript
├── has many Progress (users who started)
├── has many Recording (pronunciation practice)
├── has many Download (offline downloads)
└── belongs to creator (User)

Transcript
└── belongs to Lesson

Progress
├── belongs to User
└── belongs to Lesson

Recording
├── belongs to User
└── belongs to Lesson

VocabularyItem
├── belongs to User
└── optionally belongs to Lesson (source)

Download
├── belongs to User
└── belongs to Lesson

LeaderboardEntry
└── belongs to User

Achievement
└── many-to-many with User (through user.achievementBadges)

DictionaryCache
└── standalone (shared across users)
```

---

## Data Constraints Summary

| Entity | Key Constraints |
|--------|----------------|
| **User** | email unique, max 10 downloads per user |
| **Lesson** | youtubeVideoId unique |
| **Transcript** | lessonId unique (one-to-one with Lesson) |
| **Progress** | (userId, lessonId) unique |
| **Recording** | Auto-delete after 30 days, only most recent per (userId, lessonId, segmentId) |
| **VocabularyItem** | (userId, word) unique |
| **DictionaryCache** | (word, targetLanguage) unique, TTL 90 days |
| **Download** | (userId, lessonId) unique, max 10 active per user |
| **LeaderboardEntry** | (userId, period) unique |
| **Achievement** | badgeName unique |

---

## Next Steps

✅ **Phase 1 (Data Model)** Complete  
→ **Next**: Generate API contracts in `/contracts/` directory
