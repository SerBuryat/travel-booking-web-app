import React from 'react';
import Link from 'next/link';

interface NavbarButtonProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  active: boolean;
}

export const NavbarButton: React.FC<NavbarButtonProps> = ({ href, icon, title, active }) => (
  <Link href={href} className="flex flex-col items-center">
    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: active ? '#007AFF' : '#545458A6' }}>
      {icon}
    </span>
    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 10, marginTop: 2, color: active ? '#007AFF' : '#545458A6' }}>{title}</span>
  </Link>
); 