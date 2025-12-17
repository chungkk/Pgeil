/**
 * Data Models - TypeScript type definitions
 * Mirrors backend MongoDB schemas from data-model.md
 */

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
  emailVerified: boolean;
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
  isDownloaded?: boolean; // Client-side only
  createdAt: string;
  updatedAt: string;
}

export interface DictationExercise {
  id: string;
  type: 'fill-in-blank' | 'full-sentence';
  prompt: string; // Audio segment reference (timestamp)
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
