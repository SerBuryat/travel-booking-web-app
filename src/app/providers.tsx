'use client';

import React from 'react';
import { MetricaProvider } from '@/components/MetricaProvider';

/**
 * Провайдер для аналитики (Yandex Metrica)
 * Заменяет PostHogProvider после миграции на Yandex Metrica
 */
export function MetricaProviderWrapper({ children }: { children: React.ReactNode }) {
  return <MetricaProvider>{children}</MetricaProvider>;
}

