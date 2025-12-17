/**
 * Audio Player Service
 * Wrapper for react-native-track-player with convenience methods
 */

import TrackPlayer, { State, Track, Event, RepeatMode } from 'react-native-track-player';

export interface AudioTrack {
  id: string;
  url: string;
  title: string;
  artist?: string;
  duration?: number;
}

/**
 * Add track to queue
 */
export const addTrack = async (track: AudioTrack): Promise<void> => {
  const trackItem: Track = {
    id: track.id,
    url: track.url,
    title: track.title,
    artist: track.artist || 'Papa Geil',
    duration: track.duration,
  };

  await TrackPlayer.add(trackItem);
};

/**
 * Play audio
 */
export const play = async (): Promise<void> => {
  await TrackPlayer.play();
};

/**
 * Pause audio
 */
export const pause = async (): Promise<void> => {
  await TrackPlayer.pause();
};

/**
 * Stop audio
 */
export const stop = async (): Promise<void> => {
  await TrackPlayer.stop();
};

/**
 * Seek to position (in seconds)
 */
export const seekTo = async (position: number): Promise<void> => {
  await TrackPlayer.seekTo(position);
};

/**
 * Get current position (in seconds)
 */
export const getPosition = async (): Promise<number> => {
  return await TrackPlayer.getPosition();
};

/**
 * Get current playback state
 */
export const getState = async (): Promise<State> => {
  return await TrackPlayer.getState();
};

/**
 * Check if playing
 */
export const isPlaying = async (): Promise<boolean> => {
  const state = await TrackPlayer.getState();
  return state === State.Playing;
};

/**
 * Set playback speed (0.5x - 1.5x)
 */
export const setSpeed = async (speed: number): Promise<void> => {
  await TrackPlayer.setRate(speed);
};

/**
 * Get current track
 */
export const getCurrentTrack = async (): Promise<Track | null> => {
  const trackId = await TrackPlayer.getCurrentTrack();
  if (trackId === null) return null;
  
  const track = await TrackPlayer.getTrack(trackId);
  return track;
};

/**
 * Reset player (clear queue)
 */
export const reset = async (): Promise<void> => {
  await TrackPlayer.reset();
};

/**
 * Skip to next track
 */
export const skipToNext = async (): Promise<void> => {
  await TrackPlayer.skipToNext();
};

/**
 * Skip to previous track
 */
export const skipToPrevious = async (): Promise<void> => {
  await TrackPlayer.skipToPrevious();
};

/**
 * Set repeat mode
 */
export const setRepeatMode = async (mode: RepeatMode): Promise<void> => {
  await TrackPlayer.setRepeatMode(mode);
};

/**
 * Get duration of current track
 */
export const getDuration = async (): Promise<number> => {
  return await TrackPlayer.getDuration();
};

/**
 * Add event listener
 */
export const addEventListener = (
  event: Event,
  listener: (data: any) => void
): any => {
  return TrackPlayer.addEventListener(event, listener);
};

/**
 * Play specific segment (for shadowing practice)
 */
export const playSegment = async (
  url: string,
  startTime: number,
  endTime: number,
  segmentId: string
): Promise<void> => {
  await reset();
  
  const track: Track = {
    id: segmentId,
    url,
    title: 'Shadowing Segment',
  };
  
  await TrackPlayer.add(track);
  await TrackPlayer.seekTo(startTime);
  await TrackPlayer.play();
  
  // Auto-pause at end time
  const checkPosition = setInterval(async () => {
    const position = await TrackPlayer.getPosition();
    if (position >= endTime) {
      await TrackPlayer.pause();
      clearInterval(checkPosition);
    }
  }, 100);
};

export default {
  addTrack,
  play,
  pause,
  stop,
  seekTo,
  getPosition,
  getState,
  isPlaying,
  setSpeed,
  getCurrentTrack,
  reset,
  skipToNext,
  skipToPrevious,
  setRepeatMode,
  getDuration,
  addEventListener,
  playSegment,
};
