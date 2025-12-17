/**
 * AudioPlayer - Organism component for audio playback
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { ProgressBar } from '@/components/molecules/ProgressBar';
import * as AudioPlayerService from '@/services/audio/player';

interface AudioPlayerProps {
  audioUrl: string;
  onProgress?: (currentTime: number) => void;
  onEnd?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  onProgress,
  onEnd,
}) => {
  const { theme } = useTheme();
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    setupAudio();
    return () => {
      AudioPlayerService.reset();
    };
  }, [audioUrl]);

  const setupAudio = async () => {
    await AudioPlayerService.reset();
    await AudioPlayerService.addTrack({
      id: 'audio',
      url: audioUrl,
      title: 'Audio',
    });
    const dur = await AudioPlayerService.getDuration();
    setDuration(dur);
  };

  const togglePlay = async () => {
    if (playing) {
      await AudioPlayerService.pause();
    } else {
      await AudioPlayerService.play();
    }
    setPlaying(!playing);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <TouchableOpacity onPress={togglePlay} style={styles.playButton}>
        <Text style={[styles.playIcon, { color: theme.colors.primary }]}>
          {playing ? '⏸' : '▶'}
        </Text>
      </TouchableOpacity>

      <View style={styles.info}>
        <ProgressBar progress={(progress / duration) * 100} height={4} showLabel={false} />
        <View style={styles.timeRow}>
          <Text style={[styles.time, { color: theme.colors.textSecondary }]}>
            {formatTime(progress)}
          </Text>
          <Text style={[styles.time, { color: theme.colors.textSecondary }]}>
            {formatTime(duration)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  playButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  playIcon: {
    fontSize: 32,
  },
  info: {
    flex: 1,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  time: {
    fontSize: 12,
  },
});
