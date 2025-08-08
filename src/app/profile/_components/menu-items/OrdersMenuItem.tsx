'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import BaseMenuItem from './BaseMenuItem';

export default function OrdersMenuItem() {
  const router = useRouter();

  const icon = (
      <svg width="16" height="19" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask id="mask0_165_40577" maskUnits="userSpaceOnUse" x="0" y="0" width="16"
              height="19">
          <path
              d="M13.8334 1.1665H2.16671C1.94569 1.1665 1.73373 1.2543 1.57745 1.41058C1.42117 1.56686 1.33337 1.77882 1.33337 1.99984V16.9998C1.33337 17.2208 1.42117 17.4328 1.57745 17.5891C1.73373 17.7454 1.94569 17.8332 2.16671 17.8332H13.8334C14.0544 17.8332 14.2663 17.7454 14.4226 17.5891C14.5789 17.4328 14.6667 17.2208 14.6667 16.9998V1.99984C14.6667 1.77882 14.5789 1.56686 14.4226 1.41058C14.2663 1.2543 14.0544 1.1665 13.8334 1.1665Z"
              fill="white" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5.08337 11.9998H10.9167M5.08337 14.4998H8.00004M10.5 4.9165L7.16671 8.24984L5.50004 6.58317"
                stroke="black" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
        </mask>
        <g mask="url(#mask0_165_40577)">
          <path d="M-2 -0.5H18V19.5H-2V-0.5Z" fill="black"/>
        </g>
      </svg>

  );

  return (
      <BaseMenuItem
          title="Мои заказы"
          icon={icon}
          onClick={() => router.push('/profile')}
      />
  );
}
