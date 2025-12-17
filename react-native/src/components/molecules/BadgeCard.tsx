/**
 * BadgeCard - Displays an achievement badge
 */

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Achievement } from '../../types/models';

interface BadgeCardProps {
  achievement: Achievement;
  earned?: boolean;
  earnedAt?: string;
}

export default function BadgeCard({
  achievement,
  earned = false,
  earnedAt,
}: BadgeCardProps) {
  return (
    <View style={[styles.container, !earned && styles.containerLocked]}>
      <View style={styles.badgeIcon}>
        {achievement.iconUrl ? (
          <Image
            source={{ uri: achievement.iconUrl }}
            style={[styles.icon, !earned && styles.iconLocked]}
          />
        ) : (
          <Icon
            name="emoji-events"
            size={48}
            color={earned ? '#FFD700' : '#ccc'}
          />
        )}

        {earned && (
          <View style={styles.checkBadge}>
            <Icon name="check-circle" size={20} color="#4CAF50" />
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={[styles.badgeName, !earned && styles.textLocked]}>
          {achievement.badgeName}
        </Text>
        <Text style={[styles.description, !earned && styles.textLocked]}>
          {achievement.description}
        </Text>

        {earned && earnedAt && (
          <Text style={styles.earnedDate}>
            Earned {new Date(earnedAt).toLocaleDateString()}
          </Text>
        )}

        {!earned && (
          <View style={styles.pointsBadge}>
            <Icon name="star" size={14} color="#FF9800" />
            <Text style={styles.pointsText}>{achievement.pointsAwarded} pts</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  containerLocked: {
    opacity: 0.6,
  },
  badgeIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  iconLocked: {
    opacity: 0.5,
  },
  checkBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  badgeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  textLocked: {
    color: '#999',
  },
  earnedDate: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  pointsText: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '600',
    marginLeft: 4,
  },
});
