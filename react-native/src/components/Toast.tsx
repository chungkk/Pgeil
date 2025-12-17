/**
 * Toast - Global toast notification system
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  visible: boolean;
  message: string;
  type: ToastType;
  onDismiss: () => void;
}

// Global toast queue
let toastQueue: ToastMessage[] = [];
let showToastCallback: ((toast: ToastMessage) => void) | null = null;

export function showToast(
  message: string,
  type: ToastType = 'info',
  duration: number = 3000
) {
  const toast: ToastMessage = {
    id: `${Date.now()}-${Math.random()}`,
    message,
    type,
    duration,
  };

  if (showToastCallback) {
    showToastCallback(toast);
  } else {
    toastQueue.push(toast);
  }
}

function ToastItem({ visible, message, type, onDismiss }: ToastProps) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const getIconAndColor = () => {
    switch (type) {
      case 'success':
        return { icon: 'check-circle', color: '#4CAF50' };
      case 'error':
        return { icon: 'error', color: '#f44336' };
      case 'warning':
        return { icon: 'warning', color: '#FF9800' };
      case 'info':
      default:
        return { icon: 'info', color: '#2196F3' };
    }
  };

  const { icon, color } = getIconAndColor();

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          transform: [{ translateY }],
          opacity,
          borderLeftColor: color,
        },
      ]}
    >
      <Icon name={icon} size={24} color={color} />
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
        <Icon name="close" size={20} color="#666" />
      </TouchableOpacity>
    </Animated.View>
  );
}

export function ToastContainer() {
  const [currentToast, setCurrentToast] = useState<ToastMessage | null>(null);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Register callback
    showToastCallback = (toast: ToastMessage) => {
      // Clear existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // Show new toast
      setCurrentToast(toast);
      setVisible(true);

      // Auto-dismiss
      timerRef.current = setTimeout(() => {
        dismissToast();
      }, toast.duration || 3000);
    };

    // Show queued toasts
    if (toastQueue.length > 0) {
      const toast = toastQueue.shift()!;
      showToastCallback(toast);
    }

    return () => {
      showToastCallback = null;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const dismissToast = () => {
    setVisible(false);
    setTimeout(() => {
      setCurrentToast(null);

      // Show next toast in queue
      if (toastQueue.length > 0 && showToastCallback) {
        const nextToast = toastQueue.shift()!;
        showToastCallback(nextToast);
      }
    }, 300);
  };

  if (!currentToast) return null;

  return (
    <ToastItem
      visible={visible}
      message={currentToast.message}
      type={currentToast.type}
      onDismiss={dismissToast}
    />
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    borderLeftWidth: 4,
    zIndex: 9999,
  },
  message: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#1a1a1a',
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
});
