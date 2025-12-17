/**
 * AchievementsScreen - Displays badge collection
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { getAchievements, getUserAchievements } from '../../services/api/leaderboard';
import { Achievement } from '../../types/models';
import BadgeCard from '../../components/molecules/BadgeCard';

interface AchievementWithStatus extends Achievement {
  earned: boolean;
  earnedAt?: string;
}

export default function AchievementsScreen() {
  const [achievements, setAchievements] = useState<AchievementWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAchievements();
  }, []);

  async function loadAchievements() {
    try {
      setLoading(true);

      // Load all achievements and user's earned achievements
      const [allAchievements, userAchievements] = await Promise.all([
        getAchievements(),
        getUserAchievements(),
      ]);

      // Merge data
      const mergedAchievements: AchievementWithStatus[] = allAchievements.map(
        (achievement) => {
          const earned = userAchievements.find(
            (ua) => ua.id === achievement.id
          );

          return {
            ...achievement,
            earned: !!earned,
            earnedAt: earned?.earnedAt,
          };
        }
      );

      // Sort: earned first, then by points
      mergedAchievements.sort((a, b) => {
        if (a.earned && !b.earned) return -1;
        if (!a.earned && b.earned) return 1;
        return b.pointsAwarded - a.pointsAwarded;
      });

      setAchievements(mergedAchievements);
    } catch (error: any) {
      console.error('Failed to load achievements:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await loadAchievements();
    setRefreshing(false);
  }

  const earnedCount = achievements.filter((a) => a.earned).length;
  const totalPoints = achievements
    .filter((a) => a.earned)
    .reduce((sum, a) => sum + a.pointsAwarded, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Achievements</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{earnedCount}</Text>
            <Text style={styles.statLabel}>Earned</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{achievements.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalPoints}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
      ) : (
        <FlatList
          data={achievements}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <BadgeCard
              achievement={item}
              earned={item.earned}
              earnedAt={item.earnedAt}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No achievements available</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginHorizontal: 4,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    paddingVertical: 64,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
  },
});
