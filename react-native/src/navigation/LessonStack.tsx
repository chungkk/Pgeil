/**
 * LessonStack - Stack navigator for lesson-related screens
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LessonStackParamList } from '@/types/navigation';
import { LessonDetailScreen } from '@/screens/Lesson/LessonDetailScreen';
import { ShadowingScreen } from '@/screens/Lesson/ShadowingScreen';
import { useTheme } from '@/context/ThemeContext';

const Stack = createStackNavigator<LessonStackParamList>();

export const LessonStack: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.card,
        },
        headerTintColor: theme.colors.text,
      }}
    >
      <Stack.Screen
        name="LessonDetail"
        component={LessonDetailScreen}
        options={{ title: 'Lesson' }}
      />
      <Stack.Screen
        name="Shadowing"
        component={ShadowingScreen}
        options={{ title: 'Shadowing Practice' }}
      />
    </Stack.Navigator>
  );
};
