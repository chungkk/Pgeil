/**
 * ForgotPasswordScreen - Password reset request
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { requestPasswordReset } from '@/services/api/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@/types/navigation';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

interface Props {
  navigation: ForgotPasswordScreenNavigationProp;
}

export const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (): boolean => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }

    setError('');
    return true;
  };

  const handleResetRequest = async () => {
    if (!validateEmail()) return;

    try {
      setLoading(true);
      await requestPasswordReset(email.trim());
      setSubmitted(true);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.successContainer}>
          <Text style={[styles.successIcon, { color: theme.colors.success }]}>✓</Text>
          <Text style={[styles.successTitle, { color: theme.colors.text }, theme.textStyles.h2]}>
            Check Your Email
          </Text>
          <Text style={[styles.successText, { color: theme.colors.textSecondary }, theme.textStyles.body]}>
            If an account exists with {email}, you will receive a password reset link shortly.
          </Text>
          <Button
            title="Back to Login"
            onPress={() => navigation.navigate('Login')}
            fullWidth
            style={styles.backButton}
          />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }, theme.textStyles.h1]}>
            {t('forgotPassword')}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }, theme.textStyles.body]}>
            Enter your email and we'll send you a link to reset your password
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label={t('email')}
            placeholder="your@email.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError('');
            }}
            error={error}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Button
            title="Send Reset Link"
            onPress={handleResetRequest}
            loading={loading}
            disabled={loading}
            fullWidth
            style={styles.submitButton}
          />

          <Button
            title="Back to Login"
            variant="text"
            onPress={() => navigation.navigate('Login')}
            style={styles.backToLoginButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  form: {
    marginBottom: 24,
  },
  submitButton: {
    marginTop: 8,
  },
  backToLoginButton: {
    marginTop: 16,
    alignSelf: 'center',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  successTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  successText: {
    textAlign: 'center',
    marginBottom: 32,
  },
  backButton: {
    marginTop: 16,
  },
});
