import { useEffect, useRef } from 'react';
import { EmitterSubscription, NativeEventEmitter } from 'react-native';

/**
 * Hook to safely manage event subscriptions and prevent memory leaks
 * Automatically unsubscribes when component unmounts
 */
export function useEventSubscription(
  emitter: NativeEventEmitter,
  eventName: string,
  handler: (...args: any[]) => void
): void {
  const subscriptionRef = useRef<EmitterSubscription | null>(null);
  const handlerRef = useRef(handler);

  // Update handler ref without resubscribing
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    // Subscribe to event
    subscriptionRef.current = emitter.addListener(eventName, (...args) => {
      handlerRef.current(...args);
    });

    // Cleanup on unmount
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
        subscriptionRef.current = null;
      }
    };
  }, [emitter, eventName]);
}

/**
 * Hook to manage multiple event subscriptions
 */
export function useEventSubscriptions(
  subscriptions: Array<{
    emitter: NativeEventEmitter;
    eventName: string;
    handler: (...args: any[]) => void;
  }>
): void {
  const subscriptionsRef = useRef<EmitterSubscription[]>([]);

  useEffect(() => {
    // Subscribe to all events
    subscriptionsRef.current = subscriptions.map(({ emitter, eventName, handler }) =>
      emitter.addListener(eventName, handler)
    );

    // Cleanup all subscriptions on unmount
    return () => {
      subscriptionsRef.current.forEach((sub) => sub.remove());
      subscriptionsRef.current = [];
    };
  }, [subscriptions]);
}
