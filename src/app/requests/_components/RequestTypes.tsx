"use client";

import React from 'react';
import Link from 'next/link';

export interface RequestType {
  id: string;
  name: string;
  href: string;
}

export const REQUEST_TYPES: RequestType[] = [
  {
    id: 'accomodation',
    name: 'Проживание',
    href: '/requests/create/accomodation'
  },
  {
    id: 'transport',
    name: 'Транспорт',
    href: '/requests/create/transport'
  },
  {
    id: 'entertainment',
    name: 'Туры/активности',
    href: '/requests/create/entertainment'
  }
];

interface RequestTypeButtonProps {
  type: RequestType;
}

const RequestTypeButton: React.FC<RequestTypeButtonProps> = ({ type }) => (
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
  types?: RequestType[];
}

export const RequestTypesList: React.FC<RequestTypesListProps> = ({ 
  types = REQUEST_TYPES 
}) => {
  return (
    <div className="flex flex-wrap gap-3">
      {types.map((type) => (
        <RequestTypeButton key={type.id} type={type} />
      ))}
    </div>
  );
};
