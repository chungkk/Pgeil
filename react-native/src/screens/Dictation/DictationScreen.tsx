/**
 * DictationScreen - Dictation practice with audio playback
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { DictationInput } from '@/components/organisms/DictationInput';
import { AudioPlayer } from '@/components/organisms/AudioPlayer';
import { submitDictationAnswer, calculateAccuracy } from '@/services/api/lessons';
import { DictationExercise } from '@/types/models';

type DictationMode = 'fill-in-blank' | 'full-sentence';

export const DictationScreen: React.FC<any> = ({ route, navigation }) => {
  const { lessonId, exercises, audioUrl } = route.params;
  const { theme } = useTheme();

  const [mode, setMode] = useState<DictationMode>('full-sentence');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [attempts, setAttempts] = useState<number[]>([]);

  const currentExercise: DictationExercise = exercises[currentIndex];

  const handleSubmit = async (answer: string) => {
    try {
      const result = await submitDictationAnswer(
        lessonId,
        currentExercise.id,
        answer
      );

      const accuracy = calculateAccuracy(answer, currentExercise.correctAnswer);
      setAttempts([...attempts, accuracy]);

      // Navigate to results
      navigation.navigate('DictationResults', {
        lessonId,
        accuracy,
        attempts: attempts.length + 1,
        correctAnswer: currentExercise.correctAnswer,
        userAnswer: answer,
        feedback: result.feedback
      });

    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer('');
      setShowHints(false);
    } else {
      navigation.goBack();
    }
  };

  const handleReplay = () => {
    // Replay audio segment
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Mode Selector */}
        <View style={styles.modeSelector}>
          <Button
            title="Full Sentence"
            onPress={() => setMode('full-sentence')}
            variant={mode === 'full-sentence' ? 'primary' : 'outline'}
            style={styles.modeButton}
          />
          <Button
            title="Fill in Blank"
            onPress={() => setMode('fill-in-blank')}
            variant={mode === 'fill-in-blank' ? 'primary' : 'outline'}
            style={styles.modeButton}
          />
        </View>

        {/* Progress */}
        <Text style={[styles.progress, { color: theme.colors.textSecondary }]}>
          Question {currentIndex + 1} of {exercises.length}
        </Text>

        {/* Instructions */}
        <Card style={styles.instructionsCard}>
          <Text style={[styles.instructions, { color: theme.colors.text }]}>
            Listen to the audio and type what you hear in German
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

        {/* Hints */}
        {currentExercise.hints && currentExercise.hints.length > 0 && (
          <View style={styles.hintsSection}>
            <Button
              title={showHints ? 'Hide Hints' : 'Show Hints'}
              onPress={() => setShowHints(!showHints)}
              variant="text"
              size="small"
            />
            {showHints && (
              <Card style={styles.hintsCard}>
                {currentExercise.hints.map((hint, index) => (
                  <Text
                    key={index}
                    style={[styles.hint, { color: theme.colors.textSecondary }]}
                  >
                    • {hint}
                  </Text>
                ))}
              </Card>
            )}
          </View>
        )}

        {/* Input */}
        <DictationInput
          correctAnswer={currentExercise.correctAnswer}
          onSubmit={handleSubmit}
          showRealTimeFeedback={true}
        />

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Replay Audio"
            onPress={handleReplay}
            variant="outline"
            fullWidth
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  modeSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  modeButton: {
    flex: 1,
  },
  progress: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 14,
  },
  instructionsCard: {
    marginBottom: 16,
  },
  instructions: {
    fontSize: 14,
    textAlign: 'center',
  },
  hintsSection: {
    marginVertical: 16,
  },
  hintsCard: {
    marginTop: 8,
  },
  hint: {
    fontSize: 14,
    marginBottom: 4,
  },
  actions: {
    marginTop: 16,
  },
});
