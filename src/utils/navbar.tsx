import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import Badge from '@mui/material/Badge';

// Navbar Button Component
interface NavbarButtonProps {
  href: string;
  icon: React.ComponentType<SvgIconProps>;
  title: string;
  active: boolean;
  badgeContent?: number;
}

const NavbarButton: React.FC<NavbarButtonProps> = ({ href, icon: Icon, title, active, badgeContent }) => (
  <Link href={href} className="flex flex-col items-center">
    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: active ? '#007AFF' : '#545458A6' }}>
      {badgeContent ? (
        <Badge badgeContent={badgeContent} color="error">
          <Icon color="inherit" fontSize="medium" />
        </Badge>
      ) : (
        <Icon color="inherit" fontSize="medium" />
      )}
    </span>
    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 12, marginTop: 2, color: active ? '#007AFF' : '#545458A6' }}>{title}</span>
  </Link>
);

// Navbar Component
export interface NavbarButtonConfig {
  href: string;
  icon: React.ComponentType<SvgIconProps>;
  title: string;
  badgeContent?: number;
}

interface NavbarProps {
  buttons: NavbarButtonConfig[];
}

export const Navbar: React.FC<NavbarProps> = ({ buttons }) => {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 w-full z-50 pb-4 pt-2" style={{ background: '#F6F6F6' }}>
      <div className="flex rounded-full px-6 py-2 justify-between w-full" style={{ background: '#F6F6F6' }}>
        {buttons.map((btn) => (
          <NavbarButton
            key={btn.href}
            href={btn.href}
            icon={btn.icon}
            title={btn.title}
            active={pathname === btn.href || pathname.startsWith(btn.href + '/')}
            badgeContent={btn.badgeContent}
          />
        ))}
      </div>
    </nav>
  );
};

// Icon Components
const HomeIcon = (props: SvgIconProps) => (
  <SvgIcon {...props} sx={{width:"22", height:"22", viewBox:"0 0 22 22", fill:"none", xmlns:"http://www.w3.org/2000/svg"}}>
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21.3958 10.8334C21.3958 10.6179 21.3102 10.4112 21.1579 10.2588C21.0055 10.1065 20.7988 10.0209 20.5833 10.0209C20.3678 10.0209 20.1612 10.1065 20.0088 10.2588C19.8564 10.4112 19.7708 10.6179 19.7708 10.8334H21.3958ZM6.22917 10.8334C6.22917 10.6179 6.14357 10.4112 5.99119 10.2588C5.83882 10.1065 5.63216 10.0209 5.41667 10.0209C5.20118 10.0209 4.99452 10.1065 4.84215 10.2588C4.68977 10.4112 4.60417 10.6179 4.60417 10.8334H6.22917ZM22.1758 13.5742C22.2502 13.654 22.3399 13.718 22.4396 13.7624C22.5393 13.8069 22.6468 13.8307 22.7559 13.8327C22.865 13.8346 22.9734 13.8145 23.0746 13.7737C23.1757 13.7328 23.2676 13.672 23.3448 13.5948C23.4219 13.5177 23.4828 13.4258 23.5236 13.3246C23.5645 13.2234 23.5846 13.115 23.5826 13.006C23.5807 12.8969 23.5568 12.7893 23.5124 12.6896C23.468 12.5899 23.404 12.5002 23.3242 12.4259L22.1758 13.5742ZM13 3.25002L13.5742 2.67585C13.4218 2.5237 13.2153 2.43823 13 2.43823C12.7847 2.43823 12.5782 2.5237 12.4258 2.67585L13 3.25002ZM2.67584 12.4259C2.59601 12.5002 2.53198 12.5899 2.48757 12.6896C2.44317 12.7893 2.41929 12.8969 2.41736 13.006C2.41544 13.115 2.43551 13.2234 2.47637 13.3246C2.51724 13.4258 2.57806 13.5177 2.65521 13.5948C2.73237 13.672 2.82427 13.7328 2.92544 13.7737C3.02661 13.8145 3.13498 13.8346 3.24407 13.8327C3.35316 13.8307 3.46075 13.8069 3.56042 13.7624C3.66009 13.718 3.74979 13.654 3.82417 13.5742L2.67584 12.4259ZM7.58334 23.5625H18.4167V21.9375H7.58334V23.5625ZM21.3958 20.5834V10.8334H19.7708V20.5834H21.3958ZM6.22917 20.5834V10.8334H4.60417V20.5834H6.22917ZM23.3242 12.4259L13.5742 2.67585L12.4258 3.82418L22.1758 13.5742L23.3242 12.4259ZM12.4258 2.67585L2.67584 12.4259L3.82417 13.5742L13.5742 3.82418L12.4258 2.67585ZM18.4167 23.5625C19.2068 23.5625 19.9646 23.2486 20.5233 22.6899C21.082 22.1312 21.3958 21.3735 21.3958 20.5834H19.7708C19.7708 21.3309 19.1642 21.9375 18.4167 21.9375V23.5625ZM7.58334 21.9375C6.83584 21.9375 6.22917 21.3309 6.22917 20.5834H4.60417C4.60417 21.3735 4.91805 22.1312 5.47675 22.6899C6.03545 23.2486 6.79321 23.5625 7.58334 23.5625V21.9375Z" 
      fill="currentColor"/>
    </svg>
  </SvgIcon>
);

