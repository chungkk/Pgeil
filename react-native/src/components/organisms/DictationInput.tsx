/**
 * DictationInput - Organism component with color-coded feedback
 */

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { calculateAccuracy } from '@/services/api/lessons';

interface DictationInputProps {
  correctAnswer: string;
  onSubmit: (userAnswer: string) => void;
  placeholder?: string;
  showRealTimeFeedback?: boolean;
}

export const DictationInput: React.FC<DictationInputProps> = ({
  correctAnswer,
  onSubmit,
  placeholder = 'Type your answer here...',
  showRealTimeFeedback = false,
}) => {
  const { theme } = useTheme();
  const [userAnswer, setUserAnswer] = useState('');

  const getCharacterColor = (index: number): string => {
    if (!showRealTimeFeedback || index >= userAnswer.length) {
      return theme.colors.text;
    }

    const userChar = userAnswer[index]?.toLowerCase();
    const correctChar = correctAnswer[index]?.toLowerCase();

    if (userChar === correctChar) {
      return theme.colors.success; // Green for correct
    } else {
      return theme.colors.error; // Red for incorrect
    }
  };

  const renderColoredText = () => {
    if (!showRealTimeFeedback) {
      return (
        <Text style={[styles.previewText, { color: theme.colors.text }]}>
          {userAnswer || placeholder}
        </Text>
      );
    }

    return (
      <View style={styles.coloredTextContainer}>
        {userAnswer.split('').map((char, index) => (
          <Text
            key={index}
            style={[
              styles.coloredChar,
              { color: getCharacterColor(index) },
            ]}
          >
            {char}
          </Text>
        ))}
        {!userAnswer && (
          <Text style={[styles.placeholder, { color: theme.colors.textTertiary }]}>
            {placeholder}
          </Text>
        )}
      </View>
    );
  };

  const handleSubmit = () => {
    onSubmit(userAnswer);
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              color: showRealTimeFeedback ? 'transparent' : theme.colors.text,
            },
          ]}
          value={userAnswer}
          onChangeText={setUserAnswer}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textTertiary}
          multiline
          onSubmitEditing={handleSubmit}
          returnKeyType="done"
          autoCorrect={false}
          autoCapitalize="none"
        />
        {showRealTimeFeedback && (
          <View style={styles.overlay}>
            {renderColoredText()}
          </View>
        )}
      </View>

      {showRealTimeFeedback && userAnswer && (
        <View style={styles.accuracyIndicator}>
          <Text style={[styles.accuracyText, { color: theme.colors.textSecondary }]}>
            Accuracy: {calculateAccuracy(userAnswer, correctAnswer)}%
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  inputContainer: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    minHeight: 120,
    position: 'relative',
  },
  input: {
    fontSize: 16,
    lineHeight: 24,
    minHeight: 88,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
    pointerEvents: 'none',
  },
  coloredTextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  coloredChar: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  previewText: {
    fontSize: 16,
    lineHeight: 24,
  },
  placeholder: {
    fontSize: 16,
  },
  accuracyIndicator: {
    marginTop: 8,
    alignItems: 'flex-end',
  },
  accuracyText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
