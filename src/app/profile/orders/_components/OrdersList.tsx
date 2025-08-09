'use client';

import React from 'react';
import OrderListItem from './OrderListItem';

interface OrderItem {
  id: number;
  serviceId: number;
  name: string;
  respondedAt: Date;
}

export default function OrdersList({ orders }: { orders: OrderItem[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
      {orders.map((order, index) => (
        <OrderListItem
          key={order.id}
          serviceId={order.serviceId}
          name={order.name}
          respondedAt={order.respondedAt}
          itemIndex={index}
        />
      ))}
    </div>
  );
}


