/**
 * LessonDetailScreen - Video player with synchronized transcript
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/atoms/Button';
import { VideoPlayer } from '@/components/organisms/VideoPlayer';
import { TranscriptView } from '@/components/organisms/TranscriptView';
import DictionaryModal from '@/components/organisms/DictionaryModal';
import { ProgressBar } from '@/components/molecules/ProgressBar';
import { getLessonDetail, getStreamUrls, updateProgress } from '@/services/api/lessons';
import { Lesson, Transcript, Progress } from '@/types/models';

export const LessonDetailScreen: React.FC<any> = ({ route, navigation }) => {
  const { lessonId } = route.params;
  const { theme } = useTheme();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectedWordContext, setSelectedWordContext] = useState<string | null>(null);

  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const lastSavedTime = useRef(0);

  useEffect(() => {
    fetchLessonData();
    startProgressTracking();

    return () => {
      stopProgressTracking();
    };
  }, [lessonId]);

  const fetchLessonData = async () => {
    try {
      setLoading(true);
      const data = await getLessonDetail(lessonId);
      setLesson(data as any);
      setTranscript(data.transcript);
      setProgress(data.userProgress || null);

      const urls = await getStreamUrls(lessonId);
      setVideoUrl(urls.videoUrl);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const startProgressTracking = () => {
    // Auto-save progress every 30 seconds
    progressInterval.current = setInterval(() => {
      saveProgress();
    }, 30000);
  };

  const stopProgressTracking = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      saveProgress(); // Save one last time
    }
  };

  const saveProgress = async () => {
    if (!lesson || currentTime === lastSavedTime.current) return;

    try {
      const newProgress = await updateProgress(lessonId, {
        lastWatchedPosition: currentTime,
        timeSpent: (progress?.timeSpent || 0) + 30,
        completionPercentage: Math.min(100, ((currentTime / lesson.duration) * 100)),
      });
      setProgress(newProgress);
      lastSavedTime.current = currentTime;
    } catch (error) {
      console.error('Save progress error:', error);
    }
  };

  const handleProgress = (time: number) => {
    setCurrentTime(time);
  };

  const handleWordTap = (word: string) => {
    // Find the segment containing this word for context
    const currentSegment = transcript?.segments.find(
      (seg) => currentTime >= seg.startTime && currentTime <= seg.endTime
    );
    
    // Clean up the word (remove punctuation)
    const cleanWord = word.replace(/[.,!?;:'"]/g, '');
    
    setSelectedWord(cleanWord);
    setSelectedWordContext(currentSegment?.textGerman || null);
  };

  const handleSegmentTap = (startTime: number) => {
    setCurrentTime(startTime);
  };

  const handleStartShadowing = () => {
    navigation.navigate('Shadowing', { lessonId, segmentId: transcript?.segments[0]?.id });
  };

  const handleStartDictation = () => {
    // TODO: Navigate to dictation (Phase 5 - US2)
    Alert.alert('Coming Soon', 'Dictation feature will be available in Phase 5!');
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>Loading...</Text>
      </View>
    );
  }

  if (!lesson || !transcript) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.error }}>Failed to load lesson</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView>
        {/* Video Player */}
        {videoUrl && (
          <VideoPlayer
            videoUrl={videoUrl}
            onProgress={handleProgress}
            initialPosition={progress?.lastWatchedPosition || 0}
            playbackSpeed={1}
          />
        )}

        {/* Lesson Info */}
        <View style={styles.info}>
          <Text style={[styles.title, { color: theme.colors.text }, theme.textStyles.h2]}>
            {lesson.title}
          </Text>

          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
            {lesson.description}
          </Text>

          {/* Progress */}
          {progress && (
            <View style={styles.progressSection}>
              <Text style={[styles.progressLabel, { color: theme.colors.text }]}>
                Your Progress
              </Text>
              <ProgressBar progress={progress.completionPercentage} />
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actions}>
            <Button
              title="Start Shadowing"
              onPress={handleStartShadowing}
              fullWidth
              style={styles.actionButton}
            />
            <Button
              title="Start Dictation"
              onPress={handleStartDictation}
              variant="outline"
              fullWidth
              style={styles.actionButton}
            />
          </View>
        </View>

        {/* Transcript */}
        <View style={styles.transcriptSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }, theme.textStyles.h3]}>
            Transcript
          </Text>
          <TranscriptView
            segments={transcript.segments}
            currentTime={currentTime}
            onWordTap={handleWordTap}
            onSegmentTap={handleSegmentTap}
          />
        </View>
      </ScrollView>

      <DictionaryModal
        visible={!!selectedWord}
        word={selectedWord || ''}
        lessonId={lessonId}
        context={selectedWordContext || undefined}
        onClose={() => {
          setSelectedWord(null);
          setSelectedWordContext(null);
        }}
        onSaved={() => {
          // Optional: Show success feedback
        }}
      />
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
  info: {
    padding: 16,
  },
  title: {
    marginBottom: 8,
  },
  description: {
    marginBottom: 16,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressLabel: {
    marginBottom: 8,
    fontWeight: '600',
  },
  actions: {
    gap: 12,
  },
  actionButton: {
    marginBottom: 8,
  },
  transcriptSection: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
});
