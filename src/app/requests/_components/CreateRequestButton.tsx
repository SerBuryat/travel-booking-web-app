"use client";

import React from 'react';

interface CreateRequestButtonProps {
  href?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const CreateRequestButton: React.FC<CreateRequestButtonProps> = ({
  onClick,
  children = 'Создать заявку',
  disabled = false
}) => {
  const buttonStyle = {
    backgroundColor: disabled ? '#D1D5DB' : '#95E59D',
    borderRadius: 30,
    fontSize: 17,
    fontWeight: 400,
    padding: '8px 16px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="text-black"
      style={buttonStyle}
    >
      {children}
    </button>
  );
};
