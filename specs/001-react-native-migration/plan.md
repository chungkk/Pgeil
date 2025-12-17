# Implementation Plan: Native iOS German Learning App (React Native Migration)

**Branch**: `001-react-native-migration` | **Date**: 2024-12-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-react-native-migration/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Migrate the existing Next.js + Capacitor iOS German learning app ("PapaGeil") to a native React Native iOS application while maintaining the existing Next.js backend API. The app enables German language learners to practice speaking through video shadowing, improve writing through dictation exercises, and access an integrated dictionary. Core features include YouTube-based video lessons, pronunciation feedback (>80% threshold), offline downloads (max 10 lessons), and gamification elements (leaderboards, achievements). The migration prioritizes native mobile UX, offline-first architecture, and optimized audio/video playback while preserving all user data and backend infrastructure.

## Technical Context

### Mobile App (React Native)

**Language/Version**: JavaScript/TypeScript (ES2020+), React Native 0.73+
**Primary Dependencies**: 
  - Core: React 18+, React Navigation 6+
  - Audio/Video: react-native-video, react-native-track-player (NEEDS CLARIFICATION: or expo-av)
  - Storage: @react-native-async-storage/async-storage, react-native-secure-storage
  - Speech: @react-native-voice/voice
  - YouTube: NEEDS CLARIFICATION (react-native-youtube-iframe vs custom WebView vs backend streaming)
  - Network: axios, @react-native-community/netinfo
  - UI: react-native-vector-icons, react-native-gesture-handler, react-native-reanimated
  - i18n: react-i18next (existing)
**Storage**: AsyncStorage for app state/cache, SecureStore for tokens, local file system for downloaded content
**Testing**: Jest for unit tests, React Native Testing Library, NEEDS CLARIFICATION (Detox vs Appium for E2E)
**Target Platform**: iOS 13+ (iPhone X onwards per spec SC-011)
**Project Type**: Mobile app with separate backend API
**Performance Goals**: 
  - App startup <3s (cold start)
  - Screen transitions <300ms
  - Audio playback latency <100ms
  - Dictionary lookup <1s (cached) / <3s (API)
  - 60 FPS UI animations
**Constraints**: 
  - Offline-capable (10 lessons max download)
  - Battery drain <5% per hour active use
  - App size target <100MB
  - Crash-free rate >99%
  - Pronunciation feedback <3s
**Scale/Scope**: 
  - ~16 core screens (migrated from Next.js pages)
  - ~60 components to migrate/rewrite
  - Support 10k+ concurrent users (backend handles this)
  - Lesson catalog: hundreds of videos

### Backend API (Existing - Keep)

**Language/Version**: JavaScript/TypeScript, Node.js 20+, Next.js 15
**Primary Dependencies**: 
  - Framework: Next.js 15 (API routes)
  - Database: MongoDB 6+, Mongoose 8+
  - Auth: NextAuth 4 (custom token flow for mobile)
  - YouTube: @distube/ytdl-core, youtubei.js
  - AI: OpenAI API (pronunciation scoring)
  - Utils: bcryptjs, jsonwebtoken, node-cron
**Storage**: MongoDB Atlas (existing)
**Testing**: NEEDS CLARIFICATION (existing test setup)
**Target Platform**: Node.js server (Vercel/Railway deployment)
**Project Type**: API server (72 existing API routes to maintain)
**Performance Goals**: API response time <200ms p95
**Constraints**: 
  - Must maintain backward compatibility with existing data
  - Zero downtime migration (mobile and web can coexist)
**Scale/Scope**: 72 API endpoints, existing user base preserved

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Status**: ⚠️ No project-specific constitution found (`.specify/memory/constitution.md` contains template only)

**Default Principles Applied**:
- ✅ **Separation of Concerns**: Mobile app and backend API are cleanly separated
- ✅ **Data Integrity**: Existing MongoDB data preserved, zero-downtime migration
- ✅ **Testing**: Unit, integration, and E2E testing frameworks identified (Jest, React Native Testing Library, Detox/Appium)
- ✅ **Performance**: Explicit performance targets defined (startup time, screen transitions, API latency)
- ✅ **Security**: Secure token storage (SecureStore), authentication via existing JWT infrastructure
- ⚠️ **Code Reusability**: Migration will create new mobile codebase; opportunity to create shared business logic libraries
- ⚠️ **Documentation**: Implementation plan, data model, and API contracts will be generated

**Recommendations**:
1. Consider creating a project-specific constitution to codify:
   - Mobile-specific principles (offline-first, battery efficiency, native UX patterns)
   - Backend API stability guarantees (versioning, deprecation policy)
   - Cross-platform considerations (if Android support planned)
2. Establish testing gates before merging to main branch
3. Define performance regression thresholds and monitoring strategy

