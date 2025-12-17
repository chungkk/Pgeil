# Device Testing Guide

## T208: Test on Multiple iPhone Models

### Supported Devices (Per Spec SC-011)
Target: iPhone X onwards, iOS 13+

### Test Matrix

| Model | Screen Size | iOS Version | RAM | Notch | Priority |
|-------|-------------|-------------|-----|-------|----------|
| **iPhone X** | 5.8" (2436×1125) | iOS 13-16 | 3GB | Yes | HIGH |
| **iPhone 11** | 6.1" (1792×828) | iOS 13-17 | 4GB | Yes | HIGH |
| **iPhone 12** | 6.1" (2532×1170) | iOS 14-17 | 4GB | Yes | HIGH |
| **iPhone 13** | 6.1" (2532×1170) | iOS 15-17 | 4GB | Yes | HIGH |
| **iPhone 14** | 6.1" (2532×1170) | iOS 16-17 | 6GB | Yes | HIGH |
| **iPhone 14 Pro** | 6.1" (2556×1179) | iOS 16-17 | 6GB | Dynamic Island | MEDIUM |
| **iPhone 15** | 6.1" (2556×1179) | iOS 17+ | 6GB | Dynamic Island | MEDIUM |

### Testing Checklist Per Device

#### Layout & UI
- [ ] All screens render correctly
- [ ] No text cutoff or overflow
- [ ] Images scale properly
- [ ] Safe area insets respected (notch/Dynamic Island)
- [ ] Buttons are tappable (min 44×44 points)
- [ ] Status bar color appropriate
- [ ] Modal dialogs centered

#### Navigation
- [ ] Tab bar accessible
- [ ] Screen transitions smooth
- [ ] Back navigation works
- [ ] Deep links open correctly
- [ ] Gestures work (swipe back, etc.)

#### Core Features
- [ ] Video playback works
- [ ] Audio playback works
- [ ] Microphone recording works
- [ ] Dictionary lookup works
- [ ] Offline mode works
- [ ] Sync works when online

#### Performance
- [ ] App launches < 3s
- [ ] Smooth scrolling (60 FPS)
- [ ] No frame drops in animations
- [ ] Video playback smooth
- [ ] Audio latency < 100ms

### Testing with Simulators

#### Setup Simulators
```bash
# List available simulators
xcrun simctl list devices

# Boot specific simulator
xcrun simctl boot "iPhone 14"

# Run app on specific simulator
npm run ios -- --simulator="iPhone X"
npm run ios -- --simulator="iPhone 11"
npm run ios -- --simulator="iPhone 12"
npm run ios -- --simulator="iPhone 13"
npm run ios -- --simulator="iPhone 14"
```

#### Xcode Simulator Features
1. Window → Show Device Bezels (test with notch)
2. I/O → Network Link Conditioner (test offline/slow network)
3. Debug → Color Blended Layers (check rendering performance)
4. Debug → Slow Animations (test transitions)

### Testing with Real Devices

#### Why Real Devices Matter
- **Accurate performance**: Simulators are faster than real devices
- **Real gestures**: Touch vs mouse behavior differs
- **Actual sensors**: Camera, microphone, accelerometer
- **Memory constraints**: Real device RAM limits
- **Battery usage**: Can't measure on simulator

#### Setup Real Device Testing
1. Connect iPhone via USB
2. Open Xcode → Window → Devices and Simulators
3. Select your device
4. Trust the computer on iPhone
5. Run: `npm run ios --device`

#### TestFlight Beta Testing
For testing on multiple physical devices:

1. **Archive Build**
```bash
# In Xcode
Product → Archive
```

2. **Upload to App Store Connect**
- Distribute App → App Store Connect
- Upload

3. **Create TestFlight Group**
- App Store Connect → TestFlight
- Create internal/external testing group
- Add testers (up to 100 for internal, 10,000 for external)

4. **Collect Feedback**
- TestFlight provides crash logs
- Screenshot feedback
- Usage analytics

### Test Scenarios by Device

#### iPhone X (Base Case)
**Focus**: Minimum supported device
- Heavy load testing (max 10 downloaded lessons)
- Extended usage (battery drain test)
- Memory pressure testing
- Oldest iOS version supported (iOS 13)

#### iPhone 11
**Focus**: Most common device in target market
- All features end-to-end
- Offline functionality
- Performance benchmarks
- User experience validation

#### iPhone 12/13
**Focus**: Mid-range performance
- Video quality at different resolutions
- Multitasking behavior
- Background playback
- Notification handling

