/**
 * TranscriptView - Organism component for synchronized transcript
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { TranscriptSegment } from '@/types/models';

interface TranscriptViewProps {
  segments: TranscriptSegment[];
  currentTime: number;
  onWordTap?: (word: string) => void;
  onSegmentTap?: (startTime: number) => void;
}

export const TranscriptView: React.FC<TranscriptViewProps> = ({
  segments,
  currentTime,
  onWordTap,
  onSegmentTap,
}) => {
  const { theme } = useTheme();
  const { language } = useLanguage();

  const getCurrentSegment = (): string | null => {
    for (const segment of segments) {
      if (currentTime >= segment.startTime && currentTime <= segment.endTime) {
        return segment.id;
      }
    }
    return null;
  };

  const currentSegmentId = getCurrentSegment();

  const getTextByLanguage = (segment: TranscriptSegment): string => {
    switch (language) {
      case 'de':
        return segment.textGerman;
      case 'vi':
        return segment.textVietnamese;
      case 'en':
        return segment.textEnglish;
      default:
        return segment.textGerman;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {segments.map((segment) => {
        const isActive = segment.id === currentSegmentId;
        const text = getTextByLanguage(segment);

        return (
          <TouchableOpacity
            key={segment.id}
            style={[
              styles.segment,
              isActive && {
                backgroundColor: theme.colors.primary + '20',
                borderLeftColor: theme.colors.primary,
                borderLeftWidth: 3,
              },
            ]}
            onPress={() => onSegmentTap?.(segment.startTime)}
          >
            <Text
              style={[
                styles.text,
                {
                  color: isActive ? theme.colors.primary : theme.colors.text,
                  fontWeight: isActive ? '600' : '400',
                },
              ]}
            >
              {text.split(' ').map((word, index) => (
                <Text
                  key={index}
                  onPress={() => onWordTap?.(word)}
                  style={styles.word}
                >
                  {word}{' '}
                </Text>
              ))}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  segment: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  word: {
    // Word-specific styling can be added here
  },
});
