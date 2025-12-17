/**
 * LeaderboardScreen - Displays rankings with weekly/monthly tabs
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getLeaderboard } from '../../services/api/leaderboard';
import { LeaderboardEntry } from '../../types/models';
import { useAuth } from '../../context/AuthContext';

type Period = 'weekly' | 'monthly' | 'all-time';

export default function LeaderboardScreen() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<Period>('weekly');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadLeaderboard();
  }, [period]);

  async function loadLeaderboard() {
    try {
      setLoading(true);
      const data = await getLeaderboard({ period, limit: 100 });
      setEntries(data.entries);
      setUserRank(data.userRank);
    } catch (error: any) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await loadLeaderboard();
    setRefreshing(false);
  }

  function renderPeriodTab(label: string, value: Period) {
    const isActive = period === value;
    return (
      <TouchableOpacity
        style={[styles.tab, isActive && styles.tabActive]}
        onPress={() => setPeriod(value)}
      >
        <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  }

  function getRankMedal(rank: number): string | null {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  }

  function renderLeaderboardEntry({ item, index }: { item: LeaderboardEntry; index: number }) {
    const isCurrentUser = item.userId === user?.id;
    const medal = getRankMedal(item.rankPosition);

    return (
      <View
        style={[
          styles.entryCard,
          isCurrentUser && styles.entryCardHighlight,
        ]}
      >
        <View style={styles.rankContainer}>
          {medal ? (
            <Text style={styles.medal}>{medal}</Text>
          ) : (
            <Text style={styles.rank}>{item.rankPosition}</Text>
          )}
        </View>

        <View style={styles.avatarContainer}>
          {item.userAvatar ? (
            <Image source={{ uri: item.userAvatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>
                {item.userName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.userInfo}>
          <Text style={[styles.userName, isCurrentUser && styles.userNameHighlight]}>
            {item.userName}
            {isCurrentUser && ' (You)'}
          </Text>
          <View style={styles.statsRow}>
            <Icon name="school" size={14} color="#666" />
            <Text style={styles.statText}>{item.lessonsCompleted} lessons</Text>
            {item.achievementCount > 0 && (
              <>
                <Icon name="emoji-events" size={14} color="#FFD700" style={styles.statIcon} />
                <Text style={styles.statText}>{item.achievementCount} badges</Text>
              </>
            )}
          </View>
        </View>

        <View style={styles.scoreContainer}>
          <Text style={styles.score}>{item.totalScore.toLocaleString()}</Text>
          <Text style={styles.scoreLabel}>pts</Text>
        </View>
      </View>
    );
  }

  function renderUserRankBanner() {
    if (!userRank) return null;

    return (
      <View style={styles.userRankBanner}>
        <Icon name="my-location" size={20} color="#2196F3" />
        <Text style={styles.userRankText}>
          Your rank: #{userRank}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <View style={styles.tabs}>
          {renderPeriodTab('Weekly', 'weekly')}
          {renderPeriodTab('Monthly', 'monthly')}
          {renderPeriodTab('All Time', 'all-time')}
        </View>
      </View>

      {renderUserRankBanner()}

      {loading && entries.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.userId}
          renderItem={renderLeaderboardEntry}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="leaderboard" size={64} color="#ccc" />
              <Text style={styles.emptyTitle}>No Rankings Yet</Text>
              <Text style={styles.emptyText}>
                Complete lessons to appear on the leaderboard!
              </Text>
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
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#2196F3',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  tabTextActive: {
    color: '#fff',
  },
  userRankBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e3f2fd',
    paddingVertical: 12,
    gap: 8,
  },
  userRankText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  entryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  entryCardHighlight: {
    backgroundColor: '#e3f2fd',
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  medal: {
    fontSize: 28,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  userNameHighlight: {
    color: '#2196F3',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#666',
  },
  statIcon: {
    marginLeft: 8,
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  score: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
