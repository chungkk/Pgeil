/**
 * StorageCard - Displays storage usage for downloaded lessons
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface StorageCardProps {
  usedMB: number;
  downloadCount: number;
  maxDownloads?: number;
}

export default function StorageCard({
  usedMB,
  downloadCount,
  maxDownloads = 10,
}: StorageCardProps) {
  const usedGB = usedMB / 1024;
  const percentage = (downloadCount / maxDownloads) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="storage" size={24} color="#2196F3" />
        <Text style={styles.title}>Storage Usage</Text>
      </View>

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {usedGB >= 1 ? `${usedGB.toFixed(2)} GB` : `${usedMB.toFixed(0)} MB`}
          </Text>
          <Text style={styles.statLabel}>Used</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {downloadCount} / {maxDownloads}
          </Text>
          <Text style={styles.statLabel}>Lessons</Text>
        </View>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${percentage}%`,
                backgroundColor:
                  percentage >= 90
                    ? '#f44336'
                    : percentage >= 70
                    ? '#FF9800'
                    : '#4CAF50',
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>{Math.round(percentage)}% capacity</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginLeft: 8,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  divider: {
    width: 1,
    backgroundColor: '#e0e0e0',
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
});
