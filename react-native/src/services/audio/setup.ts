import TrackPlayer, { Capability } from 'react-native-track-player';

export async function setupAudioPlayer(): Promise<void> {
  try {
    await TrackPlayer.setupPlayer({
      autoHandleInterruptions: true,
    });

    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.Stop,
        Capability.SeekTo,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SetRating,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SeekTo,
      ],
      progressUpdateEventInterval: 1, // Update progress every 1 second
    });
  } catch (error) {
    console.error('Error setting up TrackPlayer:', error);
  }
}

// Playback service for background audio
export async function PlaybackService() {
  TrackPlayer.addEventListener('remote-play', () => TrackPlayer.play());
  TrackPlayer.addEventListener('remote-pause', () => TrackPlayer.pause());
  TrackPlayer.addEventListener('remote-stop', () => TrackPlayer.stop());
  TrackPlayer.addEventListener('remote-seek', (event) => TrackPlayer.seekTo(event.position));
  TrackPlayer.addEventListener('remote-next', () => TrackPlayer.skipToNext());
  TrackPlayer.addEventListener('remote-previous', () => TrackPlayer.skipToPrevious());
}