**Gate Result**: ✅ **PASS** - Proceeding with Phase 0 Research

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# React Native iOS App (New)
react-native/
├── src/
│   ├── navigation/              # React Navigation setup
│   │   ├── AppNavigator.tsx     # Root navigator
│   │   ├── AuthStack.tsx        # Auth flow (login/register)
│   │   ├── MainTabs.tsx         # Bottom tabs (Home, Daily, Profile)
│   │   └── LessonStack.tsx      # Lesson detail screens
│   ├── screens/                 # All app screens
│   │   ├── Auth/                # Login, Register, ForgotPassword
│   │   ├── Home/                # Lesson list, filters, search
│   │   ├── Lesson/              # Lesson detail, video player, shadowing
│   │   ├── Dictation/           # Dictation exercises
│   │   ├── Dictionary/          # Dictionary popup, vocabulary list
│   │   ├── Profile/             # User profile, settings, stats
│   │   └── Leaderboard/         # Rankings, achievements
│   ├── components/              # Reusable components
│   │   ├── atoms/               # Button, Input, Card, Avatar
│   │   ├── molecules/           # SearchBar, LessonCard, StatCard
│   │   └── organisms/           # Header, DictionaryModal, AudioPlayer
│   ├── services/                # API, storage, utils
│   │   ├── api/                 # API client, endpoints
│   │   │   ├── client.ts        # Axios config with auth interceptors
│   │   │   ├── auth.ts          # Login, register, token refresh
│   │   │   ├── lessons.ts       # Lesson CRUD, progress
│   │   │   ├── dictionary.ts    # Word lookup
│   │   │   └── leaderboard.ts   # Rankings, achievements
│   │   ├── storage/             # Local storage
│   │   │   ├── asyncStorage.ts  # App state, cache
│   │   │   ├── secureStorage.ts # Tokens
│   │   │   └── fileSystem.ts    # Downloaded lessons
│   │   ├── audio/               # Audio/video playback
│   │   │   ├── player.ts        # react-native-track-player setup
│   │   │   └── recorder.ts      # Voice recording
│   │   └── youtube/             # YouTube integration
│   │       └── extractor.ts     # Extract streams for offline
│   ├── context/                 # React Context
│   │   ├── AuthContext.tsx      # User auth state
│   │   ├── ThemeContext.tsx     # Dark/light mode
│   │   ├── LanguageContext.tsx  # i18n
│   │   └── OfflineContext.tsx   # Offline sync state
│   ├── hooks/                   # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useLessons.ts
│   │   ├── useAudioPlayer.ts
│   │   ├── useDictionary.ts
│   │   └── useOfflineSync.ts
│   ├── utils/                   # Helpers
│   │   ├── constants.ts
│   │   ├── validators.ts
│   │   └── formatters.ts
│   ├── styles/                  # Global styles
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── theme.ts
│   ├── assets/                  # Images, fonts, i18n
│   │   ├── images/
│   │   ├── fonts/
│   │   └── locales/
│   │       ├── de.json
│   │       ├── vi.json
│   │       └── en.json
│   ├── types/                   # TypeScript definitions
│   │   ├── api.ts
│   │   ├── models.ts
│   │   └── navigation.ts
│   └── App.tsx                  # Root component
├── ios/                         # iOS native code
│   ├── Podfile
│   └── PapaGeil/                # Xcode project
├── __tests__/                   # Tests
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── package.json
├── tsconfig.json
├── metro.config.js
└── README.md

# Next.js Backend API (Existing - Minimal Changes)
ppgeil/                          # Current Next.js app directory
├── pages/
│   └── api/                     # 72 API routes (keep all)
│       ├── auth/                # Authentication endpoints
│       ├── lessons/             # Lesson CRUD
│       ├── progress/            # User progress tracking
│       ├── dictionary/          # Word lookup
│       ├── pronunciation/       # OpenAI scoring
│       ├── leaderboard/         # Rankings
│       └── ...                  # Other existing routes
├── lib/                         # Shared utilities
│   ├── mongodb.js               # DB connection
│   ├── auth.js                  # JWT helpers
│   └── youtube.js               # YouTube utilities
├── models/                      # Mongoose schemas
│   ├── User.js
│   ├── Lesson.js
│   ├── Progress.js
│   ├── Recording.js
│   └── ...
└── scripts/                     # Cron jobs
    ├── cleanup-recordings.js    # Delete recordings >30 days
    └── cleanup-files.js
```

**Structure Decision**: **Mobile + API** architecture selected. 

- **New React Native app** in `/react-native/` directory with feature-based organization (navigation, screens, services)
- **Existing Next.js API** in `/ppgeil/` preserved with minimal modifications (add mobile-specific auth endpoints if needed)
- Clean separation enables independent deployment and testing
- Shared data models defined in backend, consumed via API by mobile app

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**Status**: N/A - No constitution violations detected. Architecture follows standard mobile + API separation pattern.