#### iPhone 14
**Focus**: Current generation
- Latest iOS features
- Dynamic Island compatibility (14 Pro)
- Best performance baseline
- Future-proofing

### Automated Device Testing

#### Using Appium
```typescript
// appium.config.ts
export const config = {
  specs: ['./e2e/**/*.spec.ts'],
  capabilities: [
    {
      platformName: 'iOS',
      'appium:deviceName': 'iPhone X',
      'appium:platformVersion': '13.0',
      'appium:automationName': 'XCUITest',
      'appium:app': './ios/build/PapaGeil.app',
    },
    // Add more device configurations
  ],
};
```

#### Using Detox
```json
// .detoxrc.json
{
  "devices": {
    "simulator-x": {
      "type": "ios.simulator",
      "device": { "type": "iPhone X" }
    },
    "simulator-11": {
      "type": "ios.simulator",
      "device": { "type": "iPhone 11" }
    },
    "simulator-14": {
      "type": "ios.simulator",
      "device": { "type": "iPhone 14" }
    }
  }
}
```

### Device-Specific Issues to Watch For

#### iPhone X (2436×1125)
- Notch overlapping content
- Home indicator spacing
- Smaller screen vs newer models
- Lower RAM (3GB)

#### iPhone 11 (1792×828)
- Lower resolution (LCD vs OLED)
- Color accuracy differences
- Wider bezels

#### iPhone 12+ (2532×1170)
- 5G connectivity issues
- MagSafe interference (minimal for app)
- Better CPU performance expectations

#### iPhone 14 Pro (Dynamic Island)
- Dynamic Island UI considerations
- Always-on display
- ProMotion (120Hz) smoothness

### Reporting Issues

When reporting device-specific issues, include:

```markdown
## Issue Report

**Device**: iPhone X
**iOS Version**: 13.7
**App Version**: 1.0.0 (Build 1)
**Issue**: Video playback stuttering after 5 minutes

**Steps to Reproduce**:
1. Open lesson "Beginner German 101"
2. Play video for 5 minutes
3. Observe stuttering

**Expected**: Smooth playback throughout
**Actual**: Video stutters every few seconds after 5 minutes
**Screenshots**: [Attach if applicable]
**Console Logs**: [Attach crash logs if available]
```

### Cloud Device Testing

For broader device coverage without physical access:

#### BrowserStack
- https://www.browserstack.com/app-live
- 2000+ real devices
- Manual and automated testing

#### AWS Device Farm
- https://aws.amazon.com/device-farm/
- Real devices in cloud
- Automated test execution

#### Firebase Test Lab
- https://firebase.google.com/products/test-lab
- Limited iOS device selection
- Integrated with CI/CD

### Sign-off Checklist

Before marking T208 as complete, ensure:

- [ ] Tested on iPhone X, 11, 12, 13, 14 (simulator or real)
- [ ] All screens render correctly on all devices
- [ ] No layout issues with notch/Dynamic Island
- [ ] Performance acceptable on oldest device (iPhone X)
- [ ] Feature parity across all devices
- [ ] Documented any device-specific quirks
- [ ] TestFlight beta tested (if available) with 5+ testers

---

## T209: Verify Battery Usage <5% per Hour

### Battery Usage Goals
**Target**: < 5% battery drain per hour of active use

### What Affects Battery

#### High Impact
- **Video playback**: Decoding, screen brightness
- **Audio processing**: Continuous playback, recording
- **Network requests**: Frequent API calls, sync
- **Location services**: GPS (not used in app)
- **Background processing**: Downloads, sync

#### Medium Impact
- **Screen brightness**: User-controlled but impacts perception
- **Animations**: Complex animations drain battery
- **Rendering**: Heavy UI updates

#### Low Impact
- **Storage access**: Reading/writing data
- **Computation**: Modern chips are efficient

### Measuring Battery Usage

#### Xcode Instruments - Energy Log

1. **Profile the App**
```bash
# Build in Release mode
npm run ios -- --configuration Release
```

2. **Open Instruments**
- Xcode → Product → Profile (⌘I)
- Select "Energy Log" template

3. **Record Session**
- Start recording
- Use app actively for 1 hour:
  - Watch 3 videos
  - Practice 5 dictation exercises
  - Look up 10 words
  - Navigate through screens
- Stop recording

4. **Analyze Results**
- Check "Energy Usage" column
- Look for high energy periods
- Identify problematic code paths

**Energy Levels**:
- Green: Good
- Yellow: Moderate
- Red: High (investigate)

#### iOS Battery Settings

