/**
 * Audio Recorder Service
 * Wrapper for @react-native-voice/voice for speech recognition and recording
 */

import Voice, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-voice/voice';

export interface RecordingResult {
  text: string;
  confidence?: number;
  audioData?: string; // Base64 encoded audio
}

export interface RecorderCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onResult?: (result: RecordingResult) => void;
  onError?: (error: string) => void;
  onPartialResult?: (text: string) => void;
}

let callbacks: RecorderCallbacks = {};

/**
 * Initialize voice recognition with callbacks
 */
export const initRecorder = (cbs: RecorderCallbacks): void => {
  callbacks = cbs;

  Voice.onSpeechStart = () => {
    callbacks.onStart?.();
  };

  Voice.onSpeechEnd = () => {
    callbacks.onEnd?.();
  };

  Voice.onSpeechResults = (e: SpeechResultsEvent) => {
    if (e.value && e.value.length > 0) {
      const result: RecordingResult = {
        text: e.value[0],
        confidence: 1.0,
      };
      callbacks.onResult?.(result);
    }
  };

  Voice.onSpeechPartialResults = (e: SpeechResultsEvent) => {
    if (e.value && e.value.length > 0) {
      callbacks.onPartialResult?.(e.value[0]);
    }
  };

  Voice.onSpeechError = (e: SpeechErrorEvent) => {
    callbacks.onError?.(e.error?.message || 'Speech recognition error');
  };
};

/**
 * Start recording
 */
export const startRecording = async (language: string = 'de-DE'): Promise<void> => {
  try {
    await Voice.start(language);
  } catch (error: any) {
    console.error('Start recording error:', error);
    callbacks.onError?.(error.message || 'Failed to start recording');
    throw error;
  }
};

/**
 * Stop recording
 */
export const stopRecording = async (): Promise<void> => {
  try {
    await Voice.stop();
  } catch (error: any) {
    console.error('Stop recording error:', error);
    callbacks.onError?.(error.message || 'Failed to stop recording');
    throw error;
  }
};

/**
 * Cancel recording
 */
export const cancelRecording = async (): Promise<void> => {
  try {
    await Voice.cancel();
  } catch (error: any) {
    console.error('Cancel recording error:', error);
    throw error;
  }
};

/**
 * Destroy recorder
 */
export const destroyRecorder = async (): Promise<void> => {
  try {
    await Voice.destroy();
    Voice.removeAllListeners();
  } catch (error: any) {
    console.error('Destroy recorder error:', error);
  }
};

/**
 * Check if recording is available
 */
export const isRecordingAvailable = async (): Promise<boolean> => {
  try {
    const available = await Voice.isAvailable();
    return available === 1;
  } catch (error) {
    console.error('Check recording availability error:', error);
    return false;
  }
};

/**
 * Check if currently recording
 */
export const isRecording = async (): Promise<boolean> => {
  try {
    return await Voice.isRecognizing();
  } catch (error) {
    return false;
  }
};

/**
 * Get supported languages
 */
export const getSupportedLanguages = async (): Promise<string[]> => {
  try {
    const languages = await Voice.getSupportedLanguages();
    return languages || [];
  } catch (error) {
    console.error('Get supported languages error:', error);
    return [];
  }
};

// For future file-based recording (if needed for pronunciation scoring)
export interface AudioRecording {
  uri: string;
  duration: number;
  size: number;
}

/**
 * Record audio to file (stub for future implementation)
 * Will use react-native-audio-recorder-player or similar
 */
export const recordToFile = async (duration: number): Promise<AudioRecording> => {
  // TODO: Implement file-based recording for pronunciation scoring
  // This will be needed if backend requires audio file upload instead of just text
  throw new Error('File-based recording not yet implemented');
};

export default {
  initRecorder,
  startRecording,
  stopRecording,
  cancelRecording,
  destroyRecorder,
  isRecordingAvailable,
  isRecording,
  getSupportedLanguages,
  recordToFile,
};
