# Memory Leak Prevention Guide

## Common Memory Leak Causes in React Native

### 1. Event Listeners Not Removed
**Problem**: Adding event listeners without cleanup
```typescript
// ❌ BAD - Memory leak
useEffect(() => {
  NetInfo.addEventListener(handleConnectivityChange);
  // No cleanup!
}, []);

// ✅ GOOD - Properly cleaned up
useEffect(() => {
  const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);
  return () => unsubscribe(); // Cleanup on unmount
}, []);
```

**Solution**: Use our `useEventSubscription` hook
```typescript
import { useEventSubscription } from '@/hooks/useEventSubscription';

useEventSubscription(emitter, 'eventName', handleEvent);
```

### 2. Timers Not Cleared
**Problem**: setInterval/setTimeout not cleared
```typescript
// ❌ BAD - Memory leak
useEffect(() => {
  const timer = setInterval(() => {
    fetchData();
  }, 5000);
  // No cleanup!
}, []);

// ✅ GOOD - Cleared on unmount
useEffect(() => {
  const timer = setInterval(() => {
    fetchData();
  }, 5000);
  return () => clearInterval(timer);
}, []);
```

**Solution**: Use our `useInterval` and `useTimeout` hooks
```typescript
import { useInterval, useTimeout } from '@/hooks/useInterval';

useInterval(() => {
  fetchData();
}, 5000);
```

### 3. Async Operations After Unmount
**Problem**: setState called after component unmounts
```typescript
// ❌ BAD - Potential memory leak
useEffect(() => {
  fetchData().then(data => {
    setState(data); // Component might be unmounted!
  });
}, []);

// ✅ GOOD - Check if mounted
useEffect(() => {
  let isMounted = true;
  
  fetchData().then(data => {
    if (isMounted) {
      setState(data);
    }
  });
  
  return () => {
    isMounted = false;
  };
}, []);
```

### 4. Large Data Structures in State
**Problem**: Storing large objects/arrays in state
```typescript
// ❌ BAD - Keeps large video data in memory
const [videoData, setVideoData] = useState<ArrayBuffer>();

// ✅ GOOD - Store reference/URL instead
const [videoUrl, setVideoUrl] = useState<string>();
```

### 5. Circular References
**Problem**: Objects referencing each other
```typescript
// ❌ BAD - Circular reference
const parent = { child: null };
const child = { parent };
parent.child = child;

// ✅ GOOD - Use weak references or avoid circular refs
```

## Best Practices

### 1. Always Clean Up Side Effects
```typescript
useEffect(() => {
  // Setup
  const subscription = subscribeToData();
  const timer = setInterval(updateData, 1000);
  
  // Cleanup
  return () => {
    subscription.unsubscribe();
    clearInterval(timer);
  };
}, []);
```

### 2. Use AbortController for Fetch Requests
```typescript
useEffect(() => {
  const abortController = new AbortController();
  
  fetch(url, { signal: abortController.signal })
    .then(handleResponse)
    .catch(handleError);
  
  return () => abortController.abort();
}, [url]);
```

### 3. Debounce Heavy Operations
```typescript
import { useDebouncedCallback } from 'use-debounce';

const handleSearch = useDebouncedCallback((query: string) => {
  searchAPI(query);
}, 500);
```

### 4. Memoize Expensive Computations
```typescript
const expensiveResult = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);
```

### 5. Use React.memo for Pure Components
```typescript
const LessonCard = React.memo(({ lesson }: { lesson: Lesson }) => {
  return <View>{/* Component content */}</View>;
});
```

## Detection Tools

### 1. React DevTools Profiler
- Open React DevTools
- Go to Profiler tab
- Record component renders
- Look for unnecessary re-renders

### 2. Flipper Memory Profiler
- Install Flipper
- Enable Memory plugin
- Take heap snapshots
- Compare snapshots to find leaks

### 3. Xcode Instruments (iOS)
```bash
# Build in Profiling mode
npm run ios -- --configuration Release

# Then use Xcode → Product → Profile (Cmd+I)
# Select "Leaks" or "Allocations" instrument
```

### 4. Console Warnings
Enable memory warnings in development:
```typescript
if (__DEV__) {
  console.warn = (function(originalWarn) {
    return function(...args) {
      // Log warnings to track potential leaks
      originalWarn.apply(console, args);
    };
  })(console.warn);
}
```

## Testing for Memory Leaks

### Manual Testing
1. Navigate to a screen
2. Perform actions (e.g., play video, fetch data)
3. Navigate away
4. Repeat 10-20 times
5. Check memory usage in Xcode Instruments

### Automated Testing
```typescript
describe('Memory Leak Tests', () => {
  it('should clean up subscriptions on unmount', () => {
    const { unmount } = render(<LessonScreen />);
    
    // Verify subscriptions exist
    expect(subscriptionCount()).toBe(1);
    
    unmount();
    
    // Verify subscriptions cleaned up
    expect(subscriptionCount()).toBe(0);
  });
});
```

## Common Fixes Applied

### Audio/Video Players
```typescript
// react-native-video cleanup
<Video
  ref={videoRef}
  onEnd={() => {
    videoRef.current?.seek(0);
  }}
/>

useEffect(() => {
  return () => {
    // Stop video on unmount
    videoRef.current?.seek(0);
    videoRef.current = null;
  };
}, []);
```

### Track Player
```typescript
useEffect(() => {
  TrackPlayer.setupPlayer();
  
  return () => {
    TrackPlayer.reset(); // Clean up player
  };
}, []);
```

### Network Listeners
```typescript
useEffect(() => {
  const unsubscribe = NetInfo.addEventListener(handleNetworkChange);
  return () => unsubscribe();
}, []);
```

## Monitoring in Production

### Crash Reporting
- Use Firebase Crashlytics or Sentry
- Monitor memory-related crashes
- Track memory warnings

### Performance Monitoring
- Track app startup time
- Monitor screen transition times
- Measure memory usage over time

### User Experience Metrics
- App responsiveness
- Frame drops
- Out-of-memory crashes

## Resources

- [React Native Performance](https://reactnative.dev/docs/performance)
- [Memory Management Best Practices](https://reactnative.dev/docs/ram-bundles-inline-requires)
- [Flipper Memory Profiler](https://fbflipper.com/docs/features/plugins/memory/)
- [Xcode Instruments Guide](https://developer.apple.com/library/archive/documentation/DeveloperTools/Conceptual/InstrumentsUserGuide/)