Manual verification:
1. Charge device to 100%
2. Note current time
3. Use app for 1 hour (realistic usage)
4. Check Settings → Battery
5. Find app in battery usage list
6. Verify < 5% usage

**Realistic Usage Scenario** (1 hour):
- Open app (cold start)
- Browse 10 lessons
- Watch 2 videos (10 mins each)
- Complete 2 shadowing exercises (5 mins each)
- Practice 3 dictation exercises (5 mins each)
- Look up 5 words in dictionary
- Check progress/leaderboard
- Navigate through profile

### Optimization Strategies

#### Video Playback
```typescript
// Use native player optimizations
<Video
  resizeMode="contain"
  paused={!isPlaying}
  playInBackground={false}
  playWhenInactive={false}
  // Disable picture-in-picture if not needed
  pictureInPicture={false}
/>
```

#### Network Requests
```typescript
// Batch requests
const fetchData = debounce(async () => {
  const [lessons, progress, vocab] = await Promise.all([
    fetchLessons(),
    fetchProgress(),
    fetchVocabulary(),
  ]);
}, 500);

// Use cache-first strategy
const data = await getCached() || await fetchFromAPI();
```

#### Background Tasks
```typescript
// Only sync when necessary
import BackgroundFetch from 'react-native-background-fetch';

BackgroundFetch.configure({
  minimumFetchInterval: 60, // 1 hour minimum
  stopOnTerminate: false,
  startOnBoot: true,
}, async (taskId) => {
  console.log('[BackgroundFetch] Event received');
  await syncData();
  BackgroundFetch.finish(taskId);
});
```

#### Animations
```typescript
// Use native driver for animations
Animated.timing(value, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true, // Offload to GPU
}).start();

// Or use Reanimated (already installed)
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
```

#### Screen Brightness
```typescript
// Don't programmatically increase brightness
// Let user control brightness

// But can adjust for video playback if needed
import { Brightness } from 'react-native';
// Only for critical use cases
```

### Battery Testing Checklist

- [ ] 1-hour active usage test on real device
- [ ] Battery drain < 5% per hour
- [ ] Xcode Energy Log shows green/yellow (no red)
- [ ] No excessive CPU usage in background
- [ ] Network requests are batched/optimized
- [ ] Video playback doesn't overheat device
- [ ] Audio playback battery-efficient
- [ ] Background sync minimal (< 1% per hour when idle)

### Common Battery Drains to Fix

#### ❌ Bad: Constant Polling
```typescript
setInterval(() => {
  checkForUpdates();
}, 5000); // Every 5 seconds!
```

#### ✅ Good: Event-Driven or Long Intervals
```typescript
// Use push notifications or
setInterval(() => {
  checkForUpdates();
}, 30 * 60 * 1000); // Every 30 minutes
```

---

#### ❌ Bad: Prevent Device Sleep
```typescript
KeepAwake.activate(); // Always on!
```

#### ✅ Good: Only During Video
```typescript
// Only keep awake during video playback
useEffect(() => {
  if (isPlaying) {
    KeepAwake.activate();
  } else {
    KeepAwake.deactivate();
  }
}, [isPlaying]);
```

---

## T210: Verify Crash-Free Rate >99% in Testing

### Crash-Free Rate Goal
**Target**: >99% crash-free rate (< 1% of sessions crash)

### Crash Reporting Setup

#### Firebase Crashlytics (Recommended)

1. **Install**
```bash
cd react-native
npm install @react-native-firebase/app @react-native-firebase/crashlytics
cd ios && pod install && cd ..
```

2. **Configure**
```typescript
// App.tsx
import crashlytics from '@react-native-firebase/crashlytics';

// Enable in production
if (!__DEV__) {
  crashlytics().setCrashlyticsCollectionEnabled(true);
}

// Log errors
crashlytics().recordError(error);

// Set user identifier
crashlytics().setUserId(userId);
```

3. **Test Crash**
```typescript
// Only in development
if (__DEV__) {
  crashlytics().crash(); // Force crash for testing
}
```

#### Sentry (Alternative)

```bash
npm install @sentry/react-native
```

```typescript
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: __DEV__ ? 'development' : 'production',
});
```

### Testing for Crashes

#### Automated Crash Testing

```typescript
// __tests__/crashTests.spec.ts
describe('Crash Prevention Tests', () => {
  it('should handle null video source', () => {
    const { getByTestId } = render(<VideoPlayer source={null} />);
    expect(getByTestId('video-error')).toBeTruthy();
  });

  it('should handle network errors gracefully', async () => {
    const mockFetch = jest.fn().mockRejectedValue(new Error('Network error'));
    global.fetch = mockFetch;

    const { getByText } = render(<LessonList />);
    await waitFor(() => {
      expect(getByText(/error/i)).toBeTruthy();
    });
  });

  it('should handle invalid lesson data', () => {
    expect(() => {
      render(<LessonDetail lesson={null} />);
    }).not.toThrow();
  });
});
```

