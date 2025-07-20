'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { NavbarButton } from './NavbarButton';
import { SvgIconProps } from '@mui/material/SvgIcon';

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
      <div className="flex gap-12 rounded-full px-6 py-2 justify-between w-full" style={{ background: '#F6F6F6' }}>
        {buttons.map((btn) => (
          <NavbarButton
            key={btn.href}
            href={btn.href}
            icon={btn.icon}
            title={btn.title}
            active={pathname === btn.href}
            badgeContent={btn.badgeContent}
          />
        ))}
      </div>
    </nav>
  );
}; 