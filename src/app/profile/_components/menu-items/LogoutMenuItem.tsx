'use client';

import React from 'react';
import {useAuth} from '@/contexts/AuthContext';
import BaseMenuItem from './BaseMenuItem';

export default function LogoutMenuItem() {
  const { logout } = useAuth();

  const icon = (
      <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M8.00004 10.0002L10.5 7.50016M10.5 7.50016L8.00004 5.00016M10.5 7.50016H1.33337M5.50004 3.541V3.50016C5.50004 2.56683 5.50004 2.10016 5.68171 1.7435C5.84171 1.42933 6.09587 1.17516 6.41004 1.01516C6.76671 0.833496 7.23337 0.833496 8.16671 0.833496H12C12.9334 0.833496 13.4 0.833496 13.7559 1.01516C14.07 1.17516 14.325 1.42933 14.485 1.7435C14.6667 2.09933 14.6667 2.566 14.6667 3.49766V11.5035C14.6667 12.4352 14.6667 12.901 14.485 13.2568C14.325 13.5705 14.0698 13.8255 13.7559 13.9852C13.4 14.1668 12.9342 14.1668 12.0025 14.1668H8.16421C7.23254 14.1668 6.76587 14.1668 6.41004 13.9852C6.09645 13.8254 5.84149 13.5704 5.68171 13.2568C5.50004 12.9002 5.50004 12.4335 5.50004 11.5002V11.4585"
            stroke="#FE3B30" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>

  );

  return (
      <BaseMenuItem
          title="Выйти из профиля"
          icon={icon}
          onClick={logout}
          variant="danger"
      />
  );
}
