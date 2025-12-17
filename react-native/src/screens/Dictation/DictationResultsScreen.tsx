/**
 * DictationResultsScreen - Show dictation results with feedback
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { FeedbackCard } from '@/components/molecules/FeedbackCard';

export const DictationResultsScreen: React.FC<any> = ({ route, navigation }) => {
  const {
    lessonId,
    accuracy,
    attempts,
    correctAnswer,
    userAnswer,
    feedback,
    improvement = 0
  } = route.params;

  const { theme } = useTheme();

  const handleTryAgain = () => {
    navigation.goBack();
  };

  const handleNextExercise = () => {
    navigation.goBack();
  };

  const handleFinish = () => {
    navigation.navigate('LessonDetail', { lessonId });
  };

  const getDifferences = () => {
    const correct = correctAnswer.split('');
    const user = userAnswer.split('');
    const maxLength = Math.max(correct.length, user.length);

    const diff = [];
    for (let i = 0; i < maxLength; i++) {
      if (correct[i] === user[i]) {
        diff.push({ char: correct[i] || '', correct: true });
      } else {
        diff.push({
          char: user[i] || '',
          expected: correct[i] || '',
          correct: false
        });
      }
    }
    return diff;
  };

  const differences = getDifferences();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Feedback Card */}
        <FeedbackCard
          accuracy={accuracy}
          attempts={attempts}
          improvement={improvement}
          feedback={feedback}
        />

        {/* Comparison */}
        <Card style={styles.comparisonCard}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Answer Comparison
          </Text>

          {/* Your Answer */}
          <View style={styles.answerSection}>
            <Text style={[styles.answerLabel, { color: theme.colors.textSecondary }]}>
              Your Answer
            </Text>
            <View style={styles.answerText}>
              {differences.map((item, index) => (
                <Text
                  key={index}
                  style={[
                    styles.char,
                    {
                      color: item.correct ? theme.colors.success : theme.colors.error,
                      textDecorationLine: item.correct ? 'none' : 'underline',
                    }
                  ]}
                >
                  {item.char}
                </Text>
              ))}
            </View>
          </View>

          {/* Correct Answer */}
          <View style={styles.answerSection}>
            <Text style={[styles.answerLabel, { color: theme.colors.textSecondary }]}>
              Correct Answer
            </Text>
            <Text style={[styles.correctText, { color: theme.colors.text }]}>
              {correctAnswer}
            </Text>
          </View>
        </Card>

        {/* Grammar Tips (if available) */}
        {feedback && (
          <Card style={styles.tipsCard}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              💡 Tips
            </Text>
            <Text style={[styles.tipsText, { color: theme.colors.textSecondary }]}>
              {feedback}
            </Text>
          </Card>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          {accuracy < 90 && (
            <Button
              title="Try Again"
              onPress={handleTryAgain}
              variant="outline"
              fullWidth
            />
          )}
          {accuracy >= 90 && (
            <Button
              title="Next Exercise"
              onPress={handleNextExercise}
              fullWidth
            />
          )}
          <Button
            title="Back to Lesson"
            onPress={handleFinish}
            variant="text"
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
  comparisonCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  answerSection: {
    marginBottom: 16,
  },
  answerLabel: {
    fontSize: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  answerText: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  char: {
    fontSize: 16,
    fontWeight: '500',
  },
  correctText: {
    fontSize: 16,
    lineHeight: 24,
  },
  tipsCard: {
    marginBottom: 16,
  },
  tipsText: {
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    gap: 12,
  },
});
