/**
 * RecordingButton - Organism component for voice recording
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import * as Recorder from '@/services/audio/recorder';

interface RecordingButtonProps {
  onRecordingComplete?: (text: string) => void;
  onError?: (error: string) => void;
}

export const RecordingButton: React.FC<RecordingButtonProps> = ({
  onRecordingComplete,
  onError,
}) => {
  const { theme } = useTheme();
  const [recording, setRecording] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    Recorder.initRecorder({
      onStart: () => {
        setRecording(true);
        startPulseAnimation();
      },
      onEnd: () => {
        setRecording(false);
        stopPulseAnimation();
      },
      onResult: (result) => {
        onRecordingComplete?.(result.text);
      },
      onError: (error) => {
        setRecording(false);
        stopPulseAnimation();
        onError?.(error);
      },
    });

    return () => {
      Recorder.destroyRecorder();
    };
  }, []);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulseAnimation = () => {
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  };

  const handlePress = async () => {
    if (recording) {
      await Recorder.stopRecording();
    } else {
      await Recorder.startRecording('de-DE');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress} style={styles.buttonContainer}>
        <Animated.View
          style={[
            styles.button,
            {
              backgroundColor: recording ? theme.colors.error : theme.colors.primary,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <Text style={styles.icon}>{recording ? '⏹' : '🎤'}</Text>
        </Animated.View>
      </TouchableOpacity>

      <Text style={[styles.hint, { color: theme.colors.textSecondary }]}>
        {recording ? 'Tap to stop' : 'Tap to record'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 24,
  },
  buttonContainer: {
    marginBottom: 12,
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  icon: {
    fontSize: 40,
  },
  hint: {
    fontSize: 14,
  },
});
