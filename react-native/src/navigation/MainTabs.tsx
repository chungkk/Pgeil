/**
 * MainTabs - Bottom tab navigation for main app
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabsParamList } from '@/types/navigation';
import { HomeScreen } from '@/screens/Home/HomeScreen';
import { ProfileScreen } from '@/screens/Profile/ProfileScreen';
import { Text } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

const Tab = createBottomTabNavigator<MainTabsParamList>();

// Placeholder for Leaderboard (Phase 8 - US4)
const LeaderboardPlaceholder = () => {
  const { theme } = useTheme();
  return (
    <Text style={{ flex: 1, textAlign: 'center', marginTop: 100, color: theme.colors.text }}>
      Leaderboard coming in Phase 8!
    </Text>
  );
};

export const MainTabs: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
        },
        headerStyle: {
          backgroundColor: theme.colors.card,
        },
        headerTintColor: theme.colors.text,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Lessons',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📚</Text>,
        }}
      />
      <Tab.Screen
        name="Leaderboard"
        component={LeaderboardPlaceholder}
        options={{
          title: 'Leaderboard',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🏆</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
};
