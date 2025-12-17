# App Configuration Guide

## App Identity Configuration

### Display Name
**Current**: "PapaGeil German"  
**Location**: `app.json`

The display name appears:
- Under the app icon on the home screen
- In Settings
- In the App Switcher

**To Change**:
1. Edit `app.json` and update `displayName`
2. Edit `ios/PapaGeil/Info.plist` and update `CFBundleDisplayName`
3. Rebuild the app

### Bundle Identifier
**Current**: `org.cocoapods.PapaGeil` (default from React Native template)  
**Recommended**: `com.papageil.app` or `io.papageil.learngerman`

⚠️ **IMPORTANT**: The bundle identifier must be unique across the App Store.

**To Change**:
1. Open `ios/PapaGeil.xcworkspace` in Xcode (NOT .xcodeproj)
2. Select the PapaGeil project in the left sidebar
3. Select the PapaGeil target
4. Go to "Signing & Capabilities" tab
5. Update "Bundle Identifier" field
6. Ensure you have a valid provisioning profile for the new identifier

**Bundle Identifier Best Practices**:
- Use reverse domain notation: `com.yourcompany.appname`
- Keep it lowercase
- No special characters except dots and hyphens
- Cannot start with a number
- Should be consistent across iOS and Android (if adding Android support)

### App Version
**Current**: Defined in Xcode project settings  
**Location**: `ios/PapaGeil.xcodeproj/project.pbxproj`

Two version numbers to maintain:
1. **Version** (Marketing Version): User-facing version (e.g., "1.0.0")
2. **Build** (Current Project Version): Incremental build number (e.g., "1")

**To Update**:
1. Open Xcode
2. Select PapaGeil target
3. Go to "General" tab
4. Update "Version" and "Build" fields

**Version Numbering**:
- Follow Semantic Versioning: MAJOR.MINOR.PATCH
- Major: Breaking changes
- Minor: New features (backward compatible)
- Patch: Bug fixes

### Localization
**Current**: English (en) as development region  
**Supported**: German, Vietnamese, English (from spec)

**To Add Languages**:
1. Open Xcode
2. Select PapaGeil project
3. Go to "Info" tab
4. Add languages under "Localizations"
5. Update `CFBundleDevelopmentRegion` in Info.plist if needed

## Environment Configuration

### API Endpoints
**Location**: `.env` file

```env
API_URL=http://localhost:3000/api
# For production:
# API_URL=https://api.papageil.com
```

### Privacy Permissions
**Location**: `ios/PapaGeil/Info.plist`

Already configured:
- ✅ Microphone: Required for pronunciation practice
- ✅ Camera: Optional for profile photos
- ✅ Photo Library: Optional for profile photos

## Pre-Release Checklist

Before submitting to App Store:

### Identity & Metadata
- [ ] Set production bundle identifier
- [ ] Verify app display name
- [ ] Set version to 1.0.0 and build to 1
- [ ] Add app icon (all required sizes)
- [ ] Test splash screen on multiple devices

### Configuration
- [ ] Update API_URL to production endpoint
- [ ] Remove development/debug flags
- [ ] Verify all privacy permission descriptions
- [ ] Test all localized strings (German, Vietnamese, English)

### Code Signing
- [ ] Create App Store Connect app record
- [ ] Generate production certificates
- [ ] Create provisioning profiles
- [ ] Configure Xcode signing with production team

### Testing
- [ ] Test on real devices (not just simulators)
- [ ] Verify no hardcoded development URLs
- [ ] Check for console warnings/errors
- [ ] Test offline functionality
- [ ] Verify all features work with production API

## Quick Commands

### Update Display Name
```bash
# Edit app.json
sed -i '' 's/"displayName": ".*"/"displayName": "Your New Name"/' app.json

# Rebuild
npm run ios
```

### Check Current Configuration
```bash
# View current display name
cat app.json | grep displayName

# View bundle identifier (requires Xcode)
xcodebuild -showBuildSettings -workspace ios/PapaGeil.xcworkspace -scheme PapaGeil | grep PRODUCT_BUNDLE_IDENTIFIER
```

## Resources

- [Apple Developer Portal](https://developer.apple.com/)
- [App Store Connect](https://appstoreconnect.apple.com/)
- [Bundle ID Documentation](https://developer.apple.com/documentation/appstoreconnectapi/bundle_ids)
- [App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)
