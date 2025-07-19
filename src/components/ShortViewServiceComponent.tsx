import React from 'react';

interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  tcategories_id: number;
}

interface ShortViewServiceComponentProps {
  service: Service;
  onClick: (service: Service) => void;
}

export const ShortViewServiceComponent: React.FC<ShortViewServiceComponentProps> = ({ service, onClick }) => {
  // Generate a random gradient for service photo
  const getRandomGradient = () => {
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  // Truncate description if too long
  const truncateDescription = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div 
      className="bg-white rounded-[10px] overflow-hidden shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick(service)}
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* Service photo header */}
      <div 
        className="h-24 w-full"
        style={{ background: getRandomGradient() }}
      ></div>
      
      {/* Service content */}
      <div className="p-3">
        <h3 
          className="text-black font-semibold text-sm mb-1 line-clamp-2"
          style={{ fontWeight: 600 }}
        >
          {service.name}
        </h3>
        <p 
          className="text-xs leading-relaxed"
          style={{ color: '#707579', fontWeight: 400 }}
        >
          {truncateDescription(service.description)}
        </p>
      </div>
    </div>
  );
}; 