import React from 'react';
import { currentLocation } from '@/lib/location/currentLocation';
import { CurrentLocationClient } from '@/components/location/current/CurrentLocationClient';

export async function CurrentLocation() {
  const location = await currentLocation();
  return (
    <CurrentLocationClient
      locationName={location?.name ?? 'Выберите локацию'}
      currentLocationId={location?.id}
    />
  );
}


