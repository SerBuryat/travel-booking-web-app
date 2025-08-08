'use client';

import React from 'react';
import OrdersMenuItem from './menu-items/OrdersMenuItem';
import InviteMenuItem from './menu-items/InviteMenuItem';
import ReviewsMenuItem from './menu-items/ReviewsMenuItem';
import SupportMenuItem from './menu-items/SupportMenuItem';
import FaqMenuItem from './menu-items/FaqMenuItem';
import BusinessMenuItem from './menu-items/BusinessMenuItem';
import LogoutMenuItem from './menu-items/LogoutMenuItem';

export default function ProfileMenu() {
  return (
    <div className="space-y-4">
      <OrdersMenuItem />
      <InviteMenuItem />
      <ReviewsMenuItem />
      <SupportMenuItem />
      <FaqMenuItem />
      <BusinessMenuItem />
      <LogoutMenuItem />
    </div>
  );
}