const CatalogIcon = (props: SvgIconProps) => (
  <SvgIcon {...props} sx={{width:"24", height:"24", viewBox:"0 0 24 24", fill:"none", xmlns:"http://www.w3.org/2000/svg"}}>
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.16663 13.4333C2.16663 10.1649 2.16663 8.53125 3.19146 7.51508C4.21738 6.5 5.86729 6.5 9.16713 6.5H10.3328C13.6337 6.5 15.2836 6.5 16.3085 7.51508C17.3333 8.53017 17.3333 10.1649 17.3333 13.4333V16.9C17.3333 20.1684 17.3333 21.8021 16.3085 22.8183C15.2825 23.8333 13.6326 23.8333 10.3328 23.8333H9.16713C5.86729 23.8333 4.21629 23.8333 3.19146 22.8183C2.16663 21.8032 2.16663 20.1684 2.16663 16.9V13.4333Z" 
      stroke="currentColor" strokeOpacity="0.65" strokeWidth="1.625" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16.8328 17.3333H17.8328C20.6613 17.3333 22.0762 17.3333 22.9547 16.445C23.8333 15.5566 23.8333 14.1266 23.8333 11.2666V8.23329C23.8333 5.37329 23.8333 3.94329 22.9547 3.05496C22.0762 2.16663 20.6613 2.16663 17.8317 2.16663H16.8318C14.0021 2.16663 12.5883 2.16663 11.7098 3.05496C10.9406 3.83171 10.8442 5.02338 10.8322 7.22254M6.5 13H9.75M6.5 18.4166H11.9167M11.375 3.24996L15.7083 7.04163" 
      stroke="currentColor" strokeOpacity="0.65" strokeWidth="1.625" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </SvgIcon>
);

const ProfileIcon = (props: SvgIconProps) => (
  <SvgIcon {...props} sx={{width:"24", height:"24", viewBox:"0 0 24 24", fill:"none", xmlns:"http://www.w3.org/2000/svg"}}>
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 19.9138C3 18.6321 3.50914 17.403 4.41541 16.4967C5.32168 15.5904 6.55084 15.0813 7.8325 15.0813H17.4975C18.7792 15.0813 20.0083 15.5904 20.9146 16.4967C21.8209 17.403 22.33 18.6321 22.33 19.9138C22.33 20.5546 22.0754 21.1692 21.6223 21.6223C21.1692 22.0755 20.5546 22.33 19.9137 22.33H5.41625C4.77542 22.33 4.16084 22.0755 3.7077 21.6223C3.25457 21.1692 3 20.5546 3 19.9138Z" 
      stroke="currentColor" strokeOpacity="0.65" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M12.665 10.2487C14.6667 10.2487 16.2894 8.62606 16.2894 6.62437C16.2894 4.62269 14.6667 3 12.665 3C10.6633 3 9.04065 4.62269 9.04065 6.62437C9.04065 8.62606 10.6633 10.2487 12.665 10.2487Z" 
      stroke="currentColor" strokeOpacity="0.65" strokeWidth="1.5"/>
    </svg>
  </SvgIcon>
);

