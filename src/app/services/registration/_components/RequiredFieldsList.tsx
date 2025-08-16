import React from 'react';
import { UseFormWatch, FieldErrors } from 'react-hook-form';
import { ServiceRegistrationFormData } from '@/schemas/serviceRegistrationSchema';

interface RequiredFieldsListProps {
  watch: UseFormWatch<ServiceRegistrationFormData>;
  errors: FieldErrors<ServiceRegistrationFormData>;
}

export const RequiredFieldsList: React.FC<RequiredFieldsListProps> = ({ watch, errors }) => {
  const formValues = watch();
  
  // Список всех обязательных полей с их названиями
  const requiredFields = [
    { key: 'name', label: 'Название сервиса' },
    { key: 'description', label: 'Описание сервиса' },
    { key: 'price', label: 'Цена' },
    { key: 'tcategories_id', label: 'Категория' },
    { key: 'address', label: 'Адрес' },
    { key: 'tarea_id', label: 'Зона' },
    { key: 'providerCompanyName', label: 'Название компании' },
    { key: 'providerContactPerson', label: 'Контактное лицо' },
    { key: 'providerPhone', label: 'Телефон компании' }
  ];

  // Фильтруем только незаполненные поля
  const emptyFields = requiredFields.filter(field => {
    const value = formValues[field.key as keyof ServiceRegistrationFormData];
    return !value || (typeof value === 'number' && value === 0) || (typeof value === 'string' && value.trim() === '');
  });

  // Если все поля заполнены, не показываем список
  if (emptyFields.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-200 shadow-lg">
      <div className="flex items-center mb-4">
        <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-yellow-800">
          Для создания сервиса заполните следующие поля:
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {emptyFields.map((field) => (
          <div key={field.key} className="flex items-center text-sm text-yellow-700">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
            {field.label}
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Совет:</strong> Заполните все обязательные поля, чтобы активировать кнопку "Создать сервис"
        </p>
      </div>
    </div>
  );
};
