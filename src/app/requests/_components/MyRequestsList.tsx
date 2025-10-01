"use client";

import React from "react";
import { MyRequestView } from "@/lib/view/types";

type Props = {
  items: MyRequestView[];
};

export default function MyRequestsList({ items }: Props) {
  const statusToColor: Record<MyRequestView["status"], string> = {
    open: "bg-green-500",
    client_closed: "bg-orange-500",
    client_cancelled: "bg-gray-400",
    system_cancelled: "bg-gray-400",
  };

  return (
    <div className="flex flex-col gap-2 divide-y divide-gray-200 bg-white rounded-md">
      {items.map((r, idx) => {
        const colorClass = statusToColor[r.status] ?? "bg-gray-300";
        return (
          <button
            key={`${r.number}-${idx}`}
            type="button"
            className="w-full flex gap-2 items-center border-b border-gray-200 bg-white"
            onClick={() => alert("Детальное отображение скоро...")}
          >
            <div className={`h-auto w-1 self-stretch ${colorClass}`} />
            <div className="flex-1 px-4 py-3 text-left">
              <div className="font-semibold text-gray-900">Заявка №{r.number}</div>
              <div className="text-gray-700">{r.categoryName || '—'}</div>
              <div className="text text-gray-700">{r.areaName}</div>
              <div className="text-xs text-gray-500"> создано: {r.createdAt}</div>
            </div>
            <div className="px-4 text-gray-400">&gt;</div>
          </button>
        );
      })}
    </div>
  );
}


