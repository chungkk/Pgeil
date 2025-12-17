/**
 * Root App Component
 * Wraps app with context providers
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { setupAudioPlayer } from '@/services/audio/setup';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import AppNavigator from '@/navigation/AppNavigator';
import '@/services/i18n'; // Initialize i18n

const App: React.FC = () => {
  useEffect(() => {
    // Initialize audio player on app launch
    setupAudioPlayer().catch((error) => {
      console.error('Failed to setup audio player:', error);
    });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </GestureHandlerRootView>
  );
};

export default App;
