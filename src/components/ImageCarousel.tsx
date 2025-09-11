'use client';

import React, {useEffect, useState} from 'react';

interface ImageCarouselProps {
  images: string[];
  autoPlayInterval?: number;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ 
  images, 
  autoPlayInterval = 5000 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressPercent = (elapsed % autoPlayInterval) / autoPlayInterval;
      setProgress(progressPercent);
    }, 16); // Update progress every 16ms (~60fps) for smoother animation

    const slideInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
      setProgress(0);
    }, autoPlayInterval);

    return () => {
      clearInterval(interval);
      clearInterval(slideInterval);
    };
  }, [images.length, autoPlayInterval]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  if (images.length === 0) {
    return (
      <div className="w-full h-64 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
        <span className="text-white text-lg">No images available</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-64 overflow-hidden">
      {/* Images */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div 
            key={index}
            className="w-full h-full flex-shrink-0"
            style={{ background: image }}
          />
        ))}
      </div>

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => {
            const isActive = index === currentIndex;
            
            return (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative rounded-full overflow-hidden transition-all duration-300 ease-in-out ${
                  isActive ? 'w-6 h-3' : 'w-3 h-3'
                }`}
                aria-label={`Go to image ${index + 1}`}
              >
                {/* Background grey layer */}
                <div className="absolute inset-0 bg-gray-400" />
                
                {/* Loading white layer - fills from left to right */}
                {isActive && (
                  <div 
                    className="absolute inset-0 bg-white"
                    style={{ 
                      width: `${progress * 100}%`,
                      transition: 'width 0.016s linear'
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}; 