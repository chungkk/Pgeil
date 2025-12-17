/**
 * VocabularyCard - Displays a vocabulary item in the list
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { VocabularyItem } from '../../types/models';

interface VocabularyCardProps {
  item: VocabularyItem;
  onPress: () => void;
  onToggleLearned: () => void;
  onDelete: () => void;
}

export default function VocabularyCard({
  item,
  onPress,
  onToggleLearned,
  onDelete,
}: VocabularyCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.wordSection}>
          <Text style={styles.word}>{item.word}</Text>
          {item.partOfSpeech && (
            <Text style={styles.partOfSpeech}>({item.partOfSpeech})</Text>
          )}
        </View>

        <Pressable
          onPress={onToggleLearned}
          style={[
            styles.learnedBadge,
            item.isLearned && styles.learnedBadgeActive,
          ]}
        >
          <Icon
            name={item.isLearned ? 'check-circle' : 'check-circle-outline'}
            size={20}
            color={item.isLearned ? '#4CAF50' : '#999'}
          />
          <Text
            style={[
              styles.learnedText,
              item.isLearned && styles.learnedTextActive,
            ]}
          >
            {item.isLearned ? 'Learned' : 'Learning'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.body}>
        <Text style={styles.definition} numberOfLines={2}>
          {item.definition}
        </Text>

        {item.translations.vietnamese && (
          <Text style={styles.translation} numberOfLines={1}>
            🇻🇳 {item.translations.vietnamese}
          </Text>
        )}

        {item.translations.english && (
          <Text style={styles.translation} numberOfLines={1}>
            🇺🇸 {item.translations.english}
          </Text>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.metadata}>
          {item.sourceContext && (
            <Text style={styles.context} numberOfLines={1}>
              From: "{item.sourceContext}"
            </Text>
          )}
          <Text style={styles.savedDate}>
            Saved {new Date(item.savedAt).toLocaleDateString()}
          </Text>
        </View>

        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <Icon name="delete-outline" size={20} color="#f44336" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  wordSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  word: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginRight: 8,
  },
  partOfSpeech: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  learnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
  },
  learnedBadgeActive: {
    backgroundColor: '#e8f5e9',
  },
  learnedText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
    fontWeight: '600',
  },
  learnedTextActive: {
    color: '#4CAF50',
  },
  body: {
    marginBottom: 12,
  },
  definition: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 8,
  },
  translation: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  metadata: {
    flex: 1,
  },
  context: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  savedDate: {
    fontSize: 11,
    color: '#bbb',
  },
  deleteButton: {
    padding: 8,
  },
});
