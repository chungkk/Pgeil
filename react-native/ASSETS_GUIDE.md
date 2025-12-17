# Assets Guide: App Icon and Splash Screen

## App Icon Setup

### Required Sizes (iOS)
The AppIcon requires the following sizes in `ios/PapaGeil/Images.xcassets/AppIcon.appiconset/`:

| Size | Filename | Usage |
|------|----------|-------|
| 40x40 | icon-40.png | iPhone Notification (2x) |
| 60x60 | icon-60.png | iPhone Notification (3x) |
| 58x58 | icon-58.png | iPhone Settings (2x) |
| 87x87 | icon-87.png | iPhone Settings (3x) |
| 80x80 | icon-80.png | iPhone Spotlight (2x) |
| 120x120 | icon-120.png | iPhone Spotlight (3x) / App Icon (2x) |
| 180x180 | icon-180.png | iPhone App Icon (3x) |
| 1024x1024 | icon-1024.png | App Store |

### Icon Design Guidelines
- **Style**: Simple, recognizable, works at small sizes
- **Colors**: Use brand colors (e.g., German flag colors: black, red, gold)
- **Content**: Consider using "PG" monogram or German flag
- **Format**: PNG with transparency (except 1024x1024 which should have solid background)
- **No text**: Icons work best with symbols, not text

### Generating Icons
Use online tools like:
- https://appicon.co/
- https://makeappicon.com/
- https://www.appicon.build/

Upload a 1024x1024 master icon and download all sizes.

## Splash Screen Setup

### Launch Screen Images
Already configured in `ios/PapaGeil/Images.xcassets/LaunchScreen.imageset/`

Required images:
- `launch-screen.png` (1x) - 375x812 for iPhone X
- `launch-screen@2x.png` (2x) - 750x1624
- `launch-screen@3x.png` (3x) - 1125x2436

### Splash Screen Design
The LaunchScreen.storyboard already exists at `ios/PapaGeil/LaunchScreen.storyboard`

**Recommended Design:**
- Clean, minimal design
- App logo centered
- Solid background color matching app theme
- No text or progress indicators (iOS guideline)
- Should match the first screen of the app for smooth transition

### Splash Screen Best Practices
1. **Keep it simple**: Avoid complex layouts
2. **Match theme**: Use app's primary background color
3. **No loading indicators**: iOS discourages them
4. **Fast transition**: Should quickly transition to app content
5. **Brand consistency**: Use logo and colors matching the app

## Implementation Checklist

- [ ] Create/obtain 1024x1024 master app icon
- [ ] Generate all required icon sizes
- [ ] Place icon files in `ios/PapaGeil/Images.xcassets/AppIcon.appiconset/`
- [ ] Update `Contents.json` with correct filenames
- [ ] Create splash screen images (1x, 2x, 3x)
- [ ] Place splash images in `ios/PapaGeil/Images.xcassets/LaunchScreen.imageset/`
- [ ] Test on multiple iPhone models/simulators
- [ ] Verify icons appear correctly in Xcode
- [ ] Build and run app to verify splash screen

## Current Status

⚠️ **PLACEHOLDER ASSETS IN USE**

The app currently uses default React Native icons and splash screen. For production release:

1. **Design Phase**: Work with designer to create brand assets
2. **Implementation**: Replace placeholder assets with production versions
3. **Testing**: Verify on all supported device sizes
4. **App Store**: Ensure 1024x1024 icon meets Apple guidelines

## Tools & Resources

- **Design**: Figma, Sketch, Adobe Illustrator
- **Generation**: AppIcon.co, MakeAppIcon
- **Testing**: Xcode Simulator (various iPhone models)
- **Guidelines**: https://developer.apple.com/design/human-interface-guidelines/app-icons
