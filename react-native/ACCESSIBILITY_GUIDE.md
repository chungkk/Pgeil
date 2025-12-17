# Accessibility Guide

## Overview

This guide covers implementing accessibility features for screen readers (VoiceOver on iOS) in the React Native German learning app.

## Core Principles

1. **All interactive elements** must have accessibility labels
2. **Descriptive labels** that convey purpose and state
3. **Proper roles** for semantic understanding
4. **Hints** for complex interactions
5. **Announcements** for dynamic content changes

## Implementation Status

### Utilities Created
✅ **src/utils/accessibility.ts**
- Accessibility label generators
- Role constants
- Platform-specific helpers
- Screen reader announcements

### Components to Update

#### High Priority (Interactive Elements)
- [ ] Button components (atoms/molecules)
- [ ] Navigation tabs
- [ ] Lesson cards
- [ ] Dictionary modal
- [ ] Vocabulary cards
- [ ] Form inputs

#### Medium Priority (Content)
- [ ] Screen headers
- [ ] Progress indicators
- [ ] Loading states
- [ ] Error messages
- [ ] Success messages

#### Low Priority (Decorative)
- [ ] Background images
- [ ] Decorative icons
- [ ] Dividers

## Accessibility Properties

### Essential Props

```typescript
import { getAccessibilityProps } from '@/utils/accessibility';

<TouchableOpacity
  {...getAccessibilityProps(
    'Start Lesson', // label
    'button',       // role
    'Double tap to begin the lesson' // hint
  )}
  onPress={handleStartLesson}
>
  <Text>Start</Text>
</TouchableOpacity>
```

### Role Types

| Role | Usage |
|------|-------|
| `button` | Buttons, pressable elements |
| `link` | Navigation links |
| `header` | Screen/section titles |
| `text` | Static text content |
| `image` | Images with information |
| `imagebutton` | Pressable images/icons |
| `search` | Search inputs |
| `adjustable` | Sliders, pickers |
| `none` | Decorative elements |

### State Communication

```typescript
// Loading state
<Button
  accessibilityLabel="Submit"
  accessibilityState={{ disabled: isLoading, busy: isLoading }}
>

// Selected state
<TouchableOpacity
  accessibilityLabel="German language"
  accessibilityState={{ selected: language === 'de' }}
>

// Disabled state
<Button
  accessibilityLabel="Continue"
  accessibilityState={{ disabled: !canContinue }}
  disabled={!canContinue}
>
```

## Component Examples

### Button with Accessibility

```typescript
import { A11yRoles, getButtonAccessibilityLabel } from '@/utils/accessibility';

interface AccessibleButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  label,
  onPress,
  loading = false,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      accessibilityLabel={getButtonAccessibilityLabel(label, loading, disabled)}
      accessibilityRole={A11yRoles.button}
      accessibilityHint={`Double tap to ${label.toLowerCase()}`}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      onPress={onPress}
      disabled={disabled || loading}
    >
      <Text>{loading ? 'Loading...' : label}</Text>
    </TouchableOpacity>
  );
};
```

### Lesson Card with Accessibility

```typescript
import { getLessonAccessibilityLabel, A11yRoles } from '@/utils/accessibility';

const LessonCard: React.FC<{ lesson: Lesson }> = ({ lesson }) => {
  return (
    <TouchableOpacity
      accessibilityLabel={getLessonAccessibilityLabel(
        lesson.title,
        lesson.level,
        lesson.duration,
        lesson.completed
      )}
      accessibilityRole={A11yRoles.button}
      accessibilityHint="Double tap to open lesson details"
      onPress={() => navigation.navigate('LessonDetail', { id: lesson.id })}
    >
      <View>
        <Text>{lesson.title}</Text>
        <Text>{lesson.level}</Text>
      </View>
    </TouchableOpacity>
  );
};
```

### Progress Indicator with Accessibility

```typescript
import { getProgressAccessibilityLabel } from '@/utils/accessibility';

const ProgressBar: React.FC<{ current: number; total: number }> = ({
  current,
  total,
}) => {
  const percentage = (current / total) * 100;

  return (
    <View
      accessible={true}
      accessibilityLabel={getProgressAccessibilityLabel(current, total)}
      accessibilityRole="progressbar"
      accessibilityValue={{
        min: 0,
        max: total,
        now: current,
        text: `${percentage}%`,
      }}
    >
      <View style={{ width: `${percentage}%`, height: 4, backgroundColor: 'blue' }} />
    </View>
  );
};
```

### Form Input with Accessibility

```typescript
const AccessibleTextInput: React.FC<{
  label: string;
  value: string;
  onChange: (text: string) => void;
  error?: string;
}> = ({ label, value, onChange, error }) => {
  return (
    <View>
      <Text accessibilityRole="text">{label}</Text>
      <TextInput
        accessibilityLabel={label}
        accessibilityHint={`Enter your ${label.toLowerCase()}`}
        accessibilityValue={{ text: value }}
        value={value}
        onChangeText={onChange}
      />
      {error && (
        <Text
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
        >
          {error}
        </Text>
      )}
    </View>
  );
};
```

