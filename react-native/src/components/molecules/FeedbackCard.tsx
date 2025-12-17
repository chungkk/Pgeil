/**
 * FeedbackCard - Molecule component for accuracy/feedback display
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Card } from '@/components/atoms/Card';

interface FeedbackCardProps {
  accuracy: number; // 0-100
  attempts?: number;
  improvement?: number; // Percentage change from last attempt
  feedback?: string;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({
  accuracy,
  attempts,
  improvement,
  feedback,
}) => {
  const { theme } = useTheme();

  const getAccuracyColor = () => {
    if (accuracy >= 90) return theme.colors.success;
    if (accuracy >= 70) return theme.colors.warning;
    return theme.colors.error;
  };

  const getGrade = () => {
    if (accuracy >= 90) return 'Excellent';
    if (accuracy >= 80) return 'Good';
    if (accuracy >= 70) return 'Fair';
    return 'Keep Practicing';
  };

  return (
    <Card style={styles.card}>
      {/* Accuracy Score */}
      <View style={styles.scoreSection}>
        <Text style={[styles.scoreLabel, { color: theme.colors.textSecondary }]}>
          Accuracy
        </Text>
        <Text
          style={[
            styles.scoreValue,
            { color: getAccuracyColor() },
            theme.textStyles.h1,
          ]}
        >
          {accuracy}%
        </Text>
        <Text style={[styles.grade, { color: theme.colors.text }]}>
          {getGrade()}
        </Text>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        {attempts !== undefined && (
          <View style={styles.stat}>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Attempts
            </Text>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              {attempts}
            </Text>
          </View>
        )}

        {improvement !== undefined && (
          <View style={styles.stat}>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Improvement
            </Text>
            <Text
              style={[
                styles.statValue,
                {
                  color: improvement > 0
                    ? theme.colors.success
                    : improvement < 0
                    ? theme.colors.error
                    : theme.colors.textSecondary,
                },
              ]}
            >
              {improvement > 0 ? '+' : ''}{improvement}%
            </Text>
          </View>
        )}
      </View>

      {/* Feedback Text */}
      {feedback && (
        <View style={styles.feedbackSection}>
          <Text style={[styles.feedbackLabel, { color: theme.colors.textSecondary }]}>
            Feedback
          </Text>
          <Text style={[styles.feedbackText, { color: theme.colors.text }]}>
            {feedback}
          </Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 16,
  },
  scoreSection: {
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 16,
  },
  scoreLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  scoreValue: {
    marginBottom: 4,
  },
  grade: {
    fontSize: 18,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
  },
  feedbackSection: {},
  feedbackLabel: {
    fontSize: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  feedbackText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
