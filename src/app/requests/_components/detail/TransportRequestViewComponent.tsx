"use client";

import React from "react";
import { TransportRequestView } from "@/lib/request/client/view/types";

type Props = {
  data: TransportRequestView;
};

export default function TransportRequestViewComponent({ data }: Props) {
  const truncateComment = (comment: string | null, maxLength: number = 50) => {
    if (!comment) return null;
    return comment.length > maxLength ? `${comment.slice(0, maxLength)}...` : comment;
  };

  return (
    <>
      <div className="rounded-md bg-gray-100 p-3 flex flex-col items-center">
        <svg className="w-6 h-6 mb-1 text-black" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
        </svg>
        <div className="text-sm font-bold text-black text-center">{data.categoryName || '—'}</div>
      </div>
      
      <div className="rounded-md bg-gray-100 p-3 flex flex-col items-center">
        <svg className="w-6 h-6 mb-1 text-black" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
        <div className="text-sm font-bold text-black text-center">{data.areaName}</div>
      </div>
      
      {data.provisionTime && (
        <div className="rounded-md bg-gray-100 p-3 flex flex-col items-center">
          <svg className="w-6 h-6 mb-1 text-black" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <div className="text-sm font-bold text-black text-center">{data.provisionTime}</div>
        </div>
      )}
      
      {data.adultsQty && (
        <div className="rounded-md bg-gray-100 p-3 flex flex-col items-center">
          <svg className="w-6 h-6 mb-1 text-black" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
          </svg>
          <div className="text-sm font-bold text-black text-center">{data.adultsQty} взрослых</div>
        </div>
      )}
      
      <div className="rounded-md bg-gray-100 p-3 flex flex-col items-center">
        <svg className="w-6 h-6 mb-1 text-black" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941a1 1 0 102 0v-1.941a4.535 4.535 0 001.676-.662C13.398 9.765 14 8.99 14 8c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 5.092V5z" clipRule="evenodd" />
        </svg>
        <div className="text-sm font-bold text-black text-center">{data.budget}</div>
      </div>
      
      {data.comment && (
        <div className="rounded-md bg-gray-100 p-3 flex flex-col items-center">
          <svg className="w-6 h-6 mb-1 text-black" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm font-bold text-black text-center">{truncateComment(data.comment)}</div>
        </div>
      )}
    </>
  );
}
