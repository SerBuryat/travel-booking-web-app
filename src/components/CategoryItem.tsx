import React from 'react';

interface CategoryItemProps {
  id: number;
  name: string;
  code: string;
  photo?: string | null;
  onClick: (category: { id: number; name: string; code: string; photo?: string | null }) => void;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({ id, name, code, photo, onClick }) => {
  return (
    <div
      className="flex items-center py-3 cursor-pointer hover:bg-gray-100 transition group relative"
      onClick={() => onClick({ id, name, code, photo })}
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-[10px] overflow-hidden bg-gray-200">
        {photo ? (
          <img src={photo} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl">?</div>
        )}
      </div>
      <div className="flex-1 text-[17px] font-normal text-gray-900 ml-5">{name}</div>
      <div className="flex-shrink-0 w-4 h-4 ml-4">
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
          <path d="M9 6l6 6-6 6" stroke="#707579" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="absolute left-[10%] bottom-0 w-[80%] h-px bg-gray-200 group-hover:bg-gray-300" />
    </div>
  );
}; 