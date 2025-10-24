import React from 'react';
import { currentLocation } from '@/lib/location/currentLocation';
import { CurrentLocationClient } from '@/components/location/current/CurrentLocationClient';
import {headers} from "next/headers";
import {PAGE_ROUTES} from "@/utils/routes";

export async function CurrentLocation() {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname');

  // Скрываем навбар на странице авторизации Telegram
  if (pathname === PAGE_ROUTES.TELEGRAM_AUTH) {
    return null;
  }

  const location = await currentLocation();
  return (
    <CurrentLocationClient
      locationName={location?.name ?? 'Выберите локацию'}
      currentLocationId={location?.id}
    />
  );
}


