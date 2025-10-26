import React from 'react';
import {FieldErrors, UseFormWatch} from 'react-hook-form';
import {ServiceRegistrationFormData} from '@/schemas/serviceRegistrationSchema';

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

  // Разделяем поля на заполненные и незаполненные
  const fieldsWithStatus = requiredFields.map(field => {
    const value = formValues[field.key as keyof ServiceRegistrationFormData];
    const isEmpty = !value || (typeof value === 'number' && value === 0) || (typeof value === 'string' && value.trim() === '');
    return { ...field, isEmpty };
  });

  const emptyFields = fieldsWithStatus.filter(f => f.isEmpty);

  // Если все поля заполнены, не показываем список
  if (emptyFields.length === 0) {
    return null;
  }

  return (
    <div className="p-4 rounded-lg border border-gray-200" style={{ backgroundColor: '#FAFBFC' }}>
      <div className="flex items-start mb-3">
        <svg className="w-5 h-5 mr-2 flex-shrink-0" style={{ color: '#707579', marginTop: '2px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 className="text-sm font-semibold" style={{ color: '#374151' }}>
            Заполните обязательные поля
          </h3>
          <p className="text-xs mt-1" style={{ color: '#707579' }}>
            Необходимо заполнить следующие поля для создания сервиса:
          </p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {fieldsWithStatus.map((field) => (
          <div 
            key={field.key} 
            className="px-3 py-1.5 text-xs rounded" 
            style={{ 
              backgroundColor: field.isEmpty ? 'white' : '#F3F4F6',
              color: field.isEmpty ? '#707579' : '#9CA3AF',
              textDecoration: field.isEmpty ? 'none' : 'line-through'
            }}
          >
            {field.label}
          </div>
        ))}
      </div>
    </div>
  );
};
