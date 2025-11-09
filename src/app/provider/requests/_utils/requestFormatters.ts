'use client';

import { RequestView } from '@/lib/request/client/view/types';

const statusMap: Record<RequestView['status'], string> = {
  open: 'Открыта',
  closed: 'Закрыта клиентом',
  cancelled: 'Отменена системой',
};

export function getRequestStatusText(status: RequestView['status']): string {
  return statusMap[status] ?? status;
}

export function formatBudget(value: string | number | null | undefined): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'number') {
    return new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (Number.isFinite(Number(trimmed))) {
    return new Intl.NumberFormat('ru-RU').format(Number(trimmed)) + ' ₽';
  }

  return trimmed.includes('₽') ? trimmed : `${trimmed} ₽`;
}


