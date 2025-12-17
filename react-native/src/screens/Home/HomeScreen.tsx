/**
 * HomeScreen - Main screen with lesson list, search, filters
 */

import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { SearchBar } from '@/components/molecules/SearchBar';
import { FilterChips } from '@/components/molecules/FilterChips';
import { LessonCard } from '@/components/molecules/LessonCard';
import { getLessons } from '@/services/api/lessons';
import { Lesson } from '@/types/models';

const DIFFICULTY_FILTERS = [
  { id: 'Beginner', label: 'Beginner' },
  { id: 'Intermediate', label: 'Intermediate' },
  { id: 'Advanced', label: 'Advanced' },
];

export const HomeScreen: React.FC<any> = ({ navigation }) => {
  const { theme } = useTheme();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchLessons();
  }, [searchQuery, selectedDifficulty]);

  const fetchLessons = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await getLessons({
        page: pageNum,
        limit: 20,
        difficulty: selectedDifficulty || undefined,
        search: searchQuery || undefined,
      });
      
      if (pageNum === 1) {
        setLessons(response.data);
      } else {
        setLessons([...lessons, ...response.data]);
      }
      setPage(pageNum);
    } catch (error: any) {
      console.error('Fetch lessons error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLessons(1);
  };

  const handleLoadMore = () => {
    if (!loading) {
      fetchLessons(page + 1);
    }
  };

  const handleLessonPress = (lesson: Lesson) => {
    navigation.navigate('LessonDetail', { lessonId: lesson.id });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search lessons..."
        />
      </View>

      <FilterChips
        filters={DIFFICULTY_FILTERS}
        selectedId={selectedDifficulty}
        onSelect={setSelectedDifficulty}
      />

      <FlatList
        data={lessons}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LessonCard
            lesson={item}
            onPress={() => handleLessonPress(item)}
            progress={50} // TODO: Get from user progress
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  list: {
    padding: 16,
  },
});
