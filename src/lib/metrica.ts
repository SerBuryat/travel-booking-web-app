/**
 * Класс для отслеживания ошибок через Yandex Metrica
 * Отправляет ошибки как цели (goals) в Яндекс Метрику
 */ import {event} from "next/dist/build/output/log";

// Расширяем Window интерфейс для TypeScript
declare global {
  interface Window {
    ym?: (counterId: number, method: string, target: string, params?: Record<string, any>) => void;
  }
}

export class MetricaErrorTracker {
  private static metricaId: number = parseInt(process.env.NEXT_PUBLIC_YANDEX_METRICA_ID || '0');

  /**
   * Инициализация глобальных обработчиков ошибок
   */
  static init() {
    if (typeof window === 'undefined' || !this.metricaId) return;

    // Глобальный обработчик ошибок JavaScript
    window.addEventListener('error', (event) => {
      this.trackError({
        type: 'UNHANDLED_ERROR',
        message: event.message,
        file: event.filename,
        line: event.lineno,
        column: event.colno,
        stack: event.error?.stack,
      });
    });

    // Обработчик необработанных Promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError({
        message: "",
        type: 'UNHANDLED_PROMISE_REJECTION',
        reason: event.reason?.toString(),
        stack: event.reason?.stack
      });
    });
  }

  /**
   * Отправка ошибки в Яндекс Метрику как цель
   */
  static trackError(errorData: {
    type: string;
    message: string;
    file?: string;
    line?: number;
    column?: number;
    stack?: string;
    reason?: string;
    eventType?: string;
    [key: string]: any;
  }) {
    if (typeof window === 'undefined' || !window.ym || !this.metricaId) return;

    try {
      // Отправляем ошибку как цель в Яндекс Метрику
      window.ym(this.metricaId, 'reachGoal', 'CLIENT_ERROR', {
        error_type: errorData.type,
        error_message: errorData.message.substring(0, 500), // ограничиваем длину
        error_location: errorData.file ? `${errorData.file}:${errorData.line}` : 'unknown',
        error_stack: errorData.stack ? errorData.stack.substring(0, 1000) : undefined,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        timestamp: new Date().toISOString(),
        ...errorData,
      });

      // Логируем в консоль для отладки
      console.error('📊 Yandex Metrica - Tracked Error:', errorData);
    } catch (e) {
      console.error('Failed to track error in Metrica:', e);
    }
  }

  /**
   * Метод для ручного отслеживания ошибок
   */
  static captureError(error: Error, context: Record<string, any> = {}) {
    this.trackError({
      type: 'MANUAL_ERROR',
      message: error.message,
      stack: error.stack,
      ...context,
    });
  }

  /**
   * Метод для отслеживания пользовательских ошибок
   */
  static trackCustomError(message: string, details: Record<string, any> = {}) {
    this.trackError({
      type: 'CUSTOM_ERROR',
      message,
      ...details,
    });
  }

  /**
   * Метод для отслеживания пользовательских событий
   */
  static trackEvent(eventName: string, params: Record<string, any> = {}) {
    if (typeof window === 'undefined' || !window.ym || !this.metricaId) return;

    try {
      window.ym(this.metricaId, 'reachGoal', eventName, params);
      console.log('📊 Yandex Metrica - Tracked Event:', eventName, params);
    } catch (e) {
      console.error('Failed to track event in Metrica:', e);
    }
  }

  /**
   * Проверка, нужно ли отправлять логи для текущего окружения
   */
  static shouldLog(): boolean {
    const nodeEnv = process.env.NODE_ENV;
    const logsFor = process.env.NEXT_PUBLIC_YANDEX_METRICA_LOGS_FOR;

    if (!nodeEnv || !logsFor) {
      return false;
    }

    const allowedEnvs = logsFor.split(',').map((env) => env.trim().toLowerCase());
    return allowedEnvs.includes(nodeEnv.toLowerCase());
  }
}