const MapIcon = (props: SvgIconProps) => (
  <SvgIcon {...props} sx={{width:"24", height:"24", viewBox:"0 0 24 24", fill:"none", xmlns:"http://www.w3.org/2000/svg"}}>
    <svg width="27" height="26" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M13.24 11.05C13.9296 11.05 14.5909 10.776 15.0785 10.2885C15.5661 9.80086 15.84 9.13954 15.84 8.44998C15.84 7.76041 15.5661 7.09909 15.0785 6.6115C14.5909 6.1239 13.9296 5.84998 13.24 5.84998C12.5505 5.84998 11.8891 6.1239 11.4015 6.6115C10.9139 7.09909 10.64 7.76041 10.64 8.44998C10.64 9.13954 10.9139 9.80086 11.4015 10.2885C11.8891 10.776 12.5505 11.05 13.24 11.05ZM13.24 7.14998C13.5848 7.14998 13.9155 7.28694 14.1593 7.53074C14.4031 7.77453 14.54 8.10519 14.54 8.44998C14.54 8.79476 14.4031 9.12542 14.1593 9.36921C13.9155 9.61301 13.5848 9.74998 13.24 9.74998C12.8952 9.74998 12.5646 9.61301 12.3208 9.36921C12.077 9.12542 11.94 8.79476 11.94 8.44998C11.94 8.10519 12.077 7.77453 12.3208 7.53074C12.5646 7.28694 12.8952 7.14998 13.24 7.14998Z" 
      fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M7.39001 8.17175C7.39001 11.6467 10.8389 17.55 13.24 17.55C15.6424 17.55 19.09 11.6467 19.09 8.17175C19.09 4.74495 16.4809 1.94995 13.24 1.94995C9.99911 1.94995 7.39001 4.74495 7.39001 8.17175ZM17.79 8.17175C17.79 11.0227 14.7376 16.25 13.24 16.25C11.7437 16.25 8.69001 11.024 8.69001 8.17175C8.69001 5.44305 10.7375 3.24995 13.24 3.24995C15.7425 3.24995 17.79 5.44305 17.79 8.17175Z" 
      fill="currentColor"/>
        <path d="M17.7055 11.882C17.5501 11.8151 17.4269 11.6903 17.362 11.534C17.2972 11.3777 17.2959 11.2022 17.3583 11.045C17.4208 10.8877 17.5421 10.761 17.6965 10.6918C17.851 10.6226 18.0263 10.6163 18.1852 10.6743C18.7139 10.884 19.1902 11.2067 19.581 11.6199C19.9717 12.0331 20.2674 12.5268 20.4472 13.0663L22.1814 18.2663C22.377 18.8528 22.4303 19.4773 22.337 20.0885C22.2438 20.6996 22.0065 21.2798 21.6449 21.7813C21.2833 22.2827 20.8076 22.691 20.2572 22.9724C19.7067 23.2539 19.0972 23.4004 18.479 23.4H8.00102C7.38302 23.4 6.77386 23.2531 6.22375 22.9715C5.67364 22.6899 5.19833 22.2816 4.837 21.7802C4.47567 21.2788 4.23866 20.6988 4.14551 20.0878C4.05236 19.4769 4.10573 18.8526 4.30123 18.2663L6.03412 13.0663C6.2171 12.5171 6.52004 12.0155 6.92096 11.598C7.32188 11.1804 7.81072 10.8573 8.35202 10.6522C8.43184 10.6219 8.51683 10.6076 8.60217 10.6102C8.6875 10.6127 8.77149 10.632 8.84935 10.667C8.92722 10.702 8.99742 10.752 9.05596 10.8142C9.1145 10.8763 9.16022 10.9494 9.19053 11.0292C9.22083 11.109 9.23511 11.194 9.23257 11.2793C9.23002 11.3647 9.21069 11.4487 9.17568 11.5265C9.14068 11.6044 9.09068 11.6746 9.02854 11.7331C8.9664 11.7917 8.89334 11.8374 8.81352 11.8677C8.4522 12.0044 8.12588 12.2199 7.85828 12.4985C7.59068 12.7771 7.38853 13.1119 7.26653 13.4784L5.53362 18.6784C5.40344 19.0693 5.368 19.4855 5.43023 19.8927C5.49246 20.3 5.65057 20.6866 5.89153 21.0207C6.1325 21.3549 6.44942 21.627 6.81619 21.8147C7.18295 22.0023 7.58905 22.1001 8.00102 22.1H18.4816C18.8936 22.1 19.2998 22.002 19.6665 21.8142C20.0332 21.6264 20.3501 21.3541 20.5909 21.0198C20.8317 20.6855 20.9897 20.2988 21.0517 19.8915C21.1138 19.4842 21.0781 19.0679 20.9477 18.6771L19.2161 13.4771C19.0961 13.1176 18.899 12.7886 18.6385 12.5133C18.378 12.238 18.0605 12.023 17.7081 11.8833" 
        fill="currentColor"/>
    </svg>
  </SvgIcon>
);

