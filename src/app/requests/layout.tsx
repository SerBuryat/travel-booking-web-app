import React from 'react';
import { Header } from '@/components/Header';

interface RequestsLayoutProps {
  children: React.ReactNode;
}

export default function RequestsLayout({ children }: RequestsLayoutProps) {
  return (
    <div className="min-h-screen bg-white pb-24 sm:pb-0">
      <Header>
        {children}
      </Header>
    </div>
  );
}
