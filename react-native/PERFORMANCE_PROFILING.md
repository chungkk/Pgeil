# Performance Profiling Guide

## Tools Overview

### 1. React DevTools Profiler
Best for: Component render performance, React-specific issues

### 2. Flipper
Best for: Network requests, logs, layout inspection, memory

### 3. Xcode Instruments
Best for: CPU usage, memory leaks, battery usage, native performance

### 4. Metro Bundler Performance
Best for: Bundle size, build time

## React DevTools Profiler

### Setup

1. **Install React DevTools Standalone**
```bash
npm install -g react-devtools
```

2. **Connect to App**
```bash
# Terminal 1: Start Metro
npm start

# Terminal 2: Start React DevTools
react-devtools

# Terminal 3: Run app
npm run ios
```

3. **Open Profiler Tab** in React DevTools

### Recording a Profile

1. Click **Record** button (red circle)
2. Interact with the app (navigate, scroll, interact)
3. Click **Stop** button
4. Analyze the flame graph

### Reading the Flame Graph

#### Colors Meaning
- **Green**: Fast renders (< 16ms for 60 FPS)
- **Yellow**: Medium renders (16-50ms)
- **Red**: Slow renders (> 50ms)

#### What to Look For
- Components taking > 16ms to render
- Unnecessary re-renders
- Components rendering when parent updates (but props unchanged)

### Common Performance Issues

#### Issue 1: Unnecessary Re-renders
**Symptom**: Component renders even though props haven't changed

**Solution**: Use React.memo
```typescript
const LessonCard = React.memo(({ lesson }: { lesson: Lesson }) => {
  return <View>{/* ... */}</View>;
}, (prevProps, nextProps) => {
  // Return true if props are equal (skip re-render)
  return prevProps.lesson.id === nextProps.lesson.id;
});
```

#### Issue 2: Expensive Computations on Each Render
**Symptom**: Heavy calculations in render function

**Solution**: Use useMemo
```typescript
const sortedLessons = useMemo(() => {
  return lessons.sort((a, b) => b.score - a.score);
}, [lessons]);
```

#### Issue 3: Functions Created on Each Render
**Symptom**: Child components re-render due to new function references

**Solution**: Use useCallback
```typescript
const handlePress = useCallback(() => {
  navigation.navigate('Lesson', { id: lessonId });
}, [lessonId, navigation]);
```

## Flipper Performance Monitoring

### Setup Flipper

1. **Install Flipper**
```bash
brew install --cask flipper
```

2. **Start Flipper**
- Open Flipper app
- Build and run your app
- App should auto-connect

### Useful Plugins

#### 1. React DevTools
- Component hierarchy
- Props/state inspection
- Performance profiling

#### 2. Network
- All network requests
- Request/response times
- Payload sizes

#### 3. Layout
- View hierarchy
- Layout performance
- View measurements

#### 4. Logs
- All console.log statements
- Native logs (iOS/Android)

#### 5. Memory (Hermes)
- Heap snapshots
- Memory allocation
- Garbage collection

## Xcode Instruments

### Launch Profiling

```bash
# Build in Release mode
npm run ios -- --configuration Release
```

Then in Xcode:
1. Product → Profile (⌘I)
2. Choose instrument template:
   - **Time Profiler**: CPU usage
   - **Allocations**: Memory usage
   - **Leaks**: Memory leaks
   - **Energy Log**: Battery usage

### Time Profiler

**Best for**: Finding CPU-intensive code

1. Record while using the app
2. Stop recording
3. Analyze call tree:
   - Look for hot paths (methods taking most time)
   - Focus on your code (filter by app name)
   - Optimize functions taking > 10% CPU

**Common Issues**:
- Image processing on main thread
- Complex calculations in render
- Synchronous network requests

### Allocations Instrument

**Best for**: Memory usage and growth

1. Record while using the app
2. Navigate through screens multiple times
3. Check memory growth:
   - Should stabilize after a few navigations
   - Continuous growth = memory leak

**What to Monitor**:
- Heap allocations
- Anonymous VM (video/image buffers)
- Persistent objects after screen unmount

### Leaks Instrument

**Best for**: Finding memory leaks

1. Record while using the app
2. Navigate back and forth between screens
3. Look for leak indicators (red icons)
4. Click leaks to see stack trace

**Common Leaks**:
- Event listeners not removed
- Timers not cleared
- Circular references

## Performance Metrics

### Target Performance Goals

| Metric | Target | Measurement |
|--------|--------|-------------|
| **App Startup** | < 3s | Time to interactive |
| **Screen Transition** | < 300ms | Navigation time |
| **List Scroll** | 60 FPS | Frame drops < 1% |
| **API Response** | < 2s | Network + render |
| **Dictionary Lookup** | < 1s | Cached data |
| **Audio Playback** | < 100ms | Latency |
| **Memory Usage** | < 150MB | Idle state |
| **Battery Drain** | < 5%/hour | Active usage |

