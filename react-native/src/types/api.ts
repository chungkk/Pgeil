/**
 * API Response Types
 * Standard response structures from backend API
 */

// Generic API Response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
}

// Error Response
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Paginated Response
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth Responses
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: import('./models').User;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string; // Rotated token
}

export interface RegisterResponse {
  userId: string;
  email: string;
  name: string;
}

// Lesson Responses
export interface LessonListResponse {
  data: import('./models').Lesson[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LessonDetailResponse {
  data: import('./models').Lesson & {
    transcript: import('./models').Transcript;
    userProgress?: import('./models').Progress;
  };
}

export interface StreamUrlsResponse {
  videoUrl: string;
  audioUrl: string;
  expiresAt: string;
  duration: number;
}

export interface DownloadPrepareResponse {
  videoUrl: string;
  audioUrl: string;
  transcriptUrl: string;
  totalSize: number;
  expiresAt: string;
}

// Progress Responses
export interface ProgressUpdateResponse {
  data: import('./models').Progress;
}

export interface LessonCompleteResponse {
  completionPercentage: number;
  isCompleted: boolean;
  completedAt: string;
  earnedPoints: number;
  newAchievements: import('./models').AchievementBadge[];
}

// Pronunciation Response
export interface PronunciationScoreResponse {
  similarityScore: number; // 0-100
  isPassed: boolean; // >80%
  feedbackNotes?: string;
  recordingId: string;
}

// Dictionary Response
export interface DictionaryLookupResponse {
  data: import('./models').DictionaryEntry;
}

// Vocabulary Response
export interface VocabularyListResponse {
  data: import('./models').VocabularyItem[];
}

// Leaderboard Response
export interface LeaderboardResponse {
  data: import('./models').LeaderboardEntry[];
}

// Achievements Response
export interface AchievementsResponse {
  data: import('./models').Achievement[];
}

// Common Error Codes
export enum ErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  SERVER_ERROR = 'SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  
  // Auth specific
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  EMAIL_EXISTS = 'EMAIL_EXISTS',
  INVALID_TOKEN = 'INVALID_TOKEN',
  INVALID_REFRESH_TOKEN = 'INVALID_REFRESH_TOKEN',
  
  // Lesson specific
  LESSON_NOT_FOUND = 'LESSON_NOT_FOUND',
  YOUTUBE_UNAVAILABLE = 'YOUTUBE_UNAVAILABLE',
  DOWNLOAD_LIMIT_EXCEEDED = 'DOWNLOAD_LIMIT_EXCEEDED',
  INVALID_PROGRESS_DATA = 'INVALID_PROGRESS_DATA',
}
