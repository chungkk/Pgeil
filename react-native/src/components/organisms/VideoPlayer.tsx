/**
 * VideoPlayer - Organism component for video playback with controls
 */

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Video, { VideoRef } from 'react-native-video';
import { useTheme } from '@/context/ThemeContext';
import Slider from '@react-native-community/slider';

interface VideoPlayerProps {
  videoUrl: string;
  onProgress?: (currentTime: number) => void;
  onEnd?: () => void;
  initialPosition?: number;
  playbackSpeed?: number;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  onProgress,
  onEnd,
  initialPosition = 0,
  playbackSpeed = 1,
}) => {
  const { theme } = useTheme();
  const videoRef = useRef<VideoRef>(null);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [speed, setSpeed] = useState(playbackSpeed);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    if (initialPosition > 0 && videoRef.current) {
      videoRef.current.seek(initialPosition);
    }
  }, [initialPosition]);

  const handleProgress = (data: any) => {
    setCurrentTime(data.currentTime);
    onProgress?.(data.currentTime);
  };

  const handleLoad = (data: any) => {
    setDuration(data.duration);
    setLoading(false);
  };

  const handleEnd = () => {
    setPlaying(false);
    onEnd?.();
  };

  const togglePlay = () => {
    setPlaying(!playing);
  };

  const handleSeek = (value: number) => {
    videoRef.current?.seek(value);
    setCurrentTime(value);
  };

  const handleSpeedChange = () => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5];
    const currentIndex = speeds.indexOf(speed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setSpeed(nextSpeed);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Video */}
      <TouchableOpacity
        style={styles.videoContainer}
        onPress={() => setShowControls(!showControls)}
        activeOpacity={1}
      >
        <Video
          ref={videoRef}
          source={{ uri: videoUrl }}
          style={styles.video}
          paused={!playing}
          onProgress={handleProgress}
          onLoad={handleLoad}
          onEnd={handleEnd}
          rate={speed}
          resizeMode="contain"
        />

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        )}

        {/* Play/Pause overlay */}
        {showControls && !loading && (
          <TouchableOpacity style={styles.playOverlay} onPress={togglePlay}>
            <View
              style={[styles.playButton, { backgroundColor: 'rgba(0, 0, 0, 0.6)' }]}
            >
              <Text style={styles.playIcon}>{playing ? '⏸' : '▶'}</Text>
            </View>
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {/* Controls */}
      {showControls && !loading && (
        <View style={[styles.controls, { backgroundColor: theme.colors.surface }]}>
          {/* Progress slider */}
          <View style={styles.progressRow}>
            <Text style={[styles.timeText, { color: theme.colors.textSecondary }]}>
              {formatTime(currentTime)}
            </Text>

            <Slider
              style={styles.slider}
              value={currentTime}
              minimumValue={0}
              maximumValue={duration}
              onValueChange={handleSeek}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor={theme.colors.border}
              thumbTintColor={theme.colors.primary}
            />

            <Text style={[styles.timeText, { color: theme.colors.textSecondary }]}>
              {formatTime(duration)}
            </Text>
          </View>

          {/* Bottom controls */}
          <View style={styles.bottomControls}>
            <TouchableOpacity onPress={togglePlay} style={styles.controlButton}>
              <Text style={[styles.controlIcon, { color: theme.colors.text }]}>
                {playing ? '⏸' : '▶'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSpeedChange} style={styles.speedButton}>
              <Text style={[styles.speedText, { color: theme.colors.text }]}>
                {speed}x
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#000',
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 32,
    color: '#FFF',
  },
  controls: {
    padding: 12,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 12,
    width: 40,
    textAlign: 'center',
  },
  slider: {
    flex: 1,
    marginHorizontal: 8,
  },
  bottomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlButton: {
    padding: 8,
  },
  controlIcon: {
    fontSize: 24,
  },
  speedButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
  },
  speedText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
