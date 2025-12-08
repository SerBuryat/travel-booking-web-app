import React from 'react';

/**
 * Интерфейс для категории с полной информацией об изображениях
 */
export interface CategoryImages {
  sysname: string;
  svgIcon: React.ReactNode;
  pngLarge: string;        // путь к большой PNG картинке (sysname-sq-lg.png)
  pngSmall: string;        // путь к маленькой PNG картинке (sysname-sq-sm.png)
  backgroundImage: string; // путь к горизонтальной фоновой картинке (sysname-hr.png)
}

/**
 * Старый интерфейс для обратной совместимости
 * @deprecated Используйте CategoryImages
 */
export interface GeneralCategory {
  code: string;
  icon: React.ReactNode;
}

// Mock SVG icons based on category names
const AccommodationIcon: React.FC = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd"  fill="#303030"
    d="M11.856 3.52087H14.144C16.1352 3.52087 17.7125 3.52087 18.9464 3.68662C20.2161 3.85779 21.2442 4.21746 22.0556 5.02779C22.8659 5.83921 23.2256 6.86729 23.3968 8.13696C23.5604 9.35679 23.5625 10.9103 23.5625 12.869C23.9352 13.1755 24.2309 13.5731 24.4184 14.027C24.5494 14.3412 24.6004 14.6662 24.6242 15.0096C24.6459 15.339 24.6459 15.7409 24.6459 16.223V16.2771C24.6459 16.7592 24.6459 17.1611 24.6242 17.4905C24.6106 17.8271 24.5411 18.1592 24.4184 18.473C24.2688 18.8346 24.0494 19.1632 23.7728 19.4399C23.4962 19.7167 23.1678 19.9363 22.8064 20.0861C22.4922 20.2161 22.1672 20.267 21.8238 20.2898C21.6813 20.2995 21.5386 20.3056 21.3959 20.3082V21.6667C21.3959 21.8822 21.3103 22.0889 21.1579 22.2412C21.0055 22.3936 20.7988 22.4792 20.5834 22.4792C20.3679 22.4792 20.1612 22.3936 20.0088 22.2412C19.8565 22.0889 19.7709 21.8822 19.7709 21.6667V20.3125H6.22919V21.6667C6.22919 21.8822 6.14358 22.0889 5.99121 22.2412C5.83884 22.3936 5.63217 22.4792 5.41669 22.4792C5.2012 22.4792 4.99454 22.3936 4.84216 22.2412C4.68979 22.0889 4.60419 21.8822 4.60419 21.6667V20.3071C4.46143 20.3049 4.31874 20.2991 4.17627 20.2898C3.83971 20.2769 3.50764 20.2081 3.19369 20.0861C2.83202 19.9364 2.50341 19.7169 2.22663 19.4401C1.94985 19.1633 1.73033 18.8347 1.5806 18.473C1.4506 18.1589 1.39969 17.8339 1.37694 17.4905C1.35419 17.1611 1.35419 16.7592 1.35419 16.2771V16.223C1.35419 15.7409 1.35419 15.339 1.37585 15.0096C1.39969 14.6651 1.45169 14.3412 1.58169 14.027C1.76782 13.5764 2.06169 13.1784 2.43752 12.8679C2.43752 10.9114 2.43969 9.35679 2.60327 8.13696C2.77444 6.86729 3.1341 5.83921 3.94444 5.02779C4.75585 4.21746 5.78394 3.85779 7.0536 3.68662C8.2886 3.52087 9.86485 3.52087 11.856 3.52087ZM4.06252 12.219L4.17627 12.2103C4.44819 12.1919 4.77102 12.1886 5.14585 12.1886V11.3187C5.14585 10.3459 5.14585 9.53337 5.23252 8.88987C5.32352 8.20954 5.52502 7.59529 6.01794 7.10237C6.51194 6.60837 7.12619 6.40687 7.80544 6.31587C8.45002 6.22921 9.26252 6.22921 10.2354 6.22921H15.7647C16.7386 6.22921 17.55 6.22921 18.1935 6.31587C18.8739 6.40687 19.4881 6.60837 19.981 7.10129C20.475 7.59529 20.6765 8.20954 20.7675 8.88879C20.8542 9.53337 20.8542 10.3459 20.8542 11.3187V12.1875C21.2156 12.1851 21.5769 12.1956 21.9375 12.219C21.9343 10.556 21.9159 9.32104 21.7859 8.35362C21.6396 7.26379 21.3644 6.63546 20.9062 6.17612C20.4479 5.71896 19.8196 5.44379 18.7298 5.29754C17.6172 5.14804 16.1493 5.14587 14.0834 5.14587H11.9167C9.85077 5.14587 8.38394 5.14804 7.26919 5.29754C6.18044 5.44379 5.5521 5.71896 5.09385 6.17721C4.6356 6.63546 4.36044 7.26379 4.21419 8.35254C4.08419 9.31996 4.06577 10.555 4.06252 12.2179M19.2292 12.1865V11.374C19.2292 10.3296 19.227 9.62762 19.1566 9.10437C19.0894 8.60496 18.9735 8.39046 18.8316 8.24962C18.6897 8.10879 18.4774 7.99287 17.9779 7.92462C17.4547 7.85529 16.7527 7.85312 15.7084 7.85312H13.8125V12.1865H19.2292ZM12.1875 12.1865V7.85312H10.2917C9.24735 7.85312 8.54535 7.85529 8.0221 7.92571C7.52269 7.99287 7.30819 8.10879 7.16735 8.25071C7.02652 8.39262 6.9106 8.60496 6.84235 9.10437C6.77302 9.62762 6.77085 10.3296 6.77085 11.374V12.1865H12.1875ZM4.28677 13.8299C4.02569 13.8483 3.89894 13.8797 3.81552 13.9144C3.65107 13.9824 3.50166 14.0822 3.37581 14.2081C3.24996 14.3339 3.15016 14.4833 3.0821 14.6478C3.04744 14.7312 3.01602 14.858 2.9976 15.119C2.97919 15.3866 2.97919 15.7333 2.97919 16.249C2.97919 16.7646 2.97919 17.1113 2.9976 17.3789C3.01602 17.64 3.04744 17.7667 3.0821 17.8501C3.21969 18.1827 3.48294 18.446 3.81552 18.5835C3.89894 18.6182 4.02569 18.6496 4.28677 18.668C4.55435 18.6865 4.90102 18.6865 5.41669 18.6865H20.5834C21.099 18.6865 21.4457 18.6865 21.7133 18.668C21.9744 18.6496 22.1011 18.6182 22.1845 18.5835C22.5171 18.446 22.7804 18.1827 22.9179 17.8501C22.9526 17.7667 22.984 17.64 23.0024 17.3789C23.0209 17.1113 23.0209 16.7646 23.0209 16.249C23.0209 15.7333 23.0209 15.3866 23.0024 15.119C22.984 14.858 22.9526 14.7312 22.9179 14.6478C22.8499 14.4833 22.7501 14.3339 22.6242 14.2081C22.4984 14.0822 22.349 13.9824 22.1845 13.9144C22.1011 13.8797 21.9744 13.8483 21.7133 13.8299C21.3369 13.8125 20.9601 13.8068 20.5834 13.8125H5.41669C4.90102 13.8125 4.55435 13.8125 4.28677 13.831" />
  </svg>
);