### Measuring Performance

#### App Startup Time
```typescript
// App.tsx
const startTime = Date.now();

useEffect(() => {
  const endTime = Date.now();
  console.log(`App startup time: ${endTime - startTime}ms`);
}, []);
```

#### Screen Transition Time
```typescript
// In navigation screen
const startTransition = Date.now();

useFocusEffect(
  useCallback(() => {
    const endTransition = Date.now();
    console.log(`Transition time: ${endTransition - startTransition}ms`);
  }, [])
);
```

#### Frame Rate Monitoring
```typescript
import { InteractionManager } from 'react-native';

InteractionManager.runAfterInteractions(() => {
  // Heavy operations after animations complete
  loadHeavyData();
});
```

## Optimization Checklist

### Component Level
- [x] Use React.memo for pure components
- [x] Use useMemo for expensive calculations
- [x] Use useCallback for function props
- [ ] Avoid inline styles (use StyleSheet.create)
- [x] Use FlatList for long lists (already implemented)
- [x] Implement list item key optimization

### Network Level
- [x] Cache API responses
- [x] Implement offline-first architecture
- [ ] Compress images before upload
- [ ] Paginate large data sets
- [x] Use AbortController for fetch cancellation

### Bundle Level
- [x] Code splitting (lazy loading)
- [x] Tree shaking enabled
- [x] Minification enabled
- [x] Remove console.log in production
- [x] Use Hermes engine

### Memory Level
- [x] Clean up event listeners
- [x] Clear timers on unmount
- [x] Release large objects (videos, images)
- [x] Implement proper cleanup in useEffect

### Native Level
- [ ] Optimize images (compress, WebP)
- [ ] Use native animations (Reanimated)
- [ ] Minimize bridge communication
- [ ] Cache expensive native calls

## Automated Performance Testing

### React Native Performance Monitor

```typescript
// src/utils/performanceMonitor.ts
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map();

  mark(name: string): void {
    this.marks.set(name, Date.now());
  }

  measure(startMark: string, endMark: string): number {
    const start = this.marks.get(startMark);
    const end = this.marks.get(endMark);
    
    if (!start || !end) {
      console.warn(`Missing marks: ${startMark}, ${endMark}`);
      return 0;
    }

    return end - start;
  }

  clearMarks(): void {
    this.marks.clear();
  }
}

export const performanceMonitor = new PerformanceMonitor();
```

Usage:
```typescript
import { performanceMonitor } from '@/utils/performanceMonitor';

// Start measurement
performanceMonitor.mark('lesson-load-start');

await loadLesson();

// End measurement
performanceMonitor.mark('lesson-load-end');
const duration = performanceMonitor.measure('lesson-load-start', 'lesson-load-end');

console.log(`Lesson loaded in ${duration}ms`);
```

## Performance Testing Scenarios

### Test 1: Cold Start
1. Close app completely
2. Clear app from memory
3. Launch app
4. Measure time to interactive
5. **Target**: < 3 seconds

### Test 2: Screen Navigation
1. Navigate to Lessons screen
2. Measure transition time
3. **Target**: < 300ms

### Test 3: List Scrolling
1. Open lesson list (100+ items)
2. Scroll rapidly
3. Monitor FPS
4. **Target**: 60 FPS, < 1% drops

### Test 4: Video Playback
1. Open lesson
2. Start video
3. Measure latency
4. **Target**: < 100ms to start

### Test 5: Memory Stability
1. Navigate through all screens
2. Repeat 10 times
3. Check memory usage
4. **Target**: Stable, no growth

### Test 6: Battery Usage
1. Use app actively for 1 hour
2. Measure battery drain
3. **Target**: < 5% per hour

## Continuous Performance Monitoring

### CI/CD Integration

```yaml
# .github/workflows/performance.yml
name: Performance Tests

on: [pull_request]

jobs:
  performance:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: |
          cd react-native
          npm install
      
      - name: Run Performance Tests
        run: |
          npm run test:performance
      
      - name: Check Bundle Size
        run: |
          npm run bundle:check
          BUNDLE_SIZE=$(wc -c < /tmp/bundle.js)
          echo "Bundle size: $BUNDLE_SIZE bytes"
```

## Resources

- [React DevTools](https://react-devtools-tutorial.vercel.app/)
- [Flipper](https://fbflipper.com/)
- [Xcode Instruments](https://developer.apple.com/library/archive/documentation/DeveloperTools/Conceptual/InstrumentsUserGuide/)
- [React Native Performance](https://reactnative.dev/docs/performance)
- [Performance Optimization](https://reactnative.dev/docs/optimizing-flatlist-configuration)
