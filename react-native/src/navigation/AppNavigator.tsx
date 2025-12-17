/**
 * App Navigator
 * Root navigation structure with conditional auth rendering
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { RootStackParamList } from '@/types/navigation';
import { useAuth } from '@/context/AuthContext';
import { AuthStack } from './AuthStack';

const Stack = createStackNavigator<RootStackParamList>();

// Loading screen while checking auth status
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#4A90E2" />
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
);

// Placeholder for Main tabs (Phase 4)
const MainPlaceholder = () => (
  <View style={styles.container}>
    <Text style={styles.text}>✅ Authentication Complete!</Text>
    <Text style={styles.subtext}>Phase 3: Auth working</Text>
    <Text style={styles.subtext}>Phase 4: Will implement Main tabs & Lesson screens</Text>
  </View>
);

const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : (
        <Stack.Screen name="Main" component={MainPlaceholder} />
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7F8C8D',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 24,
  },
  text: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 16,
    color: '#7F8C8D',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default AppNavigator;