### Header with Accessibility

```typescript
import { getHeaderAccessibilityProps } from '@/utils/accessibility';

const ScreenHeader: React.FC<{ title: string }> = ({ title }) => {
  return (
    <Text
      style={styles.header}
      {...getHeaderAccessibilityProps(1)}
    >
      {title}
    </Text>
  );
};
```

### Decorative Elements

```typescript
// Mark decorative images as not accessible
<Image
  source={backgroundImage}
  accessible={false}
  accessibilityElementsHidden={true}
  importantForAccessibility="no"
/>
```

## Dynamic Announcements

### Success Messages

```typescript
import { announceForAccessibility } from '@/utils/accessibility';

const handleSubmit = async () => {
  try {
    await submitAnswer();
    announceForAccessibility('Answer submitted successfully');
  } catch (error) {
    announceForAccessibility('Error submitting answer. Please try again.');
  }
};
```

### Progress Updates

```typescript
const handleLessonComplete = () => {
  const message = `Lesson completed! You earned ${score} points.`;
  announceForAccessibility(message);
  navigation.goBack();
};
```

### Navigation Changes

```typescript
useFocusEffect(
  useCallback(() => {
    announceForAccessibility('Lesson details screen');
  }, [])
);
```

## Testing Accessibility

### VoiceOver Testing (iOS)

1. **Enable VoiceOver**
   - Settings → Accessibility → VoiceOver → On
   - Or triple-click side button (if configured)

2. **Basic Gestures**
   - Single tap: Select element
   - Double tap: Activate element
   - Swipe right: Next element
   - Swipe left: Previous element
   - Two-finger swipe up: Read from top
   - Two-finger swipe down: Read from current position

3. **Test Scenarios**
   - Navigate through all screens
   - Ensure all buttons are reachable
   - Verify labels are descriptive
   - Check form inputs are labeled
   - Test dynamic announcements

### Automated Testing

```typescript
import { render } from '@testing-library/react-native';

describe('Accessibility Tests', () => {
  it('should have proper accessibility labels', () => {
    const { getByA11yLabel } = render(<LessonCard lesson={mockLesson} />);
    
    expect(
      getByA11yLabel(/Beginner German.*5 minutes.*Not completed/)
    ).toBeTruthy();
  });

  it('should have button role', () => {
    const { getByRole } = render(<SubmitButton />);
    expect(getByRole('button')).toBeTruthy();
  });
});
```

## Best Practices Checklist

### Labels
- [x] Descriptive and concise
- [x] Include state information (selected, disabled, loading)
- [x] Avoid redundant "button" in label (role handles this)
- [x] Include relevant context (e.g., "3 of 10 lessons")

### Roles
- [x] All interactive elements have roles
- [x] Correct semantic roles used
- [x] Decorative elements excluded from accessibility tree

### Hints
- [x] Provide action hints for complex interactions
- [x] Keep hints short and action-oriented
- [x] Don't repeat information in label

### State
- [x] Communicate disabled state
- [x] Indicate loading/busy state
- [x] Show selected/checked state
- [x] Update state dynamically

### Content
- [x] Logical reading order
- [x] Grouped related elements
- [x] Headers for sections
- [x] Live regions for dynamic content

## Common Mistakes to Avoid

### ❌ Bad: Generic Labels
```typescript
<TouchableOpacity accessibilityLabel="Button">
```

### ✅ Good: Descriptive Labels
```typescript
<TouchableOpacity accessibilityLabel="Start Beginner German Lesson">
```

---

### ❌ Bad: Missing Role
```typescript
<TouchableOpacity onPress={handlePress}>
```

### ✅ Good: With Role
```typescript
<TouchableOpacity
  accessibilityRole="button"
  onPress={handlePress}
>
```

---

### ❌ Bad: Nested Accessible Elements
```typescript
<TouchableOpacity accessible={true}>
  <Text accessible={true}>Start</Text>
</TouchableOpacity>
```

### ✅ Good: Parent Accessible Only
```typescript
<TouchableOpacity accessible={true} accessibilityLabel="Start Lesson">
  <Text>Start</Text>
</TouchableOpacity>
```

---

### ❌ Bad: No State Communication
```typescript
<Button disabled={true} />
```

### ✅ Good: Communicates State
```typescript
<Button
  disabled={true}
  accessibilityState={{ disabled: true }}
/>
```

## Resources

- [React Native Accessibility](https://reactnative.dev/docs/accessibility)
- [iOS VoiceOver Guide](https://support.apple.com/guide/iphone/turn-on-and-practice-voiceover-iph3e2e415f/ios)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Apple Accessibility Guidelines](https://developer.apple.com/design/human-interface-guidelines/accessibility)

## Next Steps

1. Audit all interactive components
2. Add accessibility props to buttons, cards, inputs
3. Test with VoiceOver
4. Add automated accessibility tests
5. Document screen reader instructions for users
