'use client';

import React, { useState } from 'react';
import { SelectCurrentLocationComponent } from '@/components/location/current/SelectCurrentLocationComponent';

interface CurrentLocationClientProps {
  locationName: string;
  currentLocationId?: number;
}

export const CurrentLocationClient: React.FC<CurrentLocationClientProps> = ({ locationName, currentLocationId }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6 flex justify-center">
      <button
        type="button"
        className="font-medium text-blue-600 hover:underline"
        onClick={() => setIsOpen(true)}
      >
        {locationName}
      </button>

      <SelectCurrentLocationComponent
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        currentLocationId={currentLocationId}
      />
    </div>
  );
};


