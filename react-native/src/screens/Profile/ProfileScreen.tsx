/**
 * ProfileScreen - User profile with stats
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { Card } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';

export const ProfileScreen: React.FC<any> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const { t } = useLanguage();

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Profile Header */}
      <Card style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.avatarText}>
              {user.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={[styles.name, { color: theme.colors.text }, theme.textStyles.h2]}>
          {user.name}
        </Text>
        <Text style={[styles.email, { color: theme.colors.textSecondary }, theme.textStyles.body]}>
          {user.email}
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.text }, theme.textStyles.h3]}>
              {user.totalPoints}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Points
            </Text>
          </View>

          <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />

          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.text }, theme.textStyles.h3]}>
              {user.currentStreak}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Day Streak
            </Text>
          </View>

          <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />

          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.text }, theme.textStyles.h3]}>
              {user.totalLessonsCompleted}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Lessons
            </Text>
          </View>
        </View>
      </Card>

      {/* Learning Stats */}
      <Card style={styles.statsCard}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }, theme.textStyles.h3]}>
          Learning Stats
        </Text>

        <View style={styles.statRow}>
          <Text style={[styles.statRowLabel, { color: theme.colors.textSecondary }]}>
            Total Practice Time
          </Text>
          <Text style={[styles.statRowValue, { color: theme.colors.text }, theme.textStyles.bodyLarge]}>
            {formatTime(user.totalPracticeTime)}
          </Text>
        </View>

        <View style={styles.statRow}>
          <Text style={[styles.statRowLabel, { color: theme.colors.textSecondary }]}>
            Average Accuracy
          </Text>
          <Text style={[styles.statRowValue, { color: theme.colors.text }, theme.textStyles.bodyLarge]}>
            {user.averageAccuracyScore.toFixed(0)}%
          </Text>
        </View>

        <View style={styles.statRow}>
          <Text style={[styles.statRowLabel, { color: theme.colors.textSecondary }]}>
            Longest Streak
          </Text>
          <Text style={[styles.statRowValue, { color: theme.colors.text }, theme.textStyles.bodyLarge]}>
            {user.longestStreak} days
          </Text>
        </View>
      </Card>

      {/* Actions */}
      <Card style={styles.actionsCard}>
        <TouchableOpacity 
          style={styles.actionRow}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={[styles.actionText, { color: theme.colors.text }]}>
            {t('settings')}
          </Text>
          <Text style={[styles.actionArrow, { color: theme.colors.textTertiary }]}>›</Text>
        </TouchableOpacity>

        <View style={[styles.actionDivider, { backgroundColor: theme.colors.divider }]} />

        <TouchableOpacity 
          style={styles.actionRow}
          onPress={() => navigation.navigate('VocabularyList')}
        >
          <Text style={[styles.actionText, { color: theme.colors.text }]}>
            Vocabulary List
          </Text>
          <Text style={[styles.actionArrow, { color: theme.colors.textTertiary }]}>›</Text>
        </TouchableOpacity>

        <View style={[styles.actionDivider, { backgroundColor: theme.colors.divider }]} />

        <TouchableOpacity 
          style={styles.actionRow}
          onPress={() => navigation.navigate('DownloadManager')}
        >
          <Text style={[styles.actionText, { color: theme.colors.text }]}>
            Downloads
          </Text>
          <Text style={[styles.actionArrow, { color: theme.colors.textTertiary }]}>›</Text>
        </TouchableOpacity>
      </Card>

      <Button
        title={t('logout')}
        onPress={handleLogout}
        variant="outline"
        fullWidth
        style={styles.logoutButton}
      />
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
  profileCard: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 16,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '600',
  },
  name: {
    marginBottom: 4,
  },
  email: {},
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {},
  statLabel: {
    marginTop: 4,
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: '100%',
  },
  statsCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  statRowLabel: {},
  statRowValue: {},
  actionsCard: {
    paddingVertical: 8,
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  actionText: {
    fontSize: 16,
  },
  actionArrow: {
    fontSize: 24,
  },
  actionDivider: {
    height: 1,
  },
  logoutButton: {
    marginBottom: 32,
  },
});
