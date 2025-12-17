import React, { useState } from 'react';
import {
  Image,
  ImageProps,
  ActivityIndicator,
  View,
  StyleSheet,
} from 'react-native';

interface OptimizedImageProps extends ImageProps {
  fallback?: React.ReactNode;
  showLoader?: boolean;
  priority?: 'low' | 'normal' | 'high';
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  fallback,
  showLoader = true,
  priority = 'normal',
  style,
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoadStart = () => {
    setLoading(true);
    setError(false);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  if (error && fallback) {
    return <View style={style}>{fallback}</View>;
  }

  return (
    <View style={[styles.container, style]}>
      <Image
        {...props}
        style={[StyleSheet.absoluteFill, style]}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        resizeMode={props.resizeMode || 'cover'}
        // Performance optimizations
        fadeDuration={priority === 'high' ? 0 : 300}
        progressiveRenderingEnabled={true}
        // Cache the image
        cache="force-cache"
      />
      {loading && showLoader && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color="#666" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
});
