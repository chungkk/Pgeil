# App Store Deployment Guide

Complete guide for deploying the PapaGeil German Learning App to the Apple App Store.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Apple Developer Account Setup](#apple-developer-account-setup)
3. [App Store Connect Configuration](#app-store-connect-configuration)
4. [Code Signing & Certificates](#code-signing--certificates)
5. [Build Configuration](#build-configuration)
6. [Build & Archive](#build--archive)
7. [App Store Metadata](#app-store-metadata)
8. [TestFlight Beta Testing](#testflight-beta-testing)
9. [Submit for Review](#submit-for-review)
10. [Post-Launch](#post-launch)

---

## Prerequisites

### Required Accounts
- [ ] Apple Developer Account ($99/year)
- [ ] App Store Connect access
- [ ] Access to app repository

### Required Software
- [ ] macOS 12+ (Monterey or later)
- [ ] Xcode 15+
- [ ] Node.js 20+
- [ ] CocoaPods 1.14+

### Required Assets
- [ ] App icon (1024×1024 PNG)
- [ ] Screenshots (see [Screenshot Requirements](#screenshot-requirements))
- [ ] App description (English, German, Vietnamese)
- [ ] Privacy policy URL
- [ ] Support URL
- [ ] Marketing materials (optional)

---

## Apple Developer Account Setup

### 1. Enroll in Apple Developer Program

1. Visit https://developer.apple.com/programs/
2. Click "Enroll"
3. Sign in with Apple ID
4. Complete enrollment ($99/year)
5. Wait for approval (1-2 business days)

### 2. Create App ID

1. Go to https://developer.apple.com/account/
2. Certificates, Identifiers & Profiles
3. Click **Identifiers** → **+** button
4. Select **App IDs** → Continue
5. **Description**: PapaGeil German Learning
6. **Bundle ID**: `com.papageil.app` (or your chosen ID)
   - Must match Xcode bundle identifier
7. **Capabilities**: Enable required capabilities:
   - [ ] App Groups (for widgets, if needed)
   - [ ] Push Notifications (for reminders)
   - [ ] Sign in with Apple (if using)
8. Click **Continue** → **Register**

---

## App Store Connect Configuration

### 1. Create New App

1. Go to https://appstoreconnect.apple.com/
2. Click **My Apps** → **+** → **New App**
3. **Platforms**: iOS
4. **Name**: PapaGeil German Learning
   - Must be unique across App Store
   - Can be different from display name
5. **Primary Language**: English (US)
6. **Bundle ID**: Select the ID created earlier
7. **SKU**: `papageil-001` (internal identifier)
8. **User Access**: Full Access
9. Click **Create**

### 2. App Information

**General Information**:
- **Name**: PapaGeil German Learning (max 30 chars)
- **Subtitle**: Master German Through Shadowing (max 30 chars)
- **Category**: 
  - Primary: Education
  - Secondary: Reference (for dictionary feature)

**Contact Information**:
- **First Name**: [Your name]
- **Last Name**: [Your last name]
- **Phone Number**: [Support phone]
- **Email Address**: support@papageil.com

**Age Rating**:
- Complete questionnaire
- Expected: 4+ (no restricted content)

**Game Center**: No (not a game)

---

## Code Signing & Certificates

### 1. Create Certificates

#### Development Certificate
```bash
# In Xcode
Xcode → Settings → Accounts → Manage Certificates → + → iOS Development
```

#### Distribution Certificate
1. Keychain Access → Certificate Assistant → Request Certificate
2. Save to disk
3. Developer Portal → Certificates → + → iOS Distribution
4. Upload CSR file
5. Download certificate
6. Double-click to install in Keychain

### 2. Create Provisioning Profiles

#### App Store Profile
1. Developer Portal → Profiles → +
2. Distribution → App Store
3. Select App ID: com.papageil.app
4. Select Distribution Certificate
5. Name: PapaGeil App Store
6. Generate & Download
7. Double-click to install

### 3. Configure Xcode Signing

1. Open `ios/PapaGeil.xcworkspace` in Xcode
2. Select **PapaGeil** project
3. Select **PapaGeil** target
4. **Signing & Capabilities** tab
5. **Automatically manage signing**: ✓ (recommended)
   - Or manually select provisioning profile
6. **Team**: Select your team
7. **Bundle Identifier**: com.papageil.app

---

## Build Configuration

### 1. Update App Version

**In Xcode**:
1. Select PapaGeil target
2. General tab
3. **Version**: 1.0.0 (user-facing)
4. **Build**: 1 (increment for each upload)

### 2. Update Info.plist

Check required keys in `ios/PapaGeil/Info.plist`:

```xml
<key>CFBundleDisplayName</key>
<string>PapaGeil German</string>

<key>CFBundleShortVersionString</key>
<string>1.0.0</string>

<key>CFBundleVersion</key>
<string>1</string>

<!-- Privacy Descriptions -->
<key>NSMicrophoneUsageDescription</key>
<string>We need microphone access for pronunciation practice and shadowing exercises.</string>

<key>NSCameraUsageDescription</key>
<string>Take a profile photo (optional).</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>Select a profile photo (optional).</string>
```

### 3. Update Environment

**Production API URL**:
```bash
# .env
API_URL=https://api.papageil.com
# Remove any dev/staging URLs
```

### 4. Remove Debug Code

```bash
# Search for debug code
grep -r "console.log" src/
grep -r "__DEV__" src/

# Ensure babel removes console.log in production (already configured)
```

### 5. Optimize Assets

```bash
# Compress images
cd ios/PapaGeil/Images.xcassets
# Use ImageOptim or similar tool
```

---

## Build & Archive

### 1. Clean Build

```bash
# Clean derived data
cd ios
rm -rf ~/Library/Developer/Xcode/DerivedData

# Clean project
xcodebuild clean -workspace PapaGeil.xcworkspace -scheme PapaGeil
```

### 2. Install Dependencies

```bash
# Install npm packages
cd react-native
npm install

# Install pods
cd ios
pod install
cd ..
```

### 3. Build Release

In Xcode:
1. Select **Any iOS Device (arm64)** as destination
2. Product → Scheme → **PapaGeil**
3. Product → Build Configuration → **Release**
4. Product → Archive (⌘ + Shift + B)

Wait for archive to complete (5-10 minutes).

### 4. Validate Archive

1. Organizer window opens automatically
2. Select your archive
3. Click **Validate App**
4. Select distribution method: **App Store Connect**
5. Select provisioning profile
6. Click **Validate**
7. Wait for validation (2-5 minutes)
8. Fix any issues that appear

### 5. Upload to App Store Connect

1. In Organizer, click **Distribute App**
2. Select **App Store Connect**
3. Select **Upload**
4. Select provisioning profile
5. **Include bitcode**: Yes (if supported)
6. **Upload symbols**: Yes (for crash reports)
7. Click **Upload**
8. Wait for upload (5-15 minutes)
9. You'll receive email when processing is complete (10-30 minutes)

---

## App Store Metadata

### 1. Version Information

**What's New in This Version**:
```
🎉 Introducing PapaGeil German Learning!

• Master German through video shadowing
• Practice pronunciation with instant feedback
• Learn vocabulary with integrated dictionary
• Download lessons for offline learning
• Track progress with achievements and leaderboard

Perfect for German learners of all levels!
```

### 2. Description

**Description** (max 4000 chars):
```
Learn German naturally through shadowing! PapaGeil combines video-based learning with pronunciation feedback to help you speak German confidently.

🎯 KEY FEATURES

Video Shadowing
• Learn from real German content
• Practice speaking by repeating phrases
• Get instant pronunciation feedback (80%+ accuracy)
• Build natural speaking rhythm

Dictation Practice
• Improve listening and writing skills
• Type what you hear
• Receive immediate corrections
• Track your accuracy over time

Integrated Dictionary
• Tap any word for instant definition
• German, English, and Vietnamese translations
• Save words to personal vocabulary list
• Practice with flashcards

Offline Learning
• Download up to 10 lessons
• Learn anywhere, anytime
• Auto-sync progress when online
• Never miss a lesson

Progress Tracking
• See your improvement over time
• Earn achievements
• Compete on leaderboards
• Stay motivated with streaks

🌟 PERFECT FOR

• Beginners starting their German journey
• Intermediate learners improving pronunciation
• Advanced students maintaining fluency
• Anyone wanting to speak German naturally

📱 FEATURES

• 100+ German lessons across all levels
• Pronunciation scoring with 80%+ threshold
• Offline mode with lesson downloads
• Personal vocabulary builder
• Progress tracking and achievements
• Leaderboard competition
• Multi-language support (English, German, Vietnamese)

💪 WHY PAPAGEIL?

Traditional language apps focus on reading and grammar. PapaGeil focuses on what matters most: speaking confidently. Our shadowing method mimics how children learn languages naturally - by listening and repeating.

🎓 LEARNING METHOD

Shadowing is a proven technique where you listen to native speakers and repeat immediately. This helps you:
• Develop natural pronunciation
• Improve listening comprehension
• Build speaking confidence
• Learn grammar naturally

Start your German learning journey today!

---

SUBSCRIPTION: Free to download with in-app purchases available.
PRIVACY: We take your privacy seriously. Read our privacy policy at https://papageil.com/privacy
SUPPORT: Questions? Contact us at support@papageil.com
```

**Keywords** (max 100 chars, comma-separated):
```
german,language,learning,shadowing,pronunciation,vocabulary,dictionary,offline
```

**Support URL**: https://papageil.com/support
**Marketing URL**: https://papageil.com
**Privacy Policy URL**: https://papageil.com/privacy (REQUIRED)

### 3. Screenshot Requirements

**Required Sizes**:

| Device | Size (pixels) | Count |
|--------|--------------|-------|
| 6.7" Display (iPhone 14 Pro Max) | 1290 × 2796 | 3-10 |
| 6.5" Display (iPhone 11 Pro Max) | 1242 × 2688 | 3-10 |
| 5.5" Display (iPhone 8 Plus) | 1242 × 2208 | 3-10 |

**Screenshot Ideas**:
1. Lesson list with progress
2. Video shadowing in action
3. Pronunciation feedback screen
4. Dictionary lookup with translations
5. Progress tracking dashboard
6. Vocabulary flashcards
7. Achievement showcase
8. Leaderboard

**Tips**:
- Use Simulator → File → New Screen Shot
- Add captions/overlays for context
- Show key features
- Use consistent styling
- Highlight unique value propositions

### 4. App Preview Video (Optional but Recommended)

- Length: 15-30 seconds
- Show core features in action
- No external links or prices
- Must reflect actual app experience

---

## TestFlight Beta Testing

### 1. Internal Testing (Recommended First)

1. App Store Connect → TestFlight
2. Select your build
3. **Internal Testing** → + Group
4. Add up to 100 internal testers
5. Testers receive email invitation
6. Test for 1-2 weeks before external

**Internal Testing Checklist**:
- [ ] App launches successfully
- [ ] All features work
- [ ] No crashes
- [ ] Performance acceptable
- [ ] UI looks good on all devices
- [ ] Offline mode works
- [ ] Login/authentication works

### 2. External Testing (Optional)

1. **External Testing** → + Group
2. Add up to 10,000 external testers
3. Requires Beta App Review (1-2 days)
4. Collect feedback from real users

---

## Submit for Review

### 1. Pre-Submission Checklist

**Technical**:
- [ ] App builds without errors
- [ ] All features tested on real device
- [ ] Crash-free rate > 99%
- [ ] Battery usage < 5% per hour
- [ ] Tested on iPhone X, 11, 12, 13, 14
- [ ] No hardcoded credentials
- [ ] No debug logs
- [ ] API endpoints point to production

**Content**:
- [ ] All metadata filled in
- [ ] Screenshots uploaded (all required sizes)
- [ ] App icon uploaded (1024×1024)
- [ ] Privacy policy live and accessible
- [ ] Support URL live
- [ ] Age rating completed
- [ ] Export compliance answered

**Legal**:
- [ ] Privacy policy reviewed
- [ ] Terms of service (if applicable)
- [ ] No copyright violations
- [ ] No trademark violations
- [ ] Proper attributions for third-party content

### 2. Export Compliance

For most apps:
- **Contains Encryption**: Yes (HTTPS is encryption)
- **Exempt from Export Compliance**: Yes (standard HTTPS)

Add to Info.plist:
```xml
<key>ITSAppUsesNonExemptEncryption</key>
<false/>
```

### 3. Submit for Review

1. App Store Connect → App Store → iOS App
2. Click **+** next to **iOS App** (create new version)
3. **Version**: 1.0.0
4. Fill in all required fields
5. Select build
6. Click **Add for Review**
7. Click **Submit to App Review**

### 4. Review Process

**Timeline**:
- Initial review: 24-48 hours typically
- Faster during off-peak times
- Longer during peak (Sept-Dec, new iOS releases)

**Review Status**:
- **Waiting for Review**: In queue
- **In Review**: Actively being reviewed
- **Pending Developer Release**: Approved! (decide when to release)
- **Ready for Sale**: Live on App Store
- **Rejected**: See rejection reasons, fix, and resubmit

### 5. Common Rejection Reasons

1. **Missing privacy policy**
   - Must be publicly accessible URL
   - Must describe data collection

2. **Crashes during review**
   - Test thoroughly on real devices
   - Test all user flows

3. **Incomplete app information**
   - Fill all metadata fields
   - Provide test account if login required

4. **Misleading screenshots**
   - Screenshots must match app
   - No mockups or concepts

5. **Guideline violations**
   - Read https://developer.apple.com/app-store/review/guidelines/
   - Common: spam, incomplete app, copycat

### 6. If Rejected

1. Read rejection message carefully
2. Fix issues listed
3. Respond to reviewer if needed
4. Increment build number
5. Upload new build
6. Resubmit for review

---

## Post-Launch

### 1. Monitor Performance

**First 24 Hours**:
- [ ] Check for crash reports in App Store Connect
- [ ] Monitor user reviews
- [ ] Check analytics (downloads, sessions)
- [ ] Verify all features work in production
- [ ] Test on different iOS versions

**First Week**:
- [ ] Respond to user reviews (both positive and negative)
- [ ] Track crash-free rate (target >99%)
- [ ] Monitor server load
- [ ] Check for unexpected issues
- [ ] Gather user feedback

### 2. Updates

**When to Update**:
- Critical bugs: ASAP (1-2 days)
- Minor bugs: 1-2 weeks
- New features: 4-6 weeks
- Major versions: 3-6 months

**Update Process**:
1. Increment version (1.0.1, 1.1.0, 2.0.0)
2. Increment build number (2, 3, 4, ...)
3. Archive and upload new build
4. Update "What's New" section
5. Submit for review

### 3. App Store Optimization (ASO)

**Continuously Optimize**:
- Monitor keyword rankings
- A/B test screenshots
- Update description based on user feedback
- Encourage reviews from happy users
- Respond to all reviews professionally

### 4. Analytics

**Track Key Metrics**:
- Downloads per day
- Active users (DAU, MAU)
- Retention rate (Day 1, Day 7, Day 30)
- Conversion rate (if freemium)
- Crash-free rate
- Average session length
- Most used features

---

## Appendix

### A. Useful Commands

```bash
# Check app version
agvtool what-version

# Increment build number
agvtool next-version -all

# Create IPA manually
xcodebuild -workspace ios/PapaGeil.xcworkspace \
  -scheme PapaGeil \
  -configuration Release \
  -archivePath build/PapaGeil.xcarchive \
  archive

# Export IPA
xcodebuild -exportArchive \
  -archivePath build/PapaGeil.xcarchive \
  -exportPath build \
  -exportOptionsPlist exportOptions.plist
```

### B. Resources

- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [TestFlight Documentation](https://developer.apple.com/testflight/)
- [App Store Marketing Resources](https://developer.apple.com/app-store/marketing/guidelines/)

### C. Support Contacts

- **App Store Connect Support**: https://developer.apple.com/contact/
- **Developer Forums**: https://developer.apple.com/forums/
- **Technical Support**: https://developer.apple.com/support/

---

## Quick Checklist

Use this quick checklist before each submission:

**Pre-Build**:
- [ ] Version and build number updated
- [ ] Production API URL configured
- [ ] Debug code removed
- [ ] All tests passing

**Build**:
- [ ] Clean build successful
- [ ] Archive created without errors
- [ ] Validation passed
- [ ] Upload completed

**App Store Connect**:
- [ ] Build appears in TestFlight
- [ ] Metadata complete
- [ ] Screenshots uploaded
- [ ] Privacy policy URL working
- [ ] Age rating completed
- [ ] Export compliance answered

**Submit**:
- [ ] Build selected
- [ ] Release automatically or manually
- [ ] Submit to App Review clicked
- [ ] Confirmation email received

**Post-Submit**:
- [ ] Monitor review status daily
- [ ] Respond to review messages within 24h
- [ ] Prepare for launch (marketing, support)

---

**Good luck with your launch! 🚀**
