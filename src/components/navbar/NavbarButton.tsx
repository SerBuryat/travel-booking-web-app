import React from 'react';
import Link from 'next/link';
import { SvgIconProps } from '@mui/material/SvgIcon';
import Badge from '@mui/material/Badge';

interface NavbarButtonProps {
  href: string;
  icon: React.ComponentType<SvgIconProps>;
  title: string;
  active: boolean;
  badgeContent?: number;
}

export const NavbarButton: React.FC<NavbarButtonProps> = ({ href, icon: Icon, title, active, badgeContent }) => (
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