const FoodIcon: React.FC = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.3125 1.625H8.9375V9.75H7.3125V1.625Z" fill="#303030"/>
    <path d="M11.375 8.9375C11.375 9.79945 11.0326 10.6261 10.4231 11.2356C9.8136 11.8451 8.98695 12.1875 8.125 12.1875C7.26305 12.1875 6.4364 11.8451 5.8269 11.2356C5.21741 10.6261 4.875 9.79945 4.875 8.9375V1.625H3.25V8.9375C3.25117 10.0887 3.6597 11.2024 4.40325 12.0812C5.1468 12.9601 6.17739 13.5475 7.3125 13.7394V24.375H8.9375V13.7394C10.0726 13.5475 11.1032 12.9601 11.8467 12.0812C12.5903 11.2024 12.9988 10.0887 13 8.9375V1.625H11.375V8.9375ZM17.875 1.625H17.0625V24.375H18.6875V16.25H21.125C21.556 16.25 21.9693 16.0788 22.274 15.774C22.5788 15.4693 22.75 15.056 22.75 14.625V6.5C22.7751 5.85307 22.6662 5.20793 22.4301 4.60509C22.194 4.00226 21.8358 3.45475 21.378 2.99696C20.9202 2.53917 20.3727 2.18097 19.7699 1.94487C19.1671 1.70877 18.5219 1.59987 17.875 1.625ZM21.125 14.625H18.6875V3.32312C21.0275 3.77812 21.125 6.19937 21.125 6.5V14.625Z" 
    fill="#303030"/>
  </svg>
);

