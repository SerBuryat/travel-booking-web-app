import React from 'react';

interface CategoryHeaderComponentProps {
  name: string;
  photo?: string | null;
}

export const CategoryHeaderComponent: React.FC<CategoryHeaderComponentProps> = ({ name, photo }) => {
  // Generate a random gradient if no photo
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

  const backgroundStyle = 
    photo 
      ? { backgroundImage: `url(${photo})`, backgroundSize: 'cover', backgroundPosition: 'center' }
      : { backgroundImage: getRandomGradient() };

  // Generate a random gradient for overlay (used only if photo is present)
  const overlayGradient = getRandomGradient();

  return (
    <div 
      className="relative h-32 rounded-lg flex items-center justify-center overflow-hidden"
      style={backgroundStyle}
    >
      {/* Overlay for better text readability */}
      {photo && (
        <div
          className="absolute inset-0"
          style={{ background: overlayGradient, opacity: 0.7 }}
        ></div>
      )}
      {/* Category name */}
      <h1 
        className="relative z-10 text-white font-bold text-2xl text-center px-4 "
        style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}
      >
        {name}
      </h1>
    </div>
  );
}; 