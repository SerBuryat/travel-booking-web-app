import { FilterOption } from '../_hooks/useClientRequestsList';

export const FILTER_OPTIONS: { key: FilterOption; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: 'new', label: 'Новые' },
  { key: 'awaiting', label: 'Ждут отклика' },
  { key: 'responded', label: 'Откликались' },
  { key: 'archived', label: 'Архив' },
];

