import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-white p-10">
      <div className="overflow-y-auto">
        <ul>
          {[...Array(8)].map((_, index) => (
            <li key={index} className="relative">
              <div className="bg-white rounded-[10px] overflow-hidden shadow-sm border">
                <div className="flex">
                  {/* Square on the left */}
                  <div className="w-24 h-24 bg-gray-200 animate-pulse flex-shrink-0"></div>
                  {/* Gap and wide rectangles on the right */}
                  <div className="flex-1 p-4 border-l border-gray-100 flex flex-col justify-center">
                    <div className="h-5 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                  </div>
                </div>
              </div>
              {index < 7 && <div className="h-px bg-gray-100 my-4"></div>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 