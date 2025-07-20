import React from 'react';

interface CategoryItemProps {
  id: number;
  name: string;
  code: string;
  photo?: string | null;
  onClick: (category: { id: number; name: string; code: string; photo?: string | null }) => void;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({ id, name, code, photo, onClick }) => {
  // Generate a random gradient for category photo
  const getRandomGradient = () => {
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
      'linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)',
    ];
    // Use category ID to ensure consistent gradient for each category
    return gradients[id % gradients.length];
  };

  return (
    <div
      className="flex items-center py-3 cursor-pointer hover:bg-gray-100 transition group relative"
      onClick={() => onClick({ id, name, code, photo })}
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <div 
        className="flex-shrink-0 w-12 h-12 rounded-[10px] overflow-hidden"
        style={{ background: getRandomGradient() }}
      ></div>
      <div className="flex-1 text-[17px] font-normal text-gray-900 overflow-hidden ml-5">{name}</div>
      <div className="flex-shrink-0 w-4 h-4 ml-4">
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
          <path d="M9 6l6 6-6 6" stroke="#707579" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="absolute left-[10%] bottom-0 w-[80%] h-px bg-gray-200 group-hover:bg-gray-300" />
    </div>
  );
}; 