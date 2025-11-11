'use client';

import { PackageRequestView } from '@/lib/request/client/view/types';
import { RequestDetailItem, RequestDetailsSection } from './RequestDetailsSection';
import { formatBudget, getRequestStatusText } from '../_utils/requestFormatters';

interface ClientPackageRequestViewComponentProps {
  data: PackageRequestView;
}

export function ClientPackageRequestViewComponent({ data }: ClientPackageRequestViewComponentProps) {
  const fields: RequestDetailItem[] = [
    { label: 'Дата начала поездки', value: data.startDate },
    { label: 'Время предоставления услуг', value: data.provisionTime },
    { label: 'Регион', value: data.areaName },
    { label: 'Категория', value: data.categoryName },
    { label: 'Количество взрослых', value: data.adultsQty },
    { label: 'Количество детей', value: data.kidsQty },
    { label: 'Минимальное число ночей', value: data.nightsFrom },
    { label: 'Максимальное число ночей', value: data.nightsTo },
    { label: 'Бюджет', value: formatBudget(data.budget) },
    { label: 'Комментарий клиента', value: data.comment, multiline: true },
  ];

  return <RequestDetailsSection items={fields} />;
}
