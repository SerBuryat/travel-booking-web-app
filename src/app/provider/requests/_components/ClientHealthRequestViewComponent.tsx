'use client';

import { HealthRequestView } from '@/lib/request/client/view/types';
import { RequestDetailItem, RequestDetailsSection } from './RequestDetailsSection';
import { formatBudget, getRequestStatusText } from '../_utils/requestFormatters';

interface ClientHealthRequestViewComponentProps {
  data: HealthRequestView;
}

export function ClientHealthRequestViewComponent({ data }: ClientHealthRequestViewComponentProps) {
  const fields: RequestDetailItem[] = [
    { label: 'Время предоставления услуг', value: data.provisionTime },
    { label: 'Регион', value: data.areaName },
    { label: 'Категория', value: data.categoryName },
    { label: 'Количество взрослых', value: data.adultsQty },
    { label: 'Бюджет', value: formatBudget(data.budget) },
    { label: 'Комментарий клиента', value: data.comment, multiline: true },
  ];

  return <RequestDetailsSection items={fields} />;
}
