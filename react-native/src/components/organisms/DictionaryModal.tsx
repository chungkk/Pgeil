/**
 * DictionaryModal - Full-screen modal for word definitions
 * Displays definition, translations, examples, pronunciation, and save button
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { DictionaryEntry } from '../../types/models';
import { lookupWord } from '../../services/api/dictionary';
import { saveToVocabulary } from '../../services/api/vocabulary';

interface DictionaryModalProps {
  visible: boolean;
  word: string;
  lessonId?: string;
  context?: string;
  onClose: () => void;
  onSaved?: () => void;
}

export default function DictionaryModal({
  visible,
  word,
  lessonId,
  context,
  onClose,
  onSaved,
}: DictionaryModalProps) {
  const [loading, setLoading] = useState(false);
  const [entry, setEntry] = useState<DictionaryEntry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (visible && word) {
      loadWord();
    }
    return () => {
      setEntry(null);
      setError(null);
      setSaved(false);
    };
  }, [visible, word]);

  async function loadWord() {
    setLoading(true);
    setError(null);
    try {
      const result = await lookupWord(word);
      setEntry(result);
    } catch (err: any) {
      setError(err.message || 'Failed to load word definition');
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveToVocabulary() {
    if (!entry) return;

    setSaving(true);
    try {
      await saveToVocabulary({
        word: entry.word,
        sourceLessonId: lessonId,
        sourceContext: context,
      });
      setSaved(true);
      onSaved?.();
      Alert.alert('Success', `"${entry.word}" added to your vocabulary!`);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to save vocabulary');
    } finally {
      setSaving(false);
    }
  }

  function handlePlayAudio() {
    if (entry?.pronunciationAudioUrl) {
      // TODO: Integrate with audio player service
      Alert.alert('Audio', 'Pronunciation audio playback coming soon!');
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Dictionary</Text>
          <View style={styles.placeholder} />
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2196F3" />
            <Text style={styles.loadingText}>Looking up "{word}"...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Icon name="error-outline" size={48} color="#f44336" />
            <Text style={styles.errorTitle}>Offline or Not Found</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={loadWord} style={styles.retryButton}>
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {entry && !loading && !error && (
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.wordSection}>
              <Text style={styles.word}>{entry.word}</Text>
              {entry.phonetic && (
                <Text style={styles.phonetic}>{entry.phonetic}</Text>
              )}
              {entry.partOfSpeech && (
                <Text style={styles.partOfSpeech}>({entry.partOfSpeech})</Text>
              )}
            </View>

            {entry.pronunciationAudioUrl && (
              <TouchableOpacity
                onPress={handlePlayAudio}
                style={styles.audioButton}
              >
                <Icon name="volume-up" size={24} color="#2196F3" />
                <Text style={styles.audioText}>Play Pronunciation</Text>
              </TouchableOpacity>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Definition</Text>
              <Text style={styles.definition}>{entry.definition}</Text>
            </View>

            {(entry.translations.vietnamese || entry.translations.english) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Translations</Text>
                {entry.translations.vietnamese && (
                  <View style={styles.translationRow}>
                    <Text style={styles.flag}>🇻🇳</Text>
                    <Text style={styles.translation}>
                      {entry.translations.vietnamese}
                    </Text>
                  </View>
                )}
                {entry.translations.english && (
                  <View style={styles.translationRow}>
                    <Text style={styles.flag}>🇺🇸</Text>
                    <Text style={styles.translation}>
                      {entry.translations.english}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {entry.exampleSentences && entry.exampleSentences.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Examples</Text>
                {entry.exampleSentences.map((example, index) => (
                  <View key={index} style={styles.exampleCard}>
                    <Text style={styles.exampleGerman}>{example.german}</Text>
                    {example.vietnamese && (
                      <Text style={styles.exampleTranslation}>
                        🇻🇳 {example.vietnamese}
                      </Text>
                    )}
                    {example.english && (
                      <Text style={styles.exampleTranslation}>
                        🇺🇸 {example.english}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            <TouchableOpacity
              onPress={handleSaveToVocabulary}
              style={[styles.saveButton, saved && styles.saveButtonSaved]}
              disabled={saving || saved}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Icon
                    name={saved ? 'check' : 'bookmark-border'}
                    size={20}
                    color="#fff"
                  />
                  <Text style={styles.saveButtonText}>
                    {saved ? 'Saved to Vocabulary' : 'Add to Vocabulary'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#2196F3',
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  wordSection: {
    marginBottom: 16,
  },
  word: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  phonetic: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  partOfSpeech: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  audioText: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  definition: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
  translationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  flag: {
    fontSize: 24,
    marginRight: 12,
  },
  translation: {
    fontSize: 16,
    color: '#555',
    flex: 1,
  },
  exampleCard: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  exampleGerman: {
    fontSize: 15,
    color: '#1a1a1a',
    marginBottom: 8,
    fontWeight: '500',
  },
  exampleTranslation: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  saveButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 32,
  },
  saveButtonSaved: {
    backgroundColor: '#4CAF50',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
