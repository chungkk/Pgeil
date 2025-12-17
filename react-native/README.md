# PapaGeil - German Learning App (React Native)

A mobile iOS app for learning German through video shadowing, dictation exercises, and interactive content.

## Features

✅ **Video Shadowing**: Learn pronunciation by shadowing native speakers  
✅ **Dictation Practice**: Improve spelling through fill-in-the-blank and full sentence exercises  
✅ **Integrated Dictionary**: Look up words instantly with offline caching  
✅ **Offline Downloads**: Download up to 10 lessons for offline access  
✅ **Leaderboards**: Compete with other learners on weekly, monthly, and all-time rankings  
✅ **Achievements**: Earn badges for milestones (7 default achievements)  
✅ **Progress Tracking**: Track lessons, practice time, accuracy, and streaks  

---

## Prerequisites

- **Node.js**: 18+ (20+ recommended)
- **React Native**: 0.73+
- **iOS**: Xcode 15+, iOS 13+ target
- **CocoaPods**: For iOS dependencies
- **Backend API**: Running instance of the Next.js backend

---

## Quick Start

### 1. Install Dependencies

```bash
cd react-native
npm install
```

### 2. Install iOS Dependencies

```bash
cd ios
pod install
cd ..
```

### 3. Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
API_BASE_URL=http://localhost:3000
# or your backend URL
```

### 4. Run on iOS

```bash
npm run ios
# or for specific device
npm run ios -- --simulator="iPhone 14"
```

### 5. Development Mode

```bash
# Start Metro bundler
npm start

# Run on device
npm run ios
```

---

## Project Structure

```
react-native/
├── src/
│   ├── navigation/           # React Navigation setup
│   │   ├── AppNavigator.tsx
│   │   ├── AuthStack.tsx
│   │   ├── MainTabs.tsx
│   │   └── LessonStack.tsx
│   ├── screens/              # All app screens
│   │   ├── Auth/
│   │   ├── Home/
│   │   ├── Lesson/
│   │   ├── Dictation/
│   │   ├── Dictionary/
│   │   ├── Profile/
│   │   └── Leaderboard/
│   ├── components/           # Reusable components
│   │   ├── atoms/
│   │   ├── molecules/
│   │   └── organisms/
│   ├── services/             # API, storage, utils
│   │   ├── api/
│   │   ├── storage/
│   │   └── audio/
│   ├── context/              # React Context
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   ├── LanguageContext.tsx
│   │   └── OfflineContext.tsx
│   ├── hooks/                # Custom hooks
│   ├── types/                # TypeScript definitions
│   ├── styles/               # Global styles
│   └── assets/               # Images, fonts, i18n
├── ios/                      # iOS native code
├── __tests__/                # Tests
└── package.json
```

---

## Available Scripts

```bash
# Development
npm start                  # Start Metro bundler
npm run ios               # Run on iOS simulator
npm run android           # Run on Android (future)

# Testing
npm test                  # Run Jest tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report

# Code Quality
npm run lint              # Run ESLint
npm run lint:fix          # Fix linting issues
npm run typecheck         # TypeScript check

# Build
npm run build:ios         # Build iOS app
```

---

## Key Technologies

- **React Native 0.73+**: Mobile framework
- **TypeScript**: Type safety
- **React Navigation 6+**: Navigation
- **AsyncStorage**: Local storage
- **NetInfo**: Network connectivity
- **React Native Track Player**: Audio playback
- **React Native Video**: Video playback
- **React Native Voice**: Speech recognition
- **React Native FS**: File system access
- **Axios**: HTTP client
- **React i18next**: Internationalization

---

## Configuration

### API Configuration

Edit `src/services/api/client.ts` to configure API base URL and authentication.

### Offline Support

The app supports offline mode with:
- Dictionary caching (90-day TTL)
- Lesson downloads (max 10)
- Progress sync queue
- Auto-sync on reconnect

### Deep Linking

The app supports deep links:

```
papageil://lessons/:lessonId
papageil://profile
papageil://leaderboard
papageil://achievements
```

Configure in `ios/PapaGeil/Info.plist` and `src/navigation/linking.ts`.

---

## Testing

### Unit Tests

```bash
npm test
```

### E2E Tests (Detox)

```bash
# Build for testing
npm run build:e2e

# Run tests
npm run test:e2e
```

---

## Troubleshooting

### iOS Build Issues

**Pod install fails:**
```bash
cd ios
pod deintegrate
pod install
```

**Xcode build errors:**
- Clean build folder: Product → Clean Build Folder
- Delete DerivedData: ~/Library/Developer/Xcode/DerivedData/

**Metro bundler issues:**
```bash
npm start -- --reset-cache
```

### Common Issues

**Network errors:**
- Check `.env` file has correct `API_BASE_URL`
- Ensure backend is running
- For iOS simulator, use `http://localhost:3000`

**Audio/Video not playing:**
- Check iOS permissions in Info.plist
- Verify file URLs are accessible

**Downloads failing:**
- Check storage permissions
- Verify minimum 100MB free space
- Check network connectivity

---

## Development Guidelines

### Code Style

- Use TypeScript for all new files
- Follow ESLint configuration
- Use functional components with hooks
- Keep components small and focused

### File Naming

- Components: PascalCase (e.g., `LessonCard.tsx`)
- Utilities: camelCase (e.g., `formatTime.ts`)
- Constants: UPPER_SNAKE_CASE

### Component Structure

```typescript
// 1. Imports
import React from 'react';
import { View, Text } from 'react-native';

// 2. Types/Interfaces
interface MyComponentProps {
  title: string;
}

// 3. Component
export default function MyComponent({ title }: MyComponentProps) {
  // Logic
  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
}

// 4. Styles
const styles = StyleSheet.create({
  // ...
});
```

---

## Performance Tips

- Use `React.memo()` for expensive components
- Implement `FlatList` for long lists
- Use `Image` with proper `resizeMode`
- Enable Hermes engine (default in RN 0.70+)
- Lazy load screens with `React.lazy()` (future enhancement)

---

## Deployment

See `DEPLOYMENT.md` for App Store deployment instructions.

---

## Contributing

1. Create feature branch from `main`
2. Make changes with descriptive commits
3. Run tests and linting
4. Create pull request
5. Wait for review and merge

---

## License

Proprietary - All rights reserved

---

## Support

For issues or questions:
- GitHub Issues: [repository]/issues
- Email: support@papageil.com

---

## Changelog

See `CHANGELOG.md` for version history.

---

**Version**: 1.0.0  
**Last Updated**: December 2024
