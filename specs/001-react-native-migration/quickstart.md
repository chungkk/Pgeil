# Quickstart Guide: React Native German Learning App

**Feature**: Native iOS Migration  
**Date**: 2024-12-17  
**Estimated Setup Time**: 60-90 minutes

---

## Prerequisites

### Required Software

| Tool | Version | Purpose |
|------|---------|---------|
| **Node.js** | 20+ | Backend and mobile development |
| **npm** | 10+ | Package management |
| **Xcode** | 15+ | iOS development and simulator |
| **CocoaPods** | 1.14+ | iOS dependency management |
| **MongoDB** | 6+ | Database (or MongoDB Atlas) |
| **Git** | 2.40+ | Version control |

### Recommended Software

- **React Native Debugger** - Enhanced debugging
- **Postman/Insomnia** - API testing
- **MongoDB Compass** - Database GUI
- **VSCode** - Code editor with extensions:
  - ES7+ React/Redux/React-Native snippets
  - Prettier
  - ESLint

### System Requirements

- **macOS** 12+ (required for iOS development)
- **8GB RAM** minimum, 16GB recommended
- **50GB free disk space** (Xcode, simulators, dependencies)

---

## Project Structure

```
Pgeil/
├── ppgeil/                    # Backend (Next.js API) - Existing
├── react-native/              # Mobile app (React Native) - New
└── specs/                     # Documentation
    └── 001-react-native-migration/
        ├── spec.md
        ├── plan.md
        ├── research.md
        ├── data-model.md
        ├── quickstart.md (this file)
        └── contracts/
```

---

## Part 1: Backend Setup (Next.js API)

### 1.1 Clone Repository

```bash
cd /Users/chungkk/Desktop/GG\ Driver/code/Pgeil
git status  # Confirm on 001-react-native-migration branch
```

### 1.2 Install Backend Dependencies

```bash
cd ppgeil
npm install
```

### 1.3 Configure Environment Variables

Create `.env.local` file:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/german-learning-app
# Or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/german-learning-app

# Authentication
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_REFRESH_SECRET=your-refresh-token-secret-key-32-chars
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-32-characters

# Google OAuth (if using)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OpenAI (pronunciation scoring)
OPENAI_API_KEY=sk-...

# Email (optional - for verification emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# YouTube (optional - if custom API key needed)
# YOUTUBE_API_KEY=your-youtube-api-key
```

### 1.4 Start MongoDB

**Option A: Local MongoDB**
```bash
# Install via Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify running
mongo --eval "db.version()"
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create free M0 cluster
3. Get connection string
4. Add to `.env.local`

### 1.5 Seed Database (Optional)

```bash
# Run seeder script (if available)
node scripts/seed-database.js

# Or manually create admin user:
node scripts/create-admin.js
```

### 1.6 Start Backend Server

```bash
npm run dev
```

Backend running at: **http://localhost:3000**

### 1.7 Test Backend API

```bash
# Health check
curl http://localhost:3000/api/health

# Test login (if seeded)
curl -X POST http://localhost:3000/api/auth/mobile/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!@"}'
```

---

## Part 2: Mobile App Setup (React Native)

### 2.1 Initialize React Native Project

```bash
cd /Users/chungkk/Desktop/GG\ Driver/code/Pgeil

# Create React Native app
npx react-native@latest init PapaGeil --template react-native-template-typescript

# Rename to match our structure
mv PapaGeil react-native
cd react-native
```

### 2.2 Install Dependencies

```bash
# Core navigation
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install react-native-gesture-handler react-native-reanimated

# Audio/Video
npm install react-native-track-player react-native-video

# Storage
npm install @react-native-async-storage/async-storage react-native-secure-storage

# Speech recognition
npm install @react-native-voice/voice

# Network
npm install axios @react-native-community/netinfo

# UI Components
npm install react-native-vector-icons

# i18n
npm install react-i18next i18next

# Date utilities
npm install date-fns

# Install iOS pods
cd ios
pod install
cd ..
```

### 2.3 Configure Environment

Create `.env` file:

```bash
# Copy example
cp .env.example .env
```

Edit `.env`:

```env
# API Base URL
API_BASE_URL=http://localhost:3000
# For physical device, use computer's IP:
# API_BASE_URL=http://192.168.1.100:3000

# Environment
NODE_ENV=development

# Feature Flags
ENABLE_OFFLINE_MODE=true
ENABLE_LEADERBOARD=true
MAX_OFFLINE_LESSONS=10
```

### 2.4 Setup iOS Configuration

Edit `ios/PapaGeil/Info.plist`:

```xml
<!-- Microphone Permission -->
<key>NSMicrophoneUsageDescription</key>
<string>We need access to your microphone for pronunciation practice</string>

<!-- Camera Permission (optional, for profile photo) -->
<key>NSCameraUsageDescription</key>
<string>We need access to your camera for profile photo</string>

<!-- Photo Library Permission -->
<key>NSPhotoLibraryUsageDescription</key>
<string>We need access to your photo library for profile photo</string>

<!-- Allow HTTP (development only) -->
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSAllowsArbitraryLoads</key>
  <true/>
</dict>
```

### 2.5 Configure react-native-track-player

Create `react-native/src/services/audio/setup.ts`:

```typescript
import TrackPlayer, { Capability } from 'react-native-track-player';

export async function setupAudioPlayer() {
  await TrackPlayer.setupPlayer();
  await TrackPlayer.updateOptions({
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.Stop,
      Capability.SeekTo,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
    ],
    compactCapabilities: [Capability.Play, Capability.Pause],
  });
}
```

### 2.6 Create Project Structure

