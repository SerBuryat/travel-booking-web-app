"use client";

import React from "react";
import { RequestView } from "@/lib/request/client/view/types";

type Props = {
  items: RequestView[];
};

export default function MyRequestsList({ items }: Props) {
  const getProposalsText = (count: number): string => {
    if (count === 0) return "Ожидает ответа";
    return `Получено ${count} ${count === 1 ? 'предложение' : count < 5 ? 'предложения' : 'предложений'}`;
  };

  return (
    <div className="flex flex-col gap-2 divide-y divide-gray-200 bg-white rounded-md">
      {items.map((r, idx) => {
        return (
          <button
            key={`${r.number}-${idx}`}
            type="button"
            className="w-full flex gap-2 items-center border-b border-gray-200 bg-white"
            onClick={() => window.location.href = `/requests/${r.id}`}
          >
            <div className="flex-1 px-4 py-3 text-left">
              <div style={{ fontSize: '17px', fontWeight: 700, color: '#000000' }}>
                Заявка №{r.number}
              </div>
              <div style={{ fontSize: '17px', fontWeight: 400, color: '#000000' }}>
                {r.categoryName || '—'}
              </div>
              <div style={{ fontSize: '15px', fontWeight: 400, color: '#707579' }}>
                создано: {r.createdAt}
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#007AFF' }}>
                {getProposalsText(r.proposalsCount)}
              </div>
            </div>
            <div className="px-4 text-gray-400">&gt;</div>
          </button>
        );
      })}
    </div>
  );
}


