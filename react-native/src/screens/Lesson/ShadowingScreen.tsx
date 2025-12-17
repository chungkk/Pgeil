/**
 * ShadowingScreen - Audio playback and pronunciation recording
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { AudioPlayer } from '@/components/organisms/AudioPlayer';
import { RecordingButton } from '@/components/organisms/RecordingButton';
import { getLessonDetail, getStreamUrls, scorePronunciation, updateProgress } from '@/services/api/lessons';
import { TranscriptSegment } from '@/types/models';

export const ShadowingScreen: React.FC<any> = ({ route, navigation }) => {
  const { lessonId, segmentId } = route.params;
  const { theme } = useTheme();

  const [segment, setSegment] = useState<TranscriptSegment | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [recording, setRecording] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    fetchSegmentData();
  }, [lessonId, segmentId]);

  const fetchSegmentData = async () => {
    try {
      setLoading(true);
      const data = await getLessonDetail(lessonId);
      const foundSegment = data.transcript.segments.find((s: TranscriptSegment) => s.id === segmentId);
      setSegment(foundSegment || null);

      const urls = await getStreamUrls(lessonId);
      setAudioUrl(urls.audioUrl);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordingComplete = async (text: string) => {
    try {
      setAttempts(attempts + 1);

      // Score pronunciation
      const result = await scorePronunciation(lessonId, segmentId, text);
      setScore(result.similarityScore);
      setFeedback(result.feedbackNotes || '');

      // Update progress
      await updateProgress(lessonId, {
        shadowingAttempts: attempts + 1,
        shadowingScore: result.similarityScore,
      });

      // Show result
      if (result.isPassed) {
        Alert.alert(
          '✅ Great Job!',
          `Pronunciation score: ${result.similarityScore}%\n\nYou passed!`,
          [{ text: 'Next Segment', onPress: handleNextSegment }]
        );
      } else {
        Alert.alert(
          '🔄 Try Again',
          `Pronunciation score: ${result.similarityScore}%\n\nKeep practicing!`,
          [{ text: 'OK' }]
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleRecordingError = (error: string) => {
    Alert.alert('Recording Error', error);
  };

  const handleNextSegment = () => {
    // TODO: Navigate to next segment
    navigation.goBack();
  };

  const handleReplay = () => {
    // Replay audio segment
    setScore(null);
    setFeedback('');
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>Loading...</Text>
      </View>
    );
  }

  if (!segment) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.error }}>Segment not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Instructions */}
        <Card style={styles.instructionsCard}>
          <Text style={[styles.instructionsTitle, { color: theme.colors.text }, theme.textStyles.h3]}>
            Shadowing Practice
          </Text>
          <Text style={[styles.instructions, { color: theme.colors.textSecondary }]}>
            1. Listen to the audio{'\n'}
            2. Repeat what you hear{'\n'}
            3. Record your pronunciation{'\n'}
            4. Get instant feedback
          </Text>
        </Card>

        {/* Original Text */}
        <Card style={styles.textCard}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
            German Text
          </Text>
          <Text style={[styles.text, { color: theme.colors.text }, theme.textStyles.h4]}>
            {segment.textGerman}
          </Text>
        </Card>

        {/* Translation */}
        <Card style={styles.textCard}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
            Translation
          </Text>
          <Text style={[styles.translation, { color: theme.colors.text }]}>
            {segment.textVietnamese}
          </Text>
        </Card>

        {/* Audio Player */}
        {audioUrl && (
          <AudioPlayer
            audioUrl={audioUrl}
            onProgress={() => {}}
            onEnd={() => {}}
          />
        )}

        {/* Recording Button */}
        <RecordingButton
          onRecordingComplete={handleRecordingComplete}
          onError={handleRecordingError}
        />

        {/* Score Display */}
        {score !== null && (
          <Card
            style={[
              styles.scoreCard,
              { backgroundColor: score > 80 ? `${theme.colors.success}20` : `${theme.colors.warning}20` },
            ]}
          >
            <Text style={[styles.scoreLabel, { color: theme.colors.text }]}>
              Your Score
            </Text>
            <Text
              style={[
                styles.scoreValue,
                { color: score > 80 ? theme.colors.success : theme.colors.warning },
                theme.textStyles.h1,
              ]}
            >
              {score}%
            </Text>
            <Text style={[styles.scoreStatus, { color: theme.colors.text }]}>
              {score > 80 ? '✅ Passed!' : '🔄 Keep practicing'}
            </Text>
            {feedback && (
              <Text style={[styles.feedback, { color: theme.colors.textSecondary }]}>
                {feedback}
              </Text>
            )}
          </Card>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Replay Audio"
            onPress={handleReplay}
            variant="outline"
            fullWidth
          />
          {score !== null && score > 80 && (
            <Button
              title="Next Segment"
              onPress={handleNextSegment}
              fullWidth
            />
          )}
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <Text style={[styles.statsText, { color: theme.colors.textSecondary }]}>
            Attempts: {attempts}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  instructionsCard: {
    marginBottom: 16,
  },
  instructionsTitle: {
    marginBottom: 12,
  },
  instructions: {
    lineHeight: 24,
  },
  textCard: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  text: {
    marginBottom: 8,
  },
  translation: {
    fontSize: 14,
  },
  scoreCard: {
    marginVertical: 24,
    alignItems: 'center',
    padding: 24,
  },
  scoreLabel: {
    marginBottom: 8,
  },
  scoreValue: {
    marginBottom: 8,
  },
  scoreStatus: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  feedback: {
    marginTop: 8,
    textAlign: 'center',
  },
  actions: {
    gap: 12,
    marginBottom: 16,
  },
  stats: {
    alignItems: 'center',
  },
  statsText: {
    fontSize: 14,
  },
});
