/**
 * VocabularyListScreen - Displays user's saved vocabulary
 * Features: filter by learned/unlearned, flashcard mode, mark as learned
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { VocabularyItem } from '../../types/models';
import VocabularyCard from '../../components/molecules/VocabularyCard';
import DictionaryModal from '../../components/organisms/DictionaryModal';
import {
  getVocabularyList,
  markAsLearned,
  deleteVocabulary,
} from '../../services/api/vocabulary';

type FilterType = 'all' | 'learning' | 'learned';

export default function VocabularyListScreen() {
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [flashcardMode, setFlashcardMode] = useState(false);

  useEffect(() => {
    loadVocabulary();
  }, [filter]);

  async function loadVocabulary() {
    setLoading(true);
    try {
      const filterParam =
        filter === 'all' ? undefined : filter === 'learned';
      const { items } = await getVocabularyList({
        isLearned: filterParam,
        limit: 100,
      });
      setVocabulary(items);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load vocabulary');
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await loadVocabulary();
    setRefreshing(false);
  }

  async function handleToggleLearned(item: VocabularyItem) {
    try {
      await markAsLearned(item.id, !item.isLearned);
      setVocabulary((prev) =>
        prev.map((v) =>
          v.id === item.id
            ? { ...v, isLearned: !v.isLearned, learnedAt: new Date().toISOString() }
            : v
        )
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update vocabulary');
    }
  }

  async function handleDelete(item: VocabularyItem) {
    Alert.alert(
      'Delete Word',
      `Are you sure you want to remove "${item.word}" from your vocabulary?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteVocabulary(item.id);
              setVocabulary((prev) => prev.filter((v) => v.id !== item.id));
            } catch (error: any) {
              Alert.alert(
                'Error',
                error.message || 'Failed to delete vocabulary'
              );
            }
          },
        },
      ]
    );
  }

  function handlePressCard(item: VocabularyItem) {
    setSelectedWord(item.word);
  }

  function renderFilterButton(type: FilterType, label: string, icon: string) {
    const isActive = filter === type;
    return (
      <TouchableOpacity
        style={[styles.filterButton, isActive && styles.filterButtonActive]}
        onPress={() => setFilter(type)}
      >
        <Icon
          name={icon}
          size={20}
          color={isActive ? '#2196F3' : '#999'}
        />
        <Text
          style={[
            styles.filterText,
            isActive && styles.filterTextActive,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  }

  function renderEmpty() {
    if (loading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Icon name="book" size={64} color="#ccc" />
        <Text style={styles.emptyTitle}>No Vocabulary Yet</Text>
        <Text style={styles.emptyText}>
          {filter === 'all'
            ? 'Tap any word in a lesson transcript to save it here!'
            : filter === 'learning'
            ? 'You have no words currently being learned.'
            : 'You haven\'t mastered any words yet.'}
        </Text>
      </View>
    );
  }

  function renderHeader() {
    const learnedCount = vocabulary.filter((v) => v.isLearned).length;
    const totalCount = vocabulary.length;

    return (
      <View style={styles.header}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalCount}</Text>
            <Text style={styles.statLabel}>Total Words</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{learnedCount}</Text>
            <Text style={styles.statLabel}>Learned</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalCount - learnedCount}</Text>
            <Text style={styles.statLabel}>Learning</Text>
          </View>
        </View>

        <View style={styles.filterRow}>
          {renderFilterButton('all', 'All', 'list')}
          {renderFilterButton('learning', 'Learning', 'school')}
          {renderFilterButton('learned', 'Learned', 'check-circle')}
        </View>

        <TouchableOpacity
          style={styles.flashcardButton}
          onPress={() => {
            Alert.alert('Flashcards', 'Flashcard mode coming soon!');
            // TODO: Navigate to flashcard screen
          }}
          disabled={vocabulary.length === 0}
        >
          <Icon name="style" size={20} color="#fff" />
          <Text style={styles.flashcardButtonText}>
            Practice with Flashcards
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Vocabulary</Text>

      {loading && vocabulary.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
      ) : (
        <FlatList
          data={vocabulary}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <VocabularyCard
              item={item}
              onPress={() => handlePressCard(item)}
              onToggleLearned={() => handleToggleLearned(item)}
              onDelete={() => handleDelete(item)}
            />
          )}
          ListHeaderComponent={renderHeader()}
          ListEmptyComponent={renderEmpty()}
          contentContainerStyle={
            vocabulary.length === 0 && styles.emptyList
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {selectedWord && (
        <DictionaryModal
          visible={!!selectedWord}
          word={selectedWord}
          onClose={() => setSelectedWord(null)}
          onSaved={() => loadVocabulary()}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    padding: 16,
    paddingBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  filterButtonActive: {
    backgroundColor: '#e3f2fd',
  },
  filterText: {
    fontSize: 14,
    color: '#999',
    marginLeft: 8,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#2196F3',
  },
  flashcardButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 12,
  },
  flashcardButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});
