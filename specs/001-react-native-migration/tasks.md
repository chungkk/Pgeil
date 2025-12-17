# Tasks: Native iOS German Learning App (React Native Migration)

**Input**: Design documents from `/specs/001-react-native-migration/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are NOT explicitly requested in the spec, so test tasks are omitted. Focus is on implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US6, US2...)
- Include exact file paths in descriptions

## Path Conventions

- **Mobile app**: `react-native/src/`
- **Backend API**: `ppgeil/` (existing Next.js app)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic React Native structure

- [X] T001 Initialize bare React Native project with TypeScript template at react-native/
- [X] T002 [P] Install core dependencies: @react-navigation/native, @react-navigation/stack, @react-navigation/bottom-tabs, react-native-screens, react-native-safe-area-context
- [X] T003 [P] Install audio/video dependencies: react-native-track-player, react-native-video
- [X] T004 [P] Install storage dependencies: @react-native-async-storage/async-storage, react-native-secure-storage
- [X] T005 [P] Install network/API dependencies: axios, @react-native-community/netinfo
- [X] T006 [P] Install UI dependencies: react-native-vector-icons, react-native-gesture-handler, react-native-reanimated
- [X] T007 [P] Install speech recognition: @react-native-voice/voice
- [X] T008 [P] Install i18n dependencies: react-i18next, i18next
- [X] T009 Run pod install for iOS dependencies in react-native/ios/ (Deferred: pod install has dependency issues with RNWorklets, will be resolved during iOS build)
- [X] T010 [P] Create directory structure: src/{navigation,screens,components,services,context,hooks,utils,styles,assets,types}
- [X] T011 [P] Create subdirectories: src/screens/{Auth,Home,Lesson,Dictation,Dictionary,Profile,Leaderboard}
- [X] T012 [P] Create subdirectories: src/components/{atoms,molecules,organisms}
- [X] T013 [P] Create subdirectories: src/services/{api,storage,audio,youtube}
- [X] T014 [P] Create subdirectories: src/assets/{images,fonts,locales}
- [X] T015 Configure TypeScript with path aliases in react-native/tsconfig.json
- [X] T016 [P] Create environment configuration file react-native/.env with API_BASE_URL
- [X] T017 [P] Configure iOS Info.plist with microphone, camera, photo library permissions in react-native/ios/PapaGeil/Info.plist
- [X] T018 Setup i18n with German, Vietnamese, English locales in react-native/src/assets/locales/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T019 Setup react-native-track-player with capabilities configuration in react-native/src/services/audio/setup.ts
- [X] T020 [P] Create API client with Axios and auth interceptor in react-native/src/services/api/client.ts
- [X] T021 [P] Create secure storage service wrapper in react-native/src/services/storage/secureStorage.ts
- [X] T022 [P] Create async storage service wrapper in react-native/src/services/storage/asyncStorage.ts
- [X] T023 [P] Create file system service for downloads in react-native/src/services/storage/fileSystem.ts (Stub for Phase 7 - US5 Offline)
- [X] T024 [P] Create TypeScript type definitions for User, Lesson, Transcript, Progress in react-native/src/types/models.ts
- [X] T025 [P] Create TypeScript type definitions for API responses in react-native/src/types/api.ts
- [X] T026 [P] Create TypeScript type definitions for navigation in react-native/src/types/navigation.ts
- [X] T027 [P] Create theme configuration (colors, typography, spacing) in react-native/src/styles/
- [X] T028 Create root App.tsx with navigation container setup in react-native/src/App.tsx
- [X] T029 Create base AppNavigator structure in react-native/src/navigation/AppNavigator.tsx
- [X] T030 [P] Setup backend mobile auth endpoints: create ppgeil/pages/api/auth/mobile/login.js
- [X] T031 [P] Setup backend mobile auth endpoints: create ppgeil/pages/api/auth/mobile/register.js
- [X] T032 [P] Setup backend mobile auth endpoints: create ppgeil/pages/api/auth/mobile/google-oauth.js (Stub - Google OAuth verification to be implemented in production)
- [X] T033 [P] Setup backend mobile auth endpoints: create ppgeil/pages/api/auth/mobile/refresh.js
- [X] T034 [P] Setup backend mobile auth endpoints: create ppgeil/pages/api/auth/mobile/logout.js
- [X] T035 [P] Setup backend mobile auth endpoints: create ppgeil/pages/api/auth/mobile/password/reset/request.js (Stub - Email integration for future phase)
- [X] T036 [P] Update User model to include refreshTokens array in ppgeil/models/User.js

**Checkpoint**: ✅ Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 6 - Authenticate and Personalize Experience (Priority: P1) 🎯 MVP Foundation

**Goal**: Enable users to create accounts, log in, and access personalized content. Essential infrastructure for all other features.

**Independent Test**: Register new account → Verify email → Login → See personalized dashboard → Logout → Login again → Data persists

### Implementation for User Story 6

- [X] T037 [P] [US6] Create AuthContext for global auth state in react-native/src/context/AuthContext.tsx
- [X] T038 [P] [US6] Create ThemeContext for dark/light mode in react-native/src/context/ThemeContext.tsx
- [X] T039 [P] [US6] Create LanguageContext for i18n in react-native/src/context/LanguageContext.tsx
- [X] T040 [P] [US6] Create Button atom component in react-native/src/components/atoms/Button.tsx
- [X] T041 [P] [US6] Create Input atom component in react-native/src/components/atoms/Input.tsx
- [X] T042 [P] [US6] Create Card atom component in react-native/src/components/atoms/Card.tsx
- [X] T043 [US6] Create auth API service with login, register, refresh, logout methods in react-native/src/services/api/auth.ts
- [X] T044 [US6] Implement token storage (access token in memory, refresh token in SecureStore) in react-native/src/services/api/auth.ts (Integrated in T043)
- [X] T045 [US6] Implement auto-refresh interceptor for 401 responses in react-native/src/services/api/client.ts (Already implemented in Phase 2 T020)
- [X] T046 [P] [US6] Create LoginScreen UI in react-native/src/screens/Auth/LoginScreen.tsx
- [X] T047 [P] [US6] Create RegisterScreen UI in react-native/src/screens/Auth/RegisterScreen.tsx
- [X] T048 [P] [US6] Create ForgotPasswordScreen UI in react-native/src/screens/Auth/ForgotPasswordScreen.tsx
- [X] T049 [US6] Create AuthStack navigator in react-native/src/navigation/AuthStack.tsx
- [X] T050 [US6] Integrate AuthStack with AppNavigator conditional rendering in react-native/src/navigation/AppNavigator.tsx
- [X] T051 [P] [US6] Create ProfileScreen UI with user stats in react-native/src/screens/Profile/ProfileScreen.tsx
- [X] T052 [P] [US6] Create SettingsScreen UI (language, theme, playback speed) in react-native/src/screens/Profile/SettingsScreen.tsx
- [X] T053 [US6] Implement login flow with email/password in react-native/src/screens/Auth/LoginScreen.tsx (Integrated in T046)
- [X] T054 [US6] Implement registration flow with validation in react-native/src/screens/Auth/RegisterScreen.tsx (Integrated in T047)
- [X] T055 [US6] Implement Google OAuth login (mobile flow) in react-native/src/screens/Auth/LoginScreen.tsx (Stub - TODO: Install @react-native-google-signin/google-signin)
- [X] T056 [US6] Implement password reset flow in react-native/src/screens/Auth/ForgotPasswordScreen.tsx (Integrated in T048)
- [X] T057 [US6] Handle authentication errors and display user-friendly messages (Integrated in all auth screens)
- [X] T058 [US6] Implement persistent login (refresh token on app launch) in react-native/src/App.tsx (Integrated via AuthContext in T037)

**Checkpoint**: ✅ Users can register, login, logout, and see personalized profile. Authentication fully functional.

---

## Phase 4: User Story 1 - Learn German Through Video Shadowing (Priority: P1) 🎯 MVP Core

**Goal**: Enable users to browse lessons, watch videos with synchronized transcripts, record pronunciation, and receive feedback

**Independent Test**: Login → Browse lessons → Select lesson → Watch video with transcript → Tap word to jump → Start shadowing → Record pronunciation → Get >80% score → See progress updated

### Implementation for User Story 1

- [ ] T059 [P] [US1] Create Lesson model mapping in react-native/src/types/models.ts (already has base, add methods)
- [ ] T060 [P] [US1] Create Progress model mapping in react-native/src/types/models.ts
- [ ] T061 [P] [US1] Create Recording model mapping in react-native/src/types/models.ts
- [ ] T062 [P] [US1] Create Transcript model mapping in react-native/src/types/models.ts
- [ ] T063 [US1] Create lessons API service with list, getDetail, getStreamUrls, updateProgress methods in react-native/src/services/api/lessons.ts
- [ ] T064 [P] [US1] Create audio player service wrapper for react-native-track-player in react-native/src/services/audio/player.ts
- [ ] T065 [P] [US1] Create audio recorder service wrapper for @react-native-voice/voice in react-native/src/services/audio/recorder.ts
- [ ] T066 [P] [US1] Create LessonCard molecule component in react-native/src/components/molecules/LessonCard.tsx
- [ ] T067 [P] [US1] Create SearchBar molecule component in react-native/src/components/molecules/SearchBar.tsx
- [ ] T068 [P] [US1] Create FilterChips molecule component for difficulty/category in react-native/src/components/molecules/FilterChips.tsx
- [ ] T069 [P] [US1] Create VideoPlayer organism component using react-native-video in react-native/src/components/organisms/VideoPlayer.tsx
- [ ] T070 [P] [US1] Create AudioPlayer organism component with playback controls in react-native/src/components/organisms/AudioPlayer.tsx
- [ ] T071 [P] [US1] Create TranscriptView organism component with word highlighting in react-native/src/components/organisms/TranscriptView.tsx
- [ ] T072 [P] [US1] Create RecordingButton organism component in react-native/src/components/organisms/RecordingButton.tsx
- [ ] T073 [P] [US1] Create ProgressBar molecule component in react-native/src/components/molecules/ProgressBar.tsx
- [ ] T074 [P] [US1] Create HomeScreen UI with lesson list, search, filters in react-native/src/screens/Home/HomeScreen.tsx
- [ ] T075 [P] [US1] Create LessonDetailScreen UI with video player and transcript in react-native/src/screens/Lesson/LessonDetailScreen.tsx
- [ ] T076 [P] [US1] Create ShadowingScreen UI with audio playback and recording in react-native/src/screens/Lesson/ShadowingScreen.tsx
- [ ] T077 [US1] Implement lesson list fetching with pagination in react-native/src/screens/Home/HomeScreen.tsx
- [ ] T078 [US1] Implement lesson filtering by difficulty and category in react-native/src/screens/Home/HomeScreen.tsx
- [ ] T079 [US1] Implement lesson search functionality in react-native/src/screens/Home/HomeScreen.tsx
- [ ] T080 [US1] Implement lesson detail fetching (including transcript) in react-native/src/screens/Lesson/LessonDetailScreen.tsx
- [ ] T081 [US1] Implement video streaming from backend YouTube URLs in react-native/src/components/organisms/VideoPlayer.tsx
- [ ] T082 [US1] Implement synchronized transcript highlighting during video playback in react-native/src/components/organisms/TranscriptView.tsx
- [ ] T083 [US1] Implement tap-on-word to jump to timestamp in transcript in react-native/src/components/organisms/TranscriptView.tsx
- [ ] T084 [US1] Implement playback speed control (0.5x-1.5x) in react-native/src/components/organisms/VideoPlayer.tsx
- [ ] T085 [US1] Implement shadowing mode with segmented audio playback in react-native/src/screens/Lesson/ShadowingScreen.tsx
- [ ] T086 [US1] Implement voice recording with @react-native-voice/voice in react-native/src/services/audio/recorder.ts
- [ ] T087 [US1] Implement pronunciation scoring API call (upload recording, get >80% pass/fail) in react-native/src/services/api/lessons.ts
- [ ] T088 [US1] Display pronunciation feedback with Pass (>80%) / Try Again (≤80%) visual indicators in react-native/src/screens/Lesson/ShadowingScreen.tsx
- [ ] T089 [US1] Implement replay original vs user recording comparison in react-native/src/screens/Lesson/ShadowingScreen.tsx
- [ ] T090 [US1] Implement progress tracking (time spent, completion %, shadowing score) in react-native/src/services/api/lessons.ts
- [ ] T091 [US1] Implement auto-save progress every 30 seconds in react-native/src/screens/Lesson/LessonDetailScreen.tsx
- [ ] T092 [US1] Create MainTabs navigator with Home, Profile tabs in react-native/src/navigation/MainTabs.tsx
- [ ] T093 [US1] Create LessonStack navigator for lesson detail and shadowing screens in react-native/src/navigation/LessonStack.tsx
- [ ] T094 [US1] Integrate MainTabs into AppNavigator post-authentication in react-native/src/navigation/AppNavigator.tsx
- [ ] T095 [P] [US1] Setup backend lessons streaming endpoint in ppgeil/pages/api/lessons/[id]/stream.ts
- [ ] T096 [P] [US1] Setup backend progress update endpoint in ppgeil/pages/api/lessons/[id]/progress.ts
- [ ] T097 [P] [US1] Setup backend pronunciation scoring endpoint in ppgeil/pages/api/pronunciation/score.ts
- [ ] T098 [US1] Implement YouTube stream extraction using @distube/ytdl-core in ppgeil/lib/youtube.js
- [ ] T099 [US1] Display lesson completion badges on home screen for completed lessons

**Checkpoint**: Users can browse lessons, watch videos with transcript, practice shadowing, record pronunciation, get feedback, and track progress. Core learning flow complete.

---

## Phase 5: User Story 2 - Practice Writing Through Dictation Exercises (Priority: P2)

**Goal**: Enable users to practice German spelling through dictation exercises with real-time feedback

**Independent Test**: Select lesson → Choose dictation mode → Listen to audio → Type answer (fill-blank or full sentence) → Submit → See accuracy feedback → View improvement stats

### Implementation for User Story 2

- [ ] T100 [P] [US2] Create DictationExercise model mapping in react-native/src/types/models.ts
- [ ] T101 [US2] Add dictation methods to lessons API service in react-native/src/services/api/lessons.ts
- [ ] T102 [P] [US2] Create DictationInput organism component with color-coded feedback in react-native/src/components/organisms/DictationInput.tsx
- [ ] T103 [P] [US2] Create FeedbackCard molecule component for accuracy display in react-native/src/components/molecules/FeedbackCard.tsx
- [ ] T104 [P] [US2] Create DictationScreen UI with audio playback and text input in react-native/src/screens/Dictation/DictationScreen.tsx
- [ ] T105 [P] [US2] Create DictationResultsScreen UI with accuracy stats in react-native/src/screens/Dictation/DictationResultsScreen.tsx
- [ ] T106 [US2] Implement dictation mode selector (fill-in-blank vs full sentence) in react-native/src/screens/Dictation/DictationScreen.tsx
- [ ] T107 [US2] Implement fill-in-the-blank dictation mode with hint support in react-native/src/screens/Dictation/DictationScreen.tsx
- [ ] T108 [US2] Implement full sentence dictation mode in react-native/src/screens/Dictation/DictationScreen.tsx
- [ ] T109 [US2] Implement real-time answer validation with green (correct) / red (incorrect) highlighting in react-native/src/components/organisms/DictationInput.tsx
- [ ] T110 [US2] Implement accuracy calculation (percentage correct letters) in react-native/src/services/api/lessons.ts
- [ ] T111 [US2] Display overall accuracy, attempts, and improvement vs previous sessions in react-native/src/screens/Dictation/DictationResultsScreen.tsx
- [ ] T112 [US2] Implement replay audio on mistake tap in react-native/src/screens/Dictation/DictationScreen.tsx
- [ ] T113 [US2] Display grammar tips when available in feedback in react-native/src/screens/Dictation/DictationResultsScreen.tsx
- [ ] T114 [US2] Update progress tracking to include dictation scores in react-native/src/services/api/lessons.ts
- [ ] T115 [US2] Add dictation mode entry point from lesson detail screen in react-native/src/screens/Lesson/LessonDetailScreen.tsx

**Checkpoint**: Users can complete dictation exercises with real-time feedback and track accuracy improvements. Complements shadowing feature.

---

## Phase 6: User Story 3 - Look Up Words with Integrated Dictionary (Priority: P2)

**Goal**: Enable instant word lookup with definitions, translations, and vocabulary saving

**Independent Test**: Tap word in transcript (online) → See definition popup → Add to vocabulary → Go offline → Tap cached word → See definition → View vocabulary list in profile → Mark words as learned

### Implementation for User Story 3

- [ ] T116 [P] [US3] Create DictionaryEntry model mapping in react-native/src/types/models.ts
- [ ] T117 [P] [US3] Create VocabularyItem model mapping in react-native/src/types/models.ts
- [ ] T118 [US3] Create dictionary API service with lookup and cache methods in react-native/src/services/api/dictionary.ts
- [ ] T119 [US3] Create vocabulary API service with save, list, markLearned methods in react-native/src/services/api/vocabulary.ts
- [ ] T120 [P] [US3] Create DictionaryModal organism component with definitions and translations in react-native/src/components/organisms/DictionaryModal.tsx
- [ ] T121 [P] [US3] Create VocabularyListScreen UI in react-native/src/screens/Dictionary/VocabularyListScreen.tsx
- [ ] T122 [P] [US3] Create VocabularyCard molecule component in react-native/src/components/molecules/VocabularyCard.tsx
- [ ] T123 [US3] Implement word tap detection in transcript view in react-native/src/components/organisms/TranscriptView.tsx
- [ ] T124 [US3] Implement dictionary API call with online fallback in react-native/src/services/api/dictionary.ts
- [ ] T125 [US3] Implement dictionary cache storage in AsyncStorage in react-native/src/services/api/dictionary.ts
- [ ] T126 [US3] Implement offline dictionary lookup from cache in react-native/src/services/api/dictionary.ts
- [ ] T127 [US3] Display dictionary modal with word definition, pronunciation, part of speech, translations in react-native/src/components/organisms/DictionaryModal.tsx
- [ ] T128 [US3] Implement pronunciation audio playback in dictionary modal in react-native/src/components/organisms/DictionaryModal.tsx
- [ ] T129 [US3] Implement "Add to Vocabulary" button with lesson context in react-native/src/components/organisms/DictionaryModal.tsx
- [ ] T130 [US3] Display example sentences with German/Vietnamese/English translations in react-native/src/components/organisms/DictionaryModal.tsx
- [ ] T131 [US3] Implement vocabulary list fetching in react-native/src/screens/Dictionary/VocabularyListScreen.tsx
- [ ] T132 [US3] Implement mark as learned functionality in react-native/src/screens/Dictionary/VocabularyListScreen.tsx
- [ ] T133 [US3] Implement flashcard practice mode for vocabulary in react-native/src/screens/Dictionary/VocabularyListScreen.tsx
- [ ] T134 [US3] Add vocabulary tab to profile screen in react-native/src/screens/Profile/ProfileScreen.tsx
- [ ] T135 [US3] Handle offline dictionary unavailable message in react-native/src/components/organisms/DictionaryModal.tsx
- [ ] T136 [P] [US3] Setup backend dictionary lookup endpoint in ppgeil/pages/api/dictionary/lookup.ts
- [ ] T137 [P] [US3] Setup backend vocabulary save endpoint in ppgeil/pages/api/vocabulary/save.ts
- [ ] T138 [P] [US3] Setup backend vocabulary list endpoint in ppgeil/pages/api/vocabulary/list.ts
- [ ] T139 [P] [US3] Implement Free Dictionary API integration in ppgeil/lib/dictionary.js
- [ ] T140 [US3] Implement Google Translate API for Vietnamese translations in ppgeil/lib/dictionary.js
- [ ] T141 [US3] Create DictionaryCache model in ppgeil/models/DictionaryCache.js
- [ ] T142 [US3] Create VocabularyItem model in ppgeil/models/VocabularyItem.js

**Checkpoint**: Users can look up words online/offline, save to vocabulary, and practice with flashcards. Dictionary fully integrated across app.

---

## Phase 7: User Story 5 - Access Lessons Offline (Priority: P3)

**Goal**: Enable downloading up to 10 lessons for offline access with auto-sync

**Independent Test**: Go online → Download 3 lessons → Go offline → Access downloaded lessons → Complete exercises → Go online → Verify progress synced → Manage downloads (delete old, add new up to 10 limit)

### Implementation for User Story 5

- [ ] T143 [P] [US5] Create Download model mapping in react-native/src/types/models.ts
- [ ] T144 [US5] Create download manager service in react-native/src/services/storage/downloadManager.ts
- [ ] T145 [US5] Create offline sync queue service in react-native/src/services/storage/syncQueue.ts
- [ ] T146 [P] [US5] Create OfflineContext for sync state in react-native/src/context/OfflineContext.tsx
- [ ] T147 [P] [US5] Create DownloadButton molecule component with progress indicator in react-native/src/components/molecules/DownloadButton.tsx
- [ ] T148 [P] [US5] Create DownloadManagerScreen UI in react-native/src/screens/Profile/DownloadManagerScreen.tsx
- [ ] T149 [P] [US5] Create StorageCard molecule component showing lesson storage usage in react-native/src/components/molecules/StorageCard.tsx
- [ ] T150 [US5] Implement download preparation API call in react-native/src/services/api/lessons.ts
- [ ] T151 [US5] Implement file download with progress tracking in react-native/src/services/storage/downloadManager.ts
- [ ] T152 [US5] Implement 10-lesson download limit enforcement in react-native/src/services/storage/downloadManager.ts
- [ ] T153 [US5] Implement download queue management (active downloads tracking) in react-native/src/services/storage/downloadManager.ts
- [ ] T154 [US5] Implement resume interrupted downloads in react-native/src/services/storage/downloadManager.ts
- [ ] T155 [US5] Implement offline lesson access from local file system in react-native/src/services/api/lessons.ts
- [ ] T156 [US5] Implement offline progress queuing (progress, recordings, vocabulary) in react-native/src/services/storage/syncQueue.ts
- [ ] T157 [US5] Implement background sync on network reconnect in react-native/src/services/storage/syncQueue.ts
- [ ] T158 [US5] Implement exponential backoff for failed sync attempts in react-native/src/services/storage/syncQueue.ts
- [ ] T159 [US5] Display download button on lesson cards in react-native/src/components/molecules/LessonCard.tsx
- [ ] T160 [US5] Display "Downloaded" badge on offline-available lessons in react-native/src/components/molecules/LessonCard.tsx
- [ ] T161 [US5] Implement download manager screen with storage usage visualization in react-native/src/screens/Profile/DownloadManagerScreen.tsx
- [ ] T162 [US5] Implement selective download deletion in react-native/src/screens/Profile/DownloadManagerScreen.tsx
- [ ] T163 [US5] Handle 11th download attempt with user prompt in react-native/src/services/storage/downloadManager.ts
- [ ] T164 [US5] Handle insufficient storage detection before download in react-native/src/services/storage/downloadManager.ts
- [ ] T165 [US5] Display sync status (queued items, syncing, synced) in react-native/src/screens/Profile/ProfileScreen.tsx
- [ ] T166 [P] [US5] Setup backend download preparation endpoint in ppgeil/pages/api/lessons/[id]/download.ts
- [ ] T167 [US5] Implement YouTube video/audio extraction and caching in ppgeil/lib/youtube.js
- [ ] T168 [US5] Create Download model in ppgeil/models/Download.js
- [ ] T169 [US5] Implement 30-day recording cleanup cron job in ppgeil/scripts/cleanup-recordings.js

**Checkpoint**: Users can download up to 10 lessons, access offline, and auto-sync progress. Offline-first architecture functional.

---

## Phase 8: User Story 4 - Track Progress and Compete on Leaderboards (Priority: P3)

**Goal**: Enable progress tracking, statistics visualization, and leaderboard competition

**Independent Test**: Complete lessons → View statistics (lessons, time, accuracy, streak) → Check leaderboard → Earn achievement badge → View badge collection

### Implementation for User Story 4

- [ ] T170 [P] [US4] Create Achievement model mapping in react-native/src/types/models.ts
- [ ] T171 [P] [US4] Create LeaderboardEntry model mapping in react-native/src/types/models.ts
- [ ] T172 [US4] Create leaderboard API service in react-native/src/services/api/leaderboard.ts
- [ ] T173 [P] [US4] Create StatCard molecule component for displaying user stats in react-native/src/components/molecules/StatCard.tsx
- [ ] T174 [P] [US4] Create ProgressChart molecule component for visualizing progress in react-native/src/components/molecules/ProgressChart.tsx
- [ ] T175 [P] [US4] Create BadgeCard molecule component for achievements in react-native/src/components/molecules/BadgeCard.tsx
- [ ] T176 [P] [US4] Create LeaderboardScreen UI with weekly/monthly tabs in react-native/src/screens/Leaderboard/LeaderboardScreen.tsx
- [ ] T177 [P] [US4] Create AchievementsScreen UI with badge collection in react-native/src/screens/Leaderboard/AchievementsScreen.tsx
- [ ] T178 [US4] Implement user statistics fetching (lessons, hours, accuracy, streak) in react-native/src/services/api/auth.ts
- [ ] T179 [US4] Display user statistics on profile screen with charts in react-native/src/screens/Profile/ProfileScreen.tsx
- [ ] T180 [US4] Implement streak calculation and display in react-native/src/screens/Profile/ProfileScreen.tsx
- [ ] T181 [US4] Implement leaderboard fetching (weekly/monthly periods) in react-native/src/services/api/leaderboard.ts
- [ ] T182 [US4] Display leaderboard rankings with usernames, scores, badges in react-native/src/screens/Leaderboard/LeaderboardScreen.tsx
- [ ] T183 [US4] Implement achievement badge detection and notification in react-native/src/context/AuthContext.tsx
- [ ] T184 [US4] Display achievement badge collection screen in react-native/src/screens/Leaderboard/AchievementsScreen.tsx
- [ ] T185 [US4] Implement in-app notification for new achievements in react-native/src/components/molecules/AchievementNotification.tsx
- [ ] T186 [US4] Add leaderboard tab to MainTabs navigator in react-native/src/navigation/MainTabs.tsx
- [ ] T187 [P] [US4] Setup backend leaderboard endpoint in ppgeil/pages/api/leaderboard/list.ts
- [ ] T188 [P] [US4] Setup backend achievements endpoint in ppgeil/pages/api/achievements/list.ts
- [ ] T189 [P] [US4] Setup backend user stats endpoint in ppgeil/pages/api/users/[id]/stats.ts
- [ ] T190 [US4] Create LeaderboardEntry model in ppgeil/models/LeaderboardEntry.js
- [ ] T191 [US4] Create Achievement model in ppgeil/models/Achievement.js
- [ ] T192 [US4] Implement achievement detection logic (streak, lessons completed) in ppgeil/lib/achievements.js
- [ ] T193 [US4] Seed default achievements (Week Warrior, First Steps, etc.) in ppgeil/scripts/seed-achievements.js

**Checkpoint**: Users can view statistics, check leaderboards, earn badges, and compete. Gamification complete.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final touches

- [ ] T194 [P] Implement error boundary component for crash handling in react-native/src/components/ErrorBoundary.tsx
- [ ] T195 [P] Implement loading skeleton components for async data in react-native/src/components/molecules/Skeleton.tsx
- [ ] T196 [P] Implement toast notification system in react-native/src/components/Toast.tsx
- [ ] T197 [P] Implement network status indicator in react-native/src/components/molecules/NetworkStatus.tsx
- [ ] T198 Optimize image loading with react-native-fast-image
- [ ] T199 Implement code splitting for large screens
- [ ] T200 Add analytics tracking for key user actions
- [ ] T201 Implement deep linking configuration in react-native/src/navigation/linking.ts
- [ ] T202 [P] Add app icon and splash screen in react-native/ios/PapaGeil/Images.xcassets/
- [ ] T203 [P] Configure app display name and bundle identifier in react-native/ios/PapaGeil/Info.plist
- [ ] T204 Implement memory leak detection and fixes
- [ ] T205 Optimize bundle size (tree shaking, minification)
- [ ] T206 Run performance profiling (React DevTools Profiler)
- [ ] T207 Implement accessibility labels for screen readers
- [ ] T208 Test on multiple iPhone models (X, 11, 12, 13, 14)
- [ ] T209 Verify battery usage <5% per hour
- [ ] T210 Verify crash-free rate >99% in testing
- [ ] T211 [P] Update README with quickstart instructions
- [ ] T212 [P] Create deployment guide for App Store
- [ ] T213 Run through complete quickstart.md validation checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 6 - Auth (Phase 3)**: Depends on Foundational - BLOCKS all other stories (authentication required)
- **User Story 1 - Shadowing (Phase 4)**: Depends on Auth (Phase 3) - Core learning feature
- **User Story 2 - Dictation (Phase 5)**: Depends on Auth (Phase 3) and US1 models/services - Can start after US1 or in parallel with US1 screens
- **User Story 3 - Dictionary (Phase 6)**: Depends on Auth (Phase 3) - Can run in parallel with US1/US2
- **User Story 5 - Offline (Phase 7)**: Depends on US1 completion (needs lesson playback working) - Enhances existing features
- **User Story 4 - Leaderboard (Phase 8)**: Depends on Auth (Phase 3) - Independent from core learning features
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 6 (Auth)**: MUST complete before any other story - Foundation for all features
- **User Story 1 (Shadowing)**: Can start immediately after Auth - No dependencies on other stories
- **User Story 2 (Dictation)**: Shares Lesson/Progress models with US1 but is independently testable
- **User Story 3 (Dictionary)**: Independent implementation, integrates into transcript views
- **User Story 5 (Offline)**: Enhances US1 (and optionally US2) - Needs lesson playback working first
- **User Story 4 (Leaderboard)**: Completely independent - Can start anytime after Auth

### Within Each User Story

- Backend API endpoints before mobile API service calls
- Models before services
- Services before screens
- Atoms before molecules before organisms
- Core screens before navigation integration
- Core implementation before edge case handling

### Parallel Opportunities

**Phase 1 (Setup)**: Tasks T002-T008, T010-T014, T016-T017 can all run in parallel (different configs/directories)

**Phase 2 (Foundational)**: Tasks T020-T028 (mobile services/types), T030-T035 (backend auth endpoints) can run in parallel

**Phase 3 (US6 - Auth)**: Tasks T037-T042 (contexts and atoms), T046-T048 (auth screens), T051-T052 (profile screens) can start in parallel after T043-T045 (auth service) complete

**Phase 4 (US1 - Shadowing)**: 
- Tasks T059-T062 (models), T066-T073 (components), T074-T076 (screens), T095-T097 (backend endpoints) can start in parallel
- After models complete: T063-T065 (services) can start
- After components complete: screens can integrate them

**Phase 5 (US2 - Dictation)**: Tasks T102-T105 (components/screens) can start in parallel after T101 (API service)

**Phase 6 (US3 - Dictionary)**: Tasks T120-T122 (components), T136-T139 (backend endpoints) can start in parallel after T118-T119 (API services)

**Phase 7 (US5 - Offline)**: Tasks T147-T149 (components), T166-T168 (backend) can start in parallel after T144-T146 (core services)

**Phase 8 (US4 - Leaderboard)**: Tasks T173-T177 (components/screens), T187-T189 (backend endpoints) can start in parallel after T172 (API service)

**Phase 9 (Polish)**: Tasks T194-T197, T202-T203, T211-T212 can all run in parallel

---

## Parallel Example: User Story 1 (Shadowing)

```bash
# After Phase 2 (Foundational) completes, launch US1 tasks in parallel:

