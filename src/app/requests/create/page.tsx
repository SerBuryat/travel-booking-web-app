"use client";

import React from 'react';
import {RequestTypesList} from '../_components';

export default function CreateRequestPage() {
  return (
    <div className="max-w-4xl mx-auto pt-2 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Создать новую заявку</h1>
      
      <div className="mb-6">
        <div className="font-semibold text-gray-700 mb-4 text-sm">Выберите тип заявки</div>
        <RequestTypesList />
      </div>
    </div>
  );
}
