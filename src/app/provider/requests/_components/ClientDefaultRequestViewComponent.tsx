'use client';

import { AnyRequestView } from '@/lib/request/client/view/types';
import { RequestDetailItem, RequestDetailsSection } from './RequestDetailsSection';
import { formatBudget, getRequestStatusText } from '../_utils/requestFormatters';

interface ClientDefaultRequestViewComponentProps {
  data: AnyRequestView;
}

export function ClientDefaultRequestViewComponent({ data }: ClientDefaultRequestViewComponentProps) {
  const fields: RequestDetailItem[] = [
    { label: 'Регион', value: data.areaName },
    { label: 'Категория', value: data.categoryName },
    { label: 'Бюджет', value: formatBudget(data.budget) },
    { label: 'Комментарий клиента', value: data.comment, multiline: true },
  ];

  return <RequestDetailsSection items={fields} />;
}
