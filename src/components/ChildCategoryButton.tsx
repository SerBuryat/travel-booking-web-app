import React from 'react';
import {CategoryEntity} from '@/entity/CategoryEntity';

interface ChildCategoryButtonProps {
  category: CategoryEntity;
  active: boolean;
  onClick: () => void;
  className?: string;
}

export const ChildCategoryButton: React.FC<ChildCategoryButtonProps> = ({ 
  category, 
  active, 
  onClick, 
  className = "px-4 py-2 rounded-[10px] mr-2 whitespace-nowrap" 
}) => (
  <button
    className={className}
    style={{
      background: active ? '#007AFF4D' : '#0000000A',
      fontSize: '13px',
      fontWeight: 600,
      color: active ? '#007AFF' : '#333',
      border: 'none',
      outline: 'none',
      transition: 'background 0.2s',
    }}
    onClick={onClick}
    type="button"
  >
    {category.name}
  </button>
); 