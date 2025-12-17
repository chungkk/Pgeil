/**
 * ProgressBar - Molecule component for progress visualization
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  showLabel?: boolean;
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  showLabel = true,
  color,
}) => {
  const { theme } = useTheme();
  const progressColor = color || theme.colors.primary;
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <View style={styles.container}>
      {showLabel && (
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          {Math.round(clampedProgress)}%
        </Text>
      )}

      <View
        style={[
          styles.track,
          {
            height,
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${clampedProgress}%`,
              backgroundColor: progressColor,
              height,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
    textAlign: 'right',
  },
  track: {
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
  },
  fill: {
    borderRadius: 4,
  },
});
