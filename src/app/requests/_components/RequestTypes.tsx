"use client";

import React from 'react';
import Link from 'next/link';
import {RequestType} from "@/lib/request/requestType";

export interface RequestTypeButton {
  id: RequestType;
  name: string;
  href: string;
}

export const REQUEST_TYPE_BUTTONS: RequestTypeButton[] = [
  {
    id: RequestType.ACCOMMODATION,
    name: 'Проживание',
    href: '/requests/create/accomodation'
  },
  {
    id: RequestType.TRANSPORT,
    name: 'Транспорт',
    href: '/requests/create/transport'
  },
  {
    id: RequestType.ENTERTAINMENT,
    name: 'Туры/активности',
    href: '/requests/create/entertainment'
  }
];

interface RequestTypeButtonProps {
  type: RequestTypeButton;
}

const CreateRequestTypeButton: React.FC<RequestTypeButtonProps> = ({ type }) => (
  <Link href={type.href}>
    <button
      className="py-2 px-2 text-black font-medium transition-colors"
      style={{ 
        backgroundColor: '#F5F5F5',
        fontSize: '13px',
        fontWeight: 500,
        borderRadius: "12px"
      }}
    >
      {type.name}
    </button>
  </Link>
);

interface RequestTypesListProps {
  types?: RequestTypeButton[];
}

export const RequestTypesList: React.FC<RequestTypesListProps> = ({ 
  types = REQUEST_TYPE_BUTTONS
}) => {
  return (
    <div className="flex flex-wrap gap-3">
      {types.map((type) => (
        <CreateRequestTypeButton key={type.id} type={type} />
      ))}
    </div>
  );
};
