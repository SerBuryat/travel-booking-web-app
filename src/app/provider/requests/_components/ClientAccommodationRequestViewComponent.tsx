'use client';

import { AccomodationRequestView } from '@/lib/request/client/view/types';
import { RequestDetailItem, RequestDetailsSection } from './RequestDetailsSection';
import { formatBudget, getRequestStatusText } from '../_utils/requestFormatters';

interface ClientAccommodationRequestViewComponentProps {
  data: AccomodationRequestView;
}

export function ClientAccommodationRequestViewComponent({
  data,
}: ClientAccommodationRequestViewComponentProps) {
  const fields: RequestDetailItem[] = [
    { label: 'Дата заезда', value: data.dateFrom },
    { label: 'Дата выезда', value: data.dateTo },
    { label: 'Регион', value: data.areaName },
    { label: 'Категория', value: data.categoryName },
    { label: 'Количество взрослых', value: data.adultsQty },
    { label: 'Количество детей', value: data.kidsQty },
    { label: 'Бюджет', value: formatBudget(data.budget) },
    { label: 'Комментарий клиента', value: data.comment, multiline: true },
  ];

  return <RequestDetailsSection items={fields} />;
}
