'use client';

import React, {useEffect, useState, useRef} from 'react';

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
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const slideIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const startTimers = () => {
    // Clear existing timers
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    if (slideIntervalRef.current) {
      clearInterval(slideIntervalRef.current);
    }

    // Reset start time
    startTimeRef.current = Date.now();
    setProgress(0);

    if (images.length <= 1) return;

    // Start progress timer
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const progressPercent = (elapsed % autoPlayInterval) / autoPlayInterval;
      setProgress(progressPercent);
    }, 16); // Update progress every 16ms (~60fps) for smoother animation

    // Start slide timer
    slideIntervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
      startTimeRef.current = Date.now();
      setProgress(0);
    }, autoPlayInterval);
  };

  useEffect(() => {
    startTimers();

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
    };
  }, [images.length, autoPlayInterval]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    startTimers(); // Reset timers when manually switching
  };

  const goToNextSlide = () => {
    if (images.length <= 1) return;
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
    startTimers(); // Reset timers when manually switching
  };

  if (images.length === 0) {
    return (
      <div className="w-full h-64 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
        <span className="text-white text-lg">No images available</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-80 overflow-hidden">
      {/* Images */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full cursor-pointer"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onClick={goToNextSlide}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="w-full h-full flex-shrink-0"
            style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
        ))}
      </div>

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
          {images.map((_, index) => {
            const isActive = index === currentIndex;
            
            return (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative rounded-full overflow-hidden transition-all duration-300 ease-in-out ${
                  isActive ? 'w-4 h-1' : 'w-2 h-1'
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