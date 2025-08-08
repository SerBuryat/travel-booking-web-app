'use client';

import React, { useMemo } from 'react';
import OrderListItem from './OrderListItem';

type OrderItem = {
  serviceId: number;
  name: string;
  respondedAt: Date;
};

export default function OrdersList() {
  const orders: OrderItem[] = useMemo(
    () => [
      {
        serviceId: 14,
        name: 'Сервис №14',
        respondedAt: new Date('2025-02-10'),
      },
      {
        serviceId: 18,
        name: 'Сервис №18',
        respondedAt: new Date('2024-07-05'),
      },
    ],
    []
  );

  return (
    <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
      {orders.map((order, index) => (
        <OrderListItem
          key={order.serviceId}
          serviceId={order.serviceId}
          name={order.name}
          respondedAt={order.respondedAt}
          itemIndex={index}
        />
      ))}
    </div>
  );
}


