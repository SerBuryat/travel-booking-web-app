'use client';

import { ReactNode } from 'react';

export interface RequestDetailItem {
  label: string;
  value: ReactNode;
  multiline?: boolean;
}

const labelClass = 'text-[15px] font-normal text-[#707579]';
const valueClass = 'text-[17px] font-normal text-[#000000]';

export function RequestDetailsSection({ items }: { items: RequestDetailItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className="space-y-1">
          <div className={labelClass}>{item.label}</div>
          <div className={`${valueClass} ${item.multiline ? 'whitespace-pre-line' : ''}`}>
            {formatValue(item.value)}
          </div>
        </div>
      ))}
    </div>
  );
}

function formatValue(value: ReactNode) {
  if (value === null || value === undefined) {
    return '—';
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? value : '—';
  }

  return value;
}