const RequestsIcon = (props: SvgIconProps) => (
  <SvgIcon {...props} sx={{width:"24", height:"24", viewBox:"0 0 24 24", fill:"none", xmlns:"http://www.w3.org/2000/svg"}}>
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.25 14.0833V11.9166C3.25 7.85413 3.25 5.82288 4.28458 4.39938C4.61832 3.93969 5.02228 3.53536 5.48167 3.20121C6.90625 2.16663 8.93858 2.16663 13 2.16663C17.0614 2.16663 19.0937 2.16663 20.5172 3.20121C20.977 3.53527 21.3814 3.9396 21.7154 4.39938C22.75 5.82288 22.75 7.85521 22.75 11.9166V14.0833C22.75 18.1458 22.75 20.177 21.7154 21.6005C21.3814 22.0603 20.977 22.4647 20.5172 22.7987C19.0937 23.8333 17.0614 23.8333 13 23.8333C8.93858 23.8333 6.90625 23.8333 5.48275 22.7987C5.02298 22.4647 4.61864 22.0603 4.28458 21.6005C3.70933 20.8086 3.45367 19.8293 3.341 18.4166M7.58333 9.74996H18.4167" 
      stroke="currentColor" strokeOpacity="0.65" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  </SvgIcon>
);

// Constants for each page
export const HOME = '/home';
export const CATALOG = '/catalog';
export const PROFILE = '/profile';
export const MAP = '/map';
export const REQUESTS = '/requests';

// Individual button configurations
export const HOME_BUTTON: NavbarButtonConfig = {
  href: HOME,
  icon: HomeIcon,
  title: 'Home',
};

export const CATALOG_BUTTON: NavbarButtonConfig = {
  href: CATALOG,
  icon: CatalogIcon,
  title: 'Catalog',
};

export const PROFILE_BUTTON: NavbarButtonConfig = {
  href: PROFILE,
  icon: ProfileIcon,
  title: 'Profile',
  badgeContent: 4,
};

export const MAP_BUTTON: NavbarButtonConfig = {
  href: MAP,
  icon: MapIcon,
  title: 'Map',
};

export const REQUESTS_BUTTON: NavbarButtonConfig = {
  href: REQUESTS,
  icon: RequestsIcon,
  title: 'Requests',
};

// Complete navbar configuration
export const NAVBAR_BUTTONS: NavbarButtonConfig[] = [
  HOME_BUTTON,
  CATALOG_BUTTON,
  MAP_BUTTON,
  REQUESTS_BUTTON,
  PROFILE_BUTTON,
];

// Function to get navbar button by href
export function getNavbarButtonByHref(href: string): NavbarButtonConfig | undefined {
  return NAVBAR_BUTTONS.find(button => button.href === href);
}

// Function to get all navbar button hrefs
export function getNavbarButtonHrefs(): string[] {
  return NAVBAR_BUTTONS.map(button => button.href);
} 