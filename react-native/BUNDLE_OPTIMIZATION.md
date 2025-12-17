# Bundle Size Optimization Guide

## Current Optimizations Applied

### 1. Metro Configuration
**File**: `metro.config.js`

Optimizations:
- ✅ Terser minification enabled
- ✅ Console.log removal in production
- ✅ Optimized module bundling

### 2. Babel Configuration
**File**: `babel.config.js`

Optimizations:
- ✅ Production console removal
- ✅ Reanimated plugin for better animation performance
- ✅ Environment-specific optimizations

### 3. Code Splitting
**File**: `src/utils/lazyLoad.tsx`

Strategy:
- ✅ Lazy load screens
- ✅ Suspense boundaries
- ✅ Dynamic imports for navigation stacks

## Bundle Analysis

### Check Current Bundle Size

#### iOS
```bash
# Build release bundle
cd ios
xcodebuild -workspace PapaGeil.xcworkspace \
  -scheme PapaGeil \
  -configuration Release \
  -archivePath build/PapaGeil.xcarchive \
  archive

# Check app size
ls -lh build/PapaGeil.xcarchive/Products/Applications/PapaGeil.app
```

#### Bundle Stats
```bash
# Generate bundle visualization
npx react-native-bundle-visualizer

# Or manually
react-native bundle \
  --platform ios \
  --dev false \
  --entry-file index.js \
  --bundle-output ios-bundle.js \
  --assets-dest ios-assets

# Check size
ls -lh ios-bundle.js
```

## Optimization Strategies

### 1. Import Optimization

#### ❌ Bad - Imports entire library
```typescript
import _ from 'lodash';
import { Button, Text, View, ScrollView, FlatList } from 'react-native';
```

#### ✅ Good - Specific imports
```typescript
import debounce from 'lodash/debounce';
import { Button } from 'react-native';
```

### 2. Image Optimization

#### Compress Images
```bash
# Install imagemagick
brew install imagemagick

# Optimize images
for img in src/assets/images/*.png; do
  convert "$img" -strip -quality 85 "$img"
done
```

#### Use WebP Format
- Smaller file sizes (25-35% smaller than PNG)
- Supported in React Native
- Convert PNG/JPG to WebP:
```bash
cwebp input.png -o output.webp -q 80
```

### 3. Remove Unused Dependencies

#### Audit Dependencies
```bash
# Check bundle size impact
npx react-native-bundle-visualizer

# Find unused dependencies
npm install -g depcheck
depcheck

# Remove unused packages
npm uninstall <package-name>
```

#### Common Heavy Dependencies
- `moment.js` → Replace with `date-fns` (smaller)
- `lodash` → Import only needed functions
- Large icon libraries → Use only required icons

### 4. Use Hermes Engine

Hermes is already enabled by default in React Native 0.70+

**Benefits**:
- Smaller app size
- Faster startup time
- Lower memory usage

**Verify Hermes is enabled**:
```bash
# Check ios/Podfile
grep -A 5 "hermes_enabled" ios/Podfile

# Should show: hermes_enabled = true
```

### 5. Enable RAM Bundles (iOS)

**File**: `ios/PapaGeil/AppDelegate.swift`

```swift
// Use RAM bundle for faster startup
RCTBundleURLProvider.sharedSettings().enableDev = false
```

**Build RAM bundle**:
```bash
react-native bundle \
  --platform ios \
  --dev false \
  --entry-file index.js \
  --bundle-output ios/main.jsbundle \
  --assets-dest ios \
  --indexed-ram-bundle
```

### 6. Tree Shaking

Ensure proper exports/imports:

```typescript
// ❌ BAD - No tree shaking
export default {
  function1,
  function2,
  function3,
};

// ✅ GOOD - Tree shakeable
export { function1 };
export { function2 };
export { function3 };
```

### 7. Code Splitting by Route

Already implemented in `src/navigation/AppNavigator.tsx`:

```typescript
const AuthStack = lazyLoad(() => import('./AuthStack'));
const MainTabs = lazyLoad(() => import('./MainTabs'));
const LessonStack = lazyLoad(() => import('./LessonStack'));
```

## Size Targets

### App Size Goals
- **Initial Install**: < 50 MB
- **After First Launch**: < 100 MB
- **With Cached Lessons**: < 500 MB (user controlled)

### JavaScript Bundle
- **Development**: ~5-10 MB (unminified)
- **Production**: < 2 MB (minified + gzipped)
- **With Code Splitting**: < 500 KB initial load

### Assets
- **Icons/Images**: < 5 MB total
- **Fonts**: < 500 KB per font family
- **Splash Screen**: < 200 KB

## Monitoring

### CI/CD Integration
```bash
# Add to CI pipeline
- name: Check Bundle Size
  run: |
    npm run bundle:check
    
    # Fail if bundle > 2MB
    BUNDLE_SIZE=$(wc -c < ios-bundle.js)
    if [ $BUNDLE_SIZE -gt 2097152 ]; then
      echo "Bundle size ($BUNDLE_SIZE) exceeds 2MB limit"
      exit 1
    fi
```

### Bundle Size Tracking
```json
// package.json
{
  "scripts": {
    "bundle:analyze": "react-native-bundle-visualizer",
    "bundle:check": "react-native bundle --platform ios --dev false --entry-file index.js --bundle-output /tmp/bundle.js && ls -lh /tmp/bundle.js"
  }
}
```

## Best Practices Checklist

- [x] Metro minification configured
- [x] Babel production optimizations
- [x] Code splitting implemented
- [ ] Images compressed (requires actual images)
- [ ] Unused dependencies removed
- [x] Hermes engine enabled (default in RN 0.83)
- [x] Console.log removal in production
- [ ] Bundle size monitoring in CI
- [ ] WebP images for better compression
- [x] Lazy loading for heavy screens

## Advanced Optimizations (Future)

### 1. On-Demand Downloads
- Download lessons as needed
- Stream video instead of downloading
- Lazy load dictionary data

### 2. Asset Catalogs
- Use iOS Asset Catalogs for images
- App Thinning (iOS automatically optimizes)
- On-Demand Resources

### 3. Code Push
- Use CodePush for JS updates
- Avoid full app store updates
- Smaller delta updates

### 4. Compression
- Enable gzip compression for API responses
- Compress cached lesson data
- Use binary formats where appropriate

## Resources

- [React Native Performance](https://reactnative.dev/docs/performance)
- [Metro Bundler](https://metrobundler.dev/)
- [Hermes Engine](https://hermesengine.dev/)
- [Bundle Visualizer](https://github.com/IjzerenHein/react-native-bundle-visualizer)
- [iOS App Thinning](https://developer.apple.com/documentation/xcode/reducing-your-app-s-size)