const TransportIcon: React.FC = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.8334 2.17639C8.14671 2.21539 6.62462 2.41472 5.60304 3.43631C4.33337 4.70489 4.33337 6.74806 4.33337 10.8333V13C4.33337 17.0852 4.33337 19.1284 5.60304 20.397C6.87271 21.6656 8.91479 21.6666 13 21.6666C17.0853 21.6666 19.1285 21.6666 20.397 20.397C21.6656 19.1273 21.6667 17.0852 21.6667 13V10.8333C21.6667 6.74806 21.6667 4.70489 20.397 3.43631C19.3755 2.41472 17.8534 2.21539 15.1667 2.17639" 
    stroke="#303030" strokeWidth="1.625" strokeLinecap="round"/>
    <path d="M17.3334 14.0833H21.6667L23.4 12.7833C23.5346 12.6824 23.6438 12.5516 23.719 12.4011C23.7942 12.2507 23.8334 12.0848 23.8334 11.9167V10.8333C23.8334 10.546 23.7192 10.2705 23.5161 10.0673C23.3129 9.86414 23.0373 9.75 22.75 9.75H21.6667M13 14.0833H4.33335L2.60002 12.7833C2.46547 12.6824 2.35627 12.5516 2.28106 12.4011C2.20584 12.2507 2.16669 12.0848 2.16669 11.9167V10.8333C2.16669 10.546 2.28082 10.2705 2.48399 10.0673C2.68715 9.86414 2.9627 9.75 3.25002 9.75H4.33335M16.7917 17.3333H18.4167M7.58335 17.3333H9.20835M6.50002 21.125V22.75C6.50002 23.0373 6.61416 23.3129 6.81732 23.516C7.02049 23.7192 7.29604 23.8333 7.58335 23.8333H9.20835C9.49567 23.8333 9.77122 23.7192 9.97439 23.516C10.1776 23.3129 10.2917 23.0373 10.2917 22.75V21.6667M19.5 21.125V22.75C19.5 23.0373 19.3859 23.3129 19.1827 23.516C18.9796 23.7192 18.704 23.8333 18.4167 23.8333H16.7917C16.5044 23.8333 16.2288 23.7192 16.0257 23.516C15.8225 23.3129 15.7084 23.0373 15.7084 22.75V21.6667" 
    stroke="#303030" strokeWidth="1.625" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4.875 5.41663H8.9375M21.125 5.41663H13" stroke="#303030" strokeWidth="1.625" strokeLinecap="round"/>
  </svg>
);

