/**
 * SettingsScreen - App settings (language, theme, playback speed)
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { Card } from '@/components/atoms/Card';
import { asyncStorage, StorageKeys } from '@/services/storage/asyncStorage';

export const SettingsScreen: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { theme, isDark, toggleTheme, themeMode, setThemeMode } = useTheme();
  const { language, setLanguage } = useLanguage();

  const [playbackSpeed, setPlaybackSpeedState] = useState(user?.playbackSpeed || 1);

  const languages = [
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
  ];

  const playbackSpeeds = [0.5, 0.75, 1, 1.25, 1.5];

  const themeModes = [
    { mode: 'light', name: 'Light' },
    { mode: 'dark', name: 'Dark' },
    { mode: 'auto', name: 'Auto (System)' },
  ];

  const handleLanguageChange = async (lang: 'de' | 'vi' | 'en') => {
    await setLanguage(lang);
    updateUser({ preferredLanguage: lang });
  };

  const handlePlaybackSpeedChange = async (speed: number) => {
    setPlaybackSpeedState(speed);
    updateUser({ playbackSpeed: speed as any });
    await asyncStorage.setItem(StorageKeys.PLAYBACK_SPEED, speed);
  };

  const handleThemeModeChange = async (mode: 'light' | 'dark' | 'auto') => {
    await setThemeMode(mode);
    updateUser({ theme: mode === 'dark' ? 'dark' : 'light' });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Language Settings */}
      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }, theme.textStyles.h3]}>
          Language
        </Text>
        <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
          Choose your app language
        </Text>

        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.optionRow,
              { borderBottomColor: theme.colors.divider },
              language === lang.code && { backgroundColor: theme.colors.surface },
            ]}
            onPress={() => handleLanguageChange(lang.code as any)}
          >
            <Text style={[styles.optionText, { color: theme.colors.text }]}>
              {lang.name}
            </Text>
            {language === lang.code && (
              <Text style={[styles.checkmark, { color: theme.colors.primary }]}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </Card>

      {/* Theme Settings */}
      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }, theme.textStyles.h3]}>
          Theme
        </Text>
        <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
          Choose your preferred theme
        </Text>

        {themeModes.map((tm) => (
          <TouchableOpacity
            key={tm.mode}
            style={[
              styles.optionRow,
              { borderBottomColor: theme.colors.divider },
              themeMode === tm.mode && { backgroundColor: theme.colors.surface },
            ]}
            onPress={() => handleThemeModeChange(tm.mode as any)}
          >
            <Text style={[styles.optionText, { color: theme.colors.text }]}>
              {tm.name}
            </Text>
            {themeMode === tm.mode && (
              <Text style={[styles.checkmark, { color: theme.colors.primary }]}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </Card>

      {/* Playback Speed Settings */}
      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }, theme.textStyles.h3]}>
          Playback Speed
        </Text>
        <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
          Adjust video playback speed
        </Text>

        <View style={styles.speedContainer}>
          {playbackSpeeds.map((speed) => (
            <TouchableOpacity
              key={speed}
              style={[
                styles.speedButton,
                { borderColor: theme.colors.border },
                playbackSpeed === speed && {
                  backgroundColor: theme.colors.primary,
                  borderColor: theme.colors.primary,
                },
              ]}
              onPress={() => handlePlaybackSpeedChange(speed)}
            >
              <Text
                style={[
                  styles.speedText,
                  { color: theme.colors.text },
                  playbackSpeed === speed && { color: '#FFFFFF' },
                ]}
              >
                {speed}x
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {/* App Info */}
      <Card style={styles.section}>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
            App Version
          </Text>
          <Text style={[styles.infoValue, { color: theme.colors.text }]}>
            1.0.0
          </Text>
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 16,
  },
  checkmark: {
    fontSize: 20,
    fontWeight: '600',
  },
  speedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  speedButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  speedText: {
    fontSize: 16,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
});
