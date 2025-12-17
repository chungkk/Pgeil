import React, { Suspense, ComponentType } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

/**
 * Lazy load wrapper for React Native screens
 * Implements code splitting for large screens to optimize bundle size
 */

interface LazyLoadOptions {
  fallback?: React.ReactNode;
  errorBoundary?: boolean;
}

const DefaultFallback = () => (
  <View style={styles.fallbackContainer}>
    <ActivityIndicator size="large" color="#007AFF" />
  </View>
);

/**
 * Lazy load a component with Suspense wrapper
 * Usage: const HomeScreen = lazyLoad(() => import('../screens/Home/HomeScreen'))
 */
export function lazyLoad<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: LazyLoadOptions = {}
): React.FC<React.ComponentPropsWithoutRef<T>> {
  const LazyComponent = React.lazy(importFunc);

  return (props) => (
    <Suspense fallback={options.fallback || <DefaultFallback />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

/**
 * Preload a lazy-loaded component
 * Usage: preloadComponent(() => import('../screens/Home/HomeScreen'))
 */
export function preloadComponent(
  importFunc: () => Promise<{ default: any }>
): void {
  importFunc().catch((error) => {
    console.error('Failed to preload component:', error);
  });
}

const styles = StyleSheet.create({
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
