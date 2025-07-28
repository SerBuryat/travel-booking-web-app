import React from 'react';

export interface GeneralCategory {
  code: string;
  icon: React.ReactNode;
}

// Mock SVG icons based on category names
const AccommodationIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="#303030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="9,22 9,12 15,12 15,22" stroke="#303030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FoodIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" stroke="#303030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4z" stroke="#303030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="6" y1="1" x2="6" y2="4" stroke="#303030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="10" y1="1" x2="10" y2="4" stroke="#303030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="14" y1="1" x2="14" y2="4" stroke="#303030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TransportIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="3" width="15" height="13" rx="2" ry="2" stroke="#303030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polygon points="16,8 20,8 23,11 23,16 16,16 16,8" stroke="#303030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="5.5" cy="18.5" r="2.5" stroke="#303030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="18.5" cy="18.5" r="2.5" stroke="#303030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ToursIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#303030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 17l10 5 10-5" stroke="#303030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12l10 5 10-5" stroke="#303030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Default icon for general categories
export const DEFAULT_CATEGORY_ICON: React.ReactNode = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="#303030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="3.27,6.96 12,12.01 20.73,6.96" stroke="#303030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="22.08" x2="12" y2="12" stroke="#303030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// General categories constants
export const ACCOMMODATION: GeneralCategory = {
  code: 'accomodation',
  icon: <AccommodationIcon />
};

export const FOOD: GeneralCategory = {
  code: 'food',
  icon: <FoodIcon />
};

export const TRANSPORT: GeneralCategory = {
  code: 'transport',
  icon: <TransportIcon />
};

export const TOURS: GeneralCategory = {
  code: 'tours',
  icon: <ToursIcon />
};

// Map of general categories
const generalCategoriesMap = new Map<string, GeneralCategory>([
  [ACCOMMODATION.code, ACCOMMODATION],
  [FOOD.code, FOOD],
  [TRANSPORT.code, TRANSPORT],
  [TOURS.code, TOURS],
]);

// Function to get general category by code
export function getGeneralCategoryByCode(code: string): GeneralCategory | undefined {
  return generalCategoriesMap.get(code);
}

// Get all general category codes
export function getGeneralCategoryCodes(): string[] {
  return Array.from(generalCategoriesMap.keys());
} 