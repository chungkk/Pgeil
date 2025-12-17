/**
 * FilterChips - Molecule component for difficulty/category filters
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface FilterChip {
  id: string;
  label: string;
}

interface FilterChipsProps {
  filters: FilterChip[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  filters,
  selectedId,
  onSelect,
}) => {
  const { theme } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* All filter */}
      <TouchableOpacity
        style={[
          styles.chip,
          {
            backgroundColor: selectedId === null ? theme.colors.primary : theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
        onPress={() => onSelect(null)}
      >
        <Text
          style={[
            styles.chipText,
            {
              color: selectedId === null ? '#FFFFFF' : theme.colors.text,
              fontWeight: selectedId === null ? '600' : '400',
            },
          ]}
        >
          All
        </Text>
      </TouchableOpacity>

      {/* Filter chips */}
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.id}
          style={[
            styles.chip,
            {
              backgroundColor:
                selectedId === filter.id ? theme.colors.primary : theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
          onPress={() => onSelect(filter.id)}
        >
          <Text
            style={[
              styles.chipText,
              {
                color: selectedId === filter.id ? '#FFFFFF' : theme.colors.text,
                fontWeight: selectedId === filter.id ? '600' : '400',
              },
            ]}
          >
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  chipText: {
    fontSize: 14,
  },
});