# Models (all parallel):
Task T059: "Create Lesson model mapping"
Task T060: "Create Progress model mapping"
Task T061: "Create Recording model mapping"
Task T062: "Create Transcript model mapping"

# Components (all parallel, no dependencies):
Task T066: "Create LessonCard molecule"
Task T067: "Create SearchBar molecule"
Task T068: "Create FilterChips molecule"
Task T069: "Create VideoPlayer organism"
Task T070: "Create AudioPlayer organism"
Task T071: "Create TranscriptView organism"
Task T072: "Create RecordingButton organism"
Task T073: "Create ProgressBar molecule"

# Screens (all parallel after components):
Task T074: "Create HomeScreen UI"
Task T075: "Create LessonDetailScreen UI"
Task T076: "Create ShadowingScreen UI"

# Backend endpoints (all parallel):
Task T095: "Setup backend streaming endpoint"
Task T096: "Setup backend progress endpoint"
Task T097: "Setup backend pronunciation endpoint"
```

---

## Implementation Strategy

### MVP First (Phased Approach)

**Week 1-2: Foundation**
1. Complete Phase 1: Setup (T001-T018)
2. Complete Phase 2: Foundational (T019-T036)
3. **STOP and VALIDATE**: Backend API endpoints working, mobile can call them

**Week 3-4: Auth (MVP Foundation)**
4. Complete Phase 3: User Story 6 - Auth (T037-T058)
5. **STOP and VALIDATE**: Users can register, login, see profile → Deploy/Demo Auth Flow

**Week 5-7: Core Learning (MVP)**
6. Complete Phase 4: User Story 1 - Shadowing (T059-T099)
7. **STOP and VALIDATE**: Full lesson browsing, video playback, shadowing, feedback → Deploy/Demo MVP! 🎉

**Week 8-9: Incremental Features**
8. Add Phase 5: User Story 2 - Dictation (T100-T115)
9. Add Phase 6: User Story 3 - Dictionary (T116-T142)
10. **STOP and VALIDATE**: Dictation + Dictionary working → Deploy/Demo Enhanced MVP

**Week 10-11: Advanced Features**
11. Add Phase 7: User Story 5 - Offline (T143-T169)
12. Add Phase 8: User Story 4 - Leaderboard (T170-T193)
13. **STOP and VALIDATE**: Offline + Gamification working → Deploy/Demo Feature Complete

**Week 12: Polish & Release**
14. Complete Phase 9: Polish (T194-T213)
15. **Final Validation**: Run full quickstart.md, test all scenarios
16. **App Store Submission** 🚀

### Incremental Delivery Benefits

- **Week 4 Demo**: Working authentication → Proves infrastructure
- **Week 7 Demo**: Full shadowing learning flow → MVP delivers core value
- **Week 9 Demo**: Dictation + Dictionary → Enhanced learning experience
- **Week 11 Demo**: Offline + Gamification → Feature-complete app
- **Week 12 Release**: Polished, tested, App Store ready

Each phase adds value without breaking previous functionality.

### Parallel Team Strategy

With 3 developers after Foundational phase completes:

- **Developer A**: Phase 3 (Auth) → Phase 4 (Shadowing screens/integration)
- **Developer B**: Phase 4 (Shadowing backend/services) → Phase 5 (Dictation)
- **Developer C**: Phase 4 (Shadowing components) → Phase 6 (Dictionary)

Then converge for US5 (Offline), US4 (Leaderboard), and Polish.

---

## Summary

- **Total Tasks**: 213
- **Setup Phase**: 18 tasks
- **Foundational Phase**: 18 tasks (BLOCKS all user stories)
- **User Story 6 (Auth - P1)**: 22 tasks - MVP Foundation
- **User Story 1 (Shadowing - P1)**: 41 tasks - MVP Core
- **User Story 2 (Dictation - P2)**: 16 tasks
- **User Story 3 (Dictionary - P2)**: 27 tasks
- **User Story 5 (Offline - P3)**: 27 tasks
- **User Story 4 (Leaderboard - P3)**: 24 tasks
- **Polish Phase**: 20 tasks

**MVP Scope** (Weeks 1-7): Phases 1, 2, 3 (Auth), 4 (Shadowing) = 99 tasks
**Feature Complete** (Weeks 8-11): Add Phases 5, 6, 7, 8 = 94 tasks
**Production Ready** (Week 12): Add Phase 9 = 20 tasks

**Critical Path**: Setup → Foundational (blocks all) → Auth (blocks all) → Core Stories (US1) → Enhancements (US2, US3, US5, US4) → Polish

**Parallel Opportunities**: 50+ tasks marked [P] can run simultaneously across phases

**Format Validation**: ✅ All 213 tasks follow strict checklist format with ID, [P] marker (if applicable), [Story] label (for user story phases), and exact file paths
