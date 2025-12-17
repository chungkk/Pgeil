declare module 'react-native-secure-storage' {
  export const ACCESSIBLE: {
    WHEN_UNLOCKED: string;
    AFTER_FIRST_UNLOCK: string;
    ALWAYS: string;
    WHEN_PASSCODE_SET_THIS_DEVICE_ONLY: string;
    WHEN_UNLOCKED_THIS_DEVICE_ONLY: string;
    AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY: string;
    ALWAYS_THIS_DEVICE_ONLY: string;
  };

  export interface Options {
    accessible?: string;
  }

  const RNSecureStorage: {
    setItem(key: string, value: string, options?: Options): Promise<void>;
    getItem(key: string): Promise<string | null>;
    removeItem(key: string): Promise<void>;
    getAllKeys(): Promise<string[]>;
  };

  export default RNSecureStorage;
}