const EntertainmentIcon: React.FC = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.9251 3.79166C13.833 3.62726 13.6987 3.49039 13.5361 3.39512C13.3735 3.29985 13.1884 3.24963 13 3.24963C12.8115 3.24963 12.6265 3.29985 12.4639 3.39512C12.3012 3.49039 12.167 3.62726 12.0748 3.79166C11.8581 4.18599 11.6498 4.58538 11.4497 4.98982C10.8194 6.26919 10.2836 7.59295 9.84639 8.95049C9.69581 9.41741 9.24948 9.74132 8.73814 9.75541C7.18813 9.79616 5.64316 9.95004 4.11556 10.2158C3.27706 10.3632 2.96181 11.3187 3.55764 11.9015C3.69342 12.0351 3.83064 12.1669 3.96931 12.2969C5.00613 13.2761 6.10238 14.1903 7.25181 15.0345C7.64939 15.3259 7.81298 15.8253 7.66131 16.2825C7.08356 18.0191 6.67008 19.8062 6.42631 21.6201C6.31798 22.438 7.19331 23.0154 7.95381 22.6254C9.46185 21.8522 10.9039 20.9565 12.2655 19.9474C12.4787 19.7917 12.7359 19.7079 13 19.7079C13.264 19.7079 13.5212 19.7917 13.7345 19.9474C15.0958 20.9569 16.5379 21.8526 18.0461 22.6254C18.8056 23.0154 19.682 22.438 19.5736 21.6201C19.5318 21.3131 19.4859 21.008 19.4361 20.7047C19.1858 19.2043 18.8189 17.7258 18.3386 16.2825C18.187 15.8253 18.3495 15.3259 18.7481 15.0345C20.0522 14.079 21.2867 13.032 22.4423 11.9015C23.0381 11.3187 22.724 10.3632 21.8844 10.2158C20.357 9.94849 18.8119 9.79459 17.2618 9.75541C17.0167 9.75151 16.7788 9.67213 16.5805 9.52808C16.3822 9.38404 16.2331 9.18235 16.1536 8.95049C15.578 7.16372 14.8317 5.43542 13.9251 3.79166Z" 
      stroke="#303030" strokeWidth="1.625" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HealthIcon: React.FC = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
        d="M4 11.9998H8L9.5 8.99976L11.5 13.9998L13 11.9998H15M12 6.42958C12.4844 5.46436 13.4683 4.72543 14.2187 4.35927C16.1094 3.43671 17.9832 3.91202 19.5355 5.46436C21.4881 7.41698 21.4881 10.5828 19.5355 12.5354L12.7071 19.3639C12.3166 19.7544 11.6834 19.7544 11.2929 19.3639L4.46447 12.5354C2.51184 10.5828 2.51184 7.41698 4.46447 5.46436C6.0168 3.91202 7.89056 3.43671 9.78125 4.35927C10.5317 4.72543 11.5156 5.46436 12 6.42958Z"
        stroke="#303030" strokeWidth="1.625" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PackageIcon: React.FC = () => (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 2.16667L3.25 7.58333V18.4167L13 23.8333L22.75 18.4167V7.58333L13 2.16667Z"
            stroke="#303030" strokeWidth="1.625" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.25 7.58333L13 13L22.75 7.58333M13 13V23.8333"
            stroke="#303030" strokeWidth="1.625" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const ShoppingIcon: React.FC = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.5 6.5L4.33333 3.25H2.16667C1.70708 3.25 1.33333 3.62375 1.33333 4.08333C1.33333 4.54292 1.70708 4.91667 2.16667 4.91667H5.41667L8.66667 10.8333H19.5L22.75 4.91667H24.9167C25.3763 4.91667 25.75 4.54292 25.75 4.08333C25.75 3.62375 25.3763 3.25 24.9167 3.25H22.75L20.5833 6.5H6.5Z" 
          stroke="#303030" strokeWidth="1.625" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.66667 10.8333L6.5 21.6667H19.5L17.3333 10.8333" 
          stroke="#303030" strokeWidth="1.625" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="9.75" cy="22.75" r="1.08333" fill="#303030"/>
    <circle cx="19.5" cy="22.75" r="1.08333" fill="#303030"/>
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

// ============================================================================
// НОВАЯ СТРУКТУРА КАТЕГОРИЙ С ПОЛНОЙ ИНФОРМАЦИЕЙ ОБ ИЗОБРАЖЕНИЯХ
// ============================================================================

/**
 * Полная карта категорий с изображениями
 * Структура для удобного доступа к SVG и PNG картинкам
 */
export const CATEGORIES_IMAGES_MAP: Record<string, CategoryImages> = {
  accommodation: {
    sysname: 'accommodation',
    svgIcon: <AccommodationIcon />,
    pngLarge: '/images/categories/accommodation/accommodation-sq-lg.png',
    pngSmall: '/images/categories/accommodation/accommodation-sq-sm.png',
    backgroundImage: '/images/categories/accommodation/accommodation-hr.png',
  },
  food: {
    sysname: 'food',
    svgIcon: <FoodIcon />,
    pngLarge: '/images/categories/food/food-sq-lg.png',
    pngSmall: '/images/categories/food/food-sq-sm.png',
    backgroundImage: '/images/categories/food/food-hr.png',
  },
  transport: {
    sysname: 'transport',
    svgIcon: <TransportIcon />,
    pngLarge: '/images/categories/transport/transport-sq-lg.png',
    pngSmall: '/images/categories/transport/transport-sq-sm.png',
    backgroundImage: '/images/categories/transport/transport-hr.png',
  },
  entertainment: {
    sysname: 'entertainment',
    svgIcon: <EntertainmentIcon />,
    pngLarge: '/images/categories/entertainment/entertainment-sq-lg.png',
    pngSmall: '/images/categories/entertainment/entertainment-sq-sm.png',
    backgroundImage: '/images/categories/entertainment/entertainment-hr.png',
  },
  health: {
    sysname: 'health',
    svgIcon: <HealthIcon />,
    pngLarge: '/images/categories/health/health-sq-lg.png',
    pngSmall: '/images/categories/health/health-sq-sm.png',
    backgroundImage: '/images/categories/health/health-hr.png',
  },
  package: {
    sysname: 'package',
    svgIcon: <PackageIcon />,
    pngLarge: '/images/categories/package/package-sq-lg.png',
    pngSmall: '/images/categories/package/package-sq-sm.png',
    backgroundImage: '/images/categories/package/package-hr.png',
  },
  shopping: {
    sysname: 'shopping',
    svgIcon: <ShoppingIcon />,
    pngLarge: '/images/categories/shopping/shopping-lg-sm.png',
    pngSmall: '/images/categories/shopping/shopping-sq-sm.png',
    backgroundImage: '/images/categories/shopping/shopping-hr.png',
  },
};

// ============================================================================
// ФУНКЦИИ ДЛЯ ПОЛУЧЕНИЯ ИЗОБРАЖЕНИЙ
// ============================================================================

/**
 * Получить полную информацию о категории по sysname
 */
export function getCategoryImages(sysname: string): CategoryImages | null {
  return CATEGORIES_IMAGES_MAP[sysname] || null;
}

/**
 * Получить SVG иконку категории по sysname
 */
export function getCategorySvgIcon(sysname: string): React.ReactNode {
  return CATEGORIES_IMAGES_MAP[sysname]?.svgIcon || DEFAULT_CATEGORY_ICON;
}

/**
 * Получить PNG картинку категории по sysname и размеру
 */
export function getCategoryPngImage(sysname: string, size: 'large' | 'small'): string | null {
  const category = CATEGORIES_IMAGES_MAP[sysname];
  if (!category) return null;
  return size === 'large' ? category.pngLarge : category.pngSmall;
}

/**
 * Получить горизонтальное фоновое изображение категории
 */
export function getCategoryBackgroundImage(sysname: string): string | null {
  const category = CATEGORIES_IMAGES_MAP[sysname];
  return category?.backgroundImage || null;
}

/**
 * Получить все sysname категорий
 */
export function getAllCategorySysnames(): string[] {
  return Object.keys(CATEGORIES_IMAGES_MAP);
}

// ============================================================================
// СТАРАЯ СТРУКТУРА ДЛЯ ОБРАТНОЙ СОВМЕСТИМОСТИ
// ============================================================================

/**
 * @deprecated Используйте CATEGORIES_IMAGES_MAP
 */
export const ACCOMMODATION: GeneralCategory = {
  code: 'accommodation',
  icon: <AccommodationIcon />
};

/**
 * @deprecated Используйте CATEGORIES_IMAGES_MAP
 */
export const FOOD: GeneralCategory = {
  code: 'food',
  icon: <FoodIcon />
};

/**
 * @deprecated Используйте CATEGORIES_IMAGES_MAP
 */
export const TRANSPORT: GeneralCategory = {
  code: 'transport',
  icon: <TransportIcon />
};

/**
 * @deprecated Используйте CATEGORIES_IMAGES_MAP
 */
export const ENTERTAINMENT: GeneralCategory = {
  code: 'entertainment',
  icon: <EntertainmentIcon />
};

/**
 * @deprecated Используйте getCategoryImages('health')
 */
export const HEALTH: GeneralCategory = {
  code: 'health',
  icon: <HealthIcon />
};

/**
 * @deprecated Используйте getCategoryImages('package')
 */
export const PACKAGE: GeneralCategory = {
  code: 'package',
  icon: <PackageIcon />
};

/**
 * @deprecated Используйте getCategoryImages('shopping')
 */
export const SHOPPING: GeneralCategory = {
  code: 'shopping',
  icon: <ShoppingIcon />
};

/**
 * Map of general categories
 * @deprecated Используйте CATEGORIES_IMAGES_MAP
 */
const generalCategoriesMap = new Map<string, GeneralCategory>([
  [ACCOMMODATION.code, ACCOMMODATION],
  [FOOD.code, FOOD],
  [TRANSPORT.code, TRANSPORT],
  [ENTERTAINMENT.code, ENTERTAINMENT],
  [HEALTH.code, HEALTH],
  [PACKAGE.code, PACKAGE],
  [SHOPPING.code, SHOPPING],
]);

/**
 * Function to get general category by code
 * @deprecated Используйте getCategoryImages()
 */
export function getGeneralCategoryByCode(code: string): GeneralCategory | undefined {
  return generalCategoriesMap.get(code);
}

/**
 * Get all general category codes
 * @deprecated Используйте getAllCategorySysnames()
 */
export function getGeneralCategoryCodes(): string[] {
  return Array.from(generalCategoriesMap.keys());
} 