'use client';

import React, {useState} from 'react';
import { SelectCurrentLocationComponent } from '@/components/location/current/SelectCurrentLocationComponent';
import {usePathname} from "next/navigation";
import {PAGE_ROUTES} from "@/utils/routes";
import {useAuth} from "@/contexts/AuthContext";

const CurrentLocationSkeleton: React.FC = () => (
  <div className="flex justify-center bg-white p-1">
    <div className="w-20 h-4 bg-gray-300 rounded-full animate-pulse mb-1"></div>
  </div>
);

export const CurrentLocation: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { isLoading, location, refreshUser } = useAuth();

  // todo — вынести исключения страниц в одно место (см. middleware PUBLIC_PATHS, Footer)
  if (pathname === PAGE_ROUTES.TELEGRAM_AUTH || pathname === PAGE_ROUTES.WEB_AUTH) {
    return null;
  }

  if (isLoading) {
    return <CurrentLocationSkeleton />;
  }

  return (
    <div className="flex justify-center bg-white">
      <button
        type="button"
        className="font-medium text-blue-600 hover:underline"
        onClick={() => setIsOpen(true)}
      >
        {location?.name || 'Выберите локацию'}
      </button>

      <SelectCurrentLocationComponent
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        currentLocationId={location?.id}
        refreshUser={refreshUser}
      />
    </div>
  );
};


