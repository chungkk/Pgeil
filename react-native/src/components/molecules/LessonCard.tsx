/**
 * LessonCard - Molecule component for lesson list item
 */

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Lesson } from '@/types/models';
import { Card } from '@/components/atoms/Card';

interface LessonCardProps {
  lesson: Lesson;
  onPress: () => void;
  progress?: number; // 0-100
}

export const LessonCard: React.FC<LessonCardProps> = ({ lesson, onPress, progress }) => {
  const { theme } = useTheme();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return theme.colors.success;
      case 'Intermediate':
        return theme.colors.warning;
      case 'Advanced':
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  return (
    <Card onPress={onPress} style={styles.card} elevation="sm">
      <View style={styles.content}>
        {/* Thumbnail */}
        <Image
          source={{ uri: lesson.thumbnailUrl }}
          style={styles.thumbnail}
          resizeMode="cover"
        />

        {/* Info */}
        <View style={styles.info}>
          <Text
            style={[styles.title, { color: theme.colors.text }, theme.textStyles.h4]}
            numberOfLines={2}
          >
            {lesson.title}
          </Text>

          <Text
            style={[styles.description, { color: theme.colors.textSecondary }]}
            numberOfLines={2}
          >
            {lesson.description}
          </Text>

          {/* Meta */}
          <View style={styles.meta}>
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor(lesson.difficultyLevel) + '20' },
              ]}
            >
              <Text
                style={[
                  styles.difficultyText,
                  { color: getDifficultyColor(lesson.difficultyLevel) },
                ]}
              >
                {lesson.difficultyLevel}
              </Text>
            </View>

            <Text style={[styles.duration, { color: theme.colors.textTertiary }]}>
              {formatDuration(lesson.duration)}
            </Text>

            {lesson.isDownloaded && (
              <Text style={[styles.downloadIcon, { color: theme.colors.success }]}>⬇</Text>
            )}
          </View>

          {/* Completion Badge */}
          {progress === 100 && (
            <View style={styles.completionBadge}>
              <Text style={styles.completionIcon}>✓</Text>
              <Text style={[styles.completionText, { color: theme.colors.success }]}>
                Completed
              </Text>
            </View>
          )}

          {/* Progress bar */}
          {progress !== undefined && progress > 0 && progress < 100 && (
            <View style={[styles.progressContainer, { backgroundColor: theme.colors.surface }]}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${progress}%`,
                    backgroundColor: theme.colors.primary,
                  },
                ]}
              />
            </View>
          )}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    padding: 0,
  },
  content: {
    flexDirection: 'row',
  },
  thumbnail: {
    width: 120,
    height: 120,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  info: {
    flex: 1,
    padding: 12,
  },
  title: {
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  duration: {
    fontSize: 12,
  },
  downloadIcon: {
    fontSize: 16,
  },
  progressContainer: {
    height: 4,
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  completionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  completionIcon: {
    fontSize: 16,
    color: '#50C878',
    marginRight: 4,
  },
  completionText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
