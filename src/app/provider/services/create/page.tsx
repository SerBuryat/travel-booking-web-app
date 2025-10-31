import React from 'react';
import {ProviderCreateServiceForm} from './_components/ProviderCreateServiceForm';

export default function ServiceRegistrationPage() {
  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ProviderCreateServiceForm />
      </div>
    </div>
  );
}
