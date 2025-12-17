/**
 * Analytics Service
 * Centralized analytics tracking for key user actions
 * 
 * Note: This is a stub implementation. For production, integrate with:
 * - Firebase Analytics: @react-native-firebase/analytics
 * - Amplitude: @amplitude/analytics-react-native
 * - Mixpanel: mixpanel-react-native
 */

export type AnalyticsEvent = 
  // Authentication events
  | 'user_login'
  | 'user_register'
  | 'user_logout'
  
  // Lesson events
  | 'lesson_started'
  | 'lesson_completed'
  | 'lesson_downloaded'
  | 'lesson_deleted'
  
  // Practice events
  | 'shadowing_started'
  | 'shadowing_submitted'
  | 'dictation_started'
  | 'dictation_submitted'
  
  // Dictionary events
  | 'word_lookup'
  | 'word_saved_to_vocabulary'
  | 'word_marked_learned'
  | 'vocabulary_list_viewed'
  
  // Progress events
  | 'progress_viewed'
  | 'achievement_unlocked'
  | 'leaderboard_viewed'
  
  // Offline events
  | 'app_used_offline'
  | 'sync_completed'
  | 'sync_failed';

export interface AnalyticsProperties {
  [key: string]: string | number | boolean | null | undefined;
}

class AnalyticsService {
  private enabled: boolean = true;
  private userId: string | null = null;

  /**
   * Initialize analytics service
   */
  async initialize(): Promise<void> {
    if (__DEV__) {
      console.log('[Analytics] Service initialized (DEV mode - events logged only)');
    }
    // TODO: Initialize Firebase Analytics, Amplitude, etc.
  }

  /**
   * Set user ID for analytics
   */
  setUserId(userId: string | null): void {
    this.userId = userId;
    if (__DEV__) {
      console.log('[Analytics] User ID set:', userId);
    }
    // TODO: Set user ID in analytics service
  }

  /**
   * Set user properties
   */
  setUserProperties(properties: AnalyticsProperties): void {
    if (!this.enabled) return;
    
    if (__DEV__) {
      console.log('[Analytics] User properties:', properties);
    }
    // TODO: Set user properties in analytics service
  }

  /**
   * Track an event
   */
  trackEvent(event: AnalyticsEvent, properties?: AnalyticsProperties): void {
    if (!this.enabled) return;

    const eventData = {
      event,
      userId: this.userId,
      timestamp: new Date().toISOString(),
      ...properties,
    };

    if (__DEV__) {
      console.log('[Analytics] Event tracked:', eventData);
    }

    // TODO: Send event to analytics service
    // Example for Firebase:
    // await analytics().logEvent(event, properties);
    
    // Example for Amplitude:
    // amplitude.track(event, properties);
  }

  /**
   * Track screen view
   */
  trackScreenView(screenName: string, properties?: AnalyticsProperties): void {
    this.trackEvent('screen_view' as AnalyticsEvent, {
      screen_name: screenName,
      ...properties,
    });
  }

  /**
   * Track error
   */
  trackError(error: Error, context?: AnalyticsProperties): void {
    if (!this.enabled) return;

    if (__DEV__) {
      console.error('[Analytics] Error tracked:', error.message, context);
    }

    // TODO: Send error to analytics/crash reporting service
    // Example for Firebase Crashlytics:
    // crashlytics().recordError(error);
  }

  /**
   * Enable/disable analytics
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (__DEV__) {
      console.log('[Analytics] Analytics', enabled ? 'enabled' : 'disabled');
    }
  }

  /**
   * Reset analytics (on logout)
   */
  reset(): void {
    this.userId = null;
    if (__DEV__) {
      console.log('[Analytics] Analytics reset');
    }
    // TODO: Reset analytics service
  }
}

export const analytics = new AnalyticsService();
