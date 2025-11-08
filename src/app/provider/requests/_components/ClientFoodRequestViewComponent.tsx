'use client';

import { FoodRequestView } from '@/lib/request/client/view/types';
import { RequestDetailItem, RequestDetailsSection } from './RequestDetailsSection';
import { formatBudget, getRequestStatusText } from '../_utils/requestFormatters';

interface ClientFoodRequestViewComponentProps {
  data: FoodRequestView;
}

export function ClientFoodRequestViewComponent({ data }: ClientFoodRequestViewComponentProps) {
  const fields: RequestDetailItem[] = [
    { label: 'Время предоставления услуг', value: data.provisionTime },
    { label: 'Регион', value: data.areaName },
    { label: 'Категория', value: data.categoryName },
    { label: 'Количество взрослых', value: data.adultsQty },
    { label: 'Количество детей', value: data.kidsQty },
    { label: 'Бюджет', value: formatBudget(data.budget) },
    { label: 'Комментарий клиента', value: data.comment, multiline: true },
  ];

  return <RequestDetailsSection items={fields} />;
}
