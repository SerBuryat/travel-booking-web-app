import { useCallback } from 'react';
import { MetricaErrorTracker } from '@/lib/metrica';

/**
 * Хук для удобного использования отслеживания ошибок в компонентах
 */
export function useErrorTracking() {
  const captureError = useCallback((error: Error, context?: Record<string, any>) => {
    if (MetricaErrorTracker.shouldLog()) {
      MetricaErrorTracker.captureError(error, context);
    }
  }, []);

  const trackCustomError = useCallback((message: string, details?: Record<string, any>) => {
    if (MetricaErrorTracker.shouldLog()) {
      MetricaErrorTracker.trackCustomError(message, details);
    }
  }, []);

  const trackEvent = useCallback((eventName: string, params?: Record<string, any>) => {
    if (MetricaErrorTracker.shouldLog()) {
      MetricaErrorTracker.trackEvent(eventName, params);
    }
  }, []);

  return {
    captureError,
    trackCustomError,
    trackEvent,
  };
}