```bash
# Create directories
mkdir -p src/{navigation,screens,components,services,context,hooks,utils,styles,assets,types}
mkdir -p src/screens/{Auth,Home,Lesson,Dictation,Dictionary,Profile,Leaderboard}
mkdir -p src/components/{atoms,molecules,organisms}
mkdir -p src/services/{api,storage,audio,youtube}
mkdir -p src/assets/{images,fonts,locales}

# Create placeholder files
touch src/App.tsx
touch src/navigation/AppNavigator.tsx
touch src/services/api/client.ts
```

### 2.7 Configure TypeScript

Edit `tsconfig.json`:

```json
{
  "extends": "@react-native/typescript-config/tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/screens/*": ["src/screens/*"],
      "@/services/*": ["src/services/*"],
      "@/utils/*": ["src/utils/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "ios", "android"]
}
```

### 2.8 Start Metro Bundler

```bash
npm start
```

### 2.9 Run on iOS Simulator

```bash
# In a new terminal
npm run ios

# Or open in Xcode
open ios/PapaGeil.xcworkspace
# Then press Cmd+R to build and run
```

---

## Part 3: Verification

### 3.1 Backend Health Check

```bash
curl http://localhost:3000/api/health

# Expected:
# {"success":true,"message":"API is healthy"}
```

### 3.2 Mobile App Launch

1. App should launch on iOS simulator
2. You should see the initial splash/welcome screen
3. No red error screens

### 3.3 API Connection Test

Add this to `App.tsx`:

```typescript
useEffect(() => {
  fetch('http://localhost:3000/api/health')
    .then(res => res.json())
    .then(data => console.log('API Health:', data))
    .catch(err => console.error('API Error:', err));
}, []);
```

Check Metro logs for "API Health: {success: true}"

---

## Part 4: Development Workflow

### 4.1 Running Both Services

**Terminal 1 - Backend:**
```bash
cd ppgeil
npm run dev
```

**Terminal 2 - Mobile:**
```bash
cd react-native
npm start
```

**Terminal 3 - iOS:**
```bash
cd react-native
npm run ios
```

### 4.2 Hot Reload

- **Backend**: Automatic restart on file changes (Next.js)
- **Mobile**: Fast Refresh enabled by default
- Press **`r`** in Metro terminal to reload
- Press **`d`** to open developer menu in simulator

### 4.3 Debugging

**React Native Debugger:**
```bash
# Install
brew install --cask react-native-debugger

# Run
open "rndebugger://set-debugger-loc?host=localhost&port=8081"
```

**iOS Simulator Debug Menu:**
- Press **Cmd+D** in simulator
- Enable "Debug" or "Element Inspector"

**Console Logs:**
- View in Metro terminal
- Or check Xcode console (Cmd+Shift+C in Xcode)

---

## Part 5: Common Issues & Solutions

### Issue: "Pod install failed"

```bash
cd ios
pod deintegrate
pod install
```

### Issue: "Unable to resolve module"

```bash
# Clear Metro cache
npm start -- --reset-cache

# Clear watchman
watchman watch-del-all

# Reinstall
rm -rf node_modules
npm install
cd ios && pod install && cd ..
```

### Issue: "Cannot connect to backend"

**For physical device:**
1. Find computer's local IP: `ifconfig | grep "inet "`
2. Update `.env`: `API_BASE_URL=http://192.168.1.100:3000`
3. Ensure both devices on same Wi-Fi network

### Issue: "Google OAuth not working"

1. Get OAuth client IDs from Google Cloud Console
2. Add to backend `.env.local`
3. Configure redirect URIs in Google Console

### Issue: "MongoDB connection failed"

```bash
# Check MongoDB running
brew services list | grep mongodb

# Restart
brew services restart mongodb-community

# Check logs
tail -f /usr/local/var/log/mongodb/mongo.log
```

---

## Part 6: Next Steps

### Immediate Tasks

1. ✅ Backend and mobile running
2. → **Implement authentication screens** (Login, Register)
3. → **Implement home screen** (Lesson list)
4. → **Connect to backend API** (auth service)

### Development Order

**Phase 1: Authentication (Week 1)**
- [ ] Login screen
- [ ] Register screen
- [ ] Auth service integration
- [ ] Token storage (SecureStore)
- [ ] Auto-refresh interceptor

**Phase 2: Core Screens (Week 2-3)**
- [ ] Home screen (lesson list)
- [ ] Lesson detail screen
- [ ] Video player integration
- [ ] Progress tracking

**Phase 3: Features (Week 4-6)**
- [ ] Shadowing mode
- [ ] Dictation exercises
- [ ] Dictionary integration
- [ ] Offline downloads

### Documentation References

- [Spec](./spec.md) - Feature requirements
- [Plan](./plan.md) - Implementation strategy
- [Research](./research.md) - Technology decisions
- [Data Model](./data-model.md) - Database schemas
- [API Contracts](./contracts/) - Backend API specs

### Useful Commands

```bash
# Backend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint

# Mobile
npm start            # Start Metro bundler
npm run ios          # Run on iOS simulator
npm run ios --device # Run on physical device
npm test             # Run Jest tests
npm run lint         # Run ESLint
```

---

## Support

**Issues**: Create GitHub issues with logs and steps to reproduce  
**Documentation**: See `/specs/001-react-native-migration/`  
**Backend Logs**: `ppgeil/.next/trace` and console output  
**Mobile Logs**: Metro bundler output and Xcode console

---

## Checklist

Before starting development, ensure:

- [ ] Backend running on http://localhost:3000
- [ ] MongoDB connected and accessible
- [ ] Mobile app launches on iOS simulator
- [ ] API connection test passes
- [ ] Environment variables configured
- [ ] Xcode simulator available
- [ ] All dependencies installed (no errors)
- [ ] Hot reload working for both backend and mobile
- [ ] Debugger tools accessible

**Setup Complete!** 🎉 Ready for development.