#### Manual Crash Testing Scenarios

1. **Network Failures**
   - Turn off Wi-Fi mid-request
   - Switch to airplane mode
   - Timeout requests

2. **Memory Pressure**
   - Open app
   - Download 10 lessons
   - Navigate rapidly between screens
   - Play multiple videos in sequence

3. **Invalid Data**
   - Corrupt cache data
   - Invalid API responses
   - Missing required fields

4. **Background/Foreground**
   - Send app to background during video
   - Return after 1 hour
   - Force quit and reopen

5. **Edge Cases**
   - Empty states (no lessons, no vocab)
   - Very long text inputs
   - Special characters in inputs
   - Date/time edge cases

### Crash Prevention Best Practices

#### 1. Error Boundaries

```typescript
// ErrorBoundary.tsx (already exists)
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

#### 2. Try-Catch Blocks

```typescript
const loadLesson = async (id: string) => {
  try {
    const lesson = await api.getLesson(id);
    setLesson(lesson);
  } catch (error) {
    console.error('Failed to load lesson:', error);
    setError('Unable to load lesson. Please try again.');
    // Don't crash, show error UI
  }
};
```

#### 3. Null Checks

```typescript
// Always validate data
const renderLesson = () => {
  if (!lesson) {
    return <EmptyState />;
  }

  if (!lesson.title || !lesson.videoUrl) {
    return <ErrorState message="Invalid lesson data" />;
  }

  return <LessonView lesson={lesson} />;
};
```

#### 4. Defensive Coding

```typescript
// Use optional chaining and nullish coalescing
const userName = user?.profile?.name ?? 'Guest';
const lessonCount = user?.progress?.completedLessons?.length ?? 0;
```

### Crash Metrics

Monitor these metrics in Crashlytics/Sentry:

| Metric | Target | Action if Exceeded |
|--------|--------|-------------------|
| Crash-free users | > 99% | Hotfix required |
| Crash-free sessions | > 99.5% | Investigate |
| Crashes per day | < 10 | Monitor |
| Fatal crashes | 0 | Immediate fix |

### Common Crash Causes

1. **Unhandled Promise Rejections**
```typescript
// ❌ Bad
fetchData(); // Unhandled rejection

// ✅ Good
fetchData().catch(handleError);
```

2. **Null Reference Errors**
```typescript
// ❌ Bad
const title = lesson.title.toUpperCase(); // Crash if lesson is null

// ✅ Good
const title = lesson?.title?.toUpperCase() ?? '';
```

3. **Array Access Errors**
```typescript
// ❌ Bad
const firstLesson = lessons[0]; // Crash if empty

// ✅ Good
const firstLesson = lessons.length > 0 ? lessons[0] : null;
```

4. **Memory Leaks Leading to Crashes**
```typescript
// ✅ Good: Clean up subscriptions
useEffect(() => {
  const subscription = subscribe();
  return () => subscription.unsubscribe();
}, []);
```

### Crash Testing Checklist

- [ ] Error boundaries in place
- [ ] Crash reporting configured (Crashlytics/Sentry)
- [ ] All async operations wrapped in try-catch
- [ ] Null checks for all data access
- [ ] Network error handling
- [ ] Memory leak prevention (see T204)
- [ ] Edge cases tested
- [ ] 100+ test sessions with 0 crashes
- [ ] Crash-free rate > 99% in TestFlight
- [ ] All critical paths tested under stress

### Monitoring in Production

```typescript
// Track custom events leading to crashes
crashlytics().log('User navigated to LessonDetail');
crashlytics().log('Video playback started');
crashlytics().log('API request failed');

// Set custom keys for debugging
crashlytics().setAttribute('lesson_id', lessonId);
crashlytics().setAttribute('user_level', userLevel);
```

## Resources

- [Xcode Instruments Guide](https://developer.apple.com/library/archive/documentation/DeveloperTools/Conceptual/InstrumentsUserGuide/)
- [Firebase Crashlytics](https://firebase.google.com/docs/crashlytics)
- [TestFlight Beta Testing](https://developer.apple.com/testflight/)
- [iOS Battery Optimization](https://developer.apple.com/documentation/xcode/improving-your-app-s-performance)
