'use client';

import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  type?: 'submit' | 'button';
  onClick?: () => void;
  disabled?: boolean;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'primary-light';
}

export const Button = ({
  children,
  className = '',
  type = 'button',
  onClick,
  disabled = false,
  icon,
  variant = 'primary',
}: Props) => {
  let variantClasses = '';

  switch (variant) {
    case 'primary':
      variantClasses =
        'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700';
      break;
    case 'secondary':
      variantClasses = 'bg-gray-200 text-gray-800 hover:bg-gray-300';
      break;
    case 'outline':
      variantClasses =
        'border border-purple-500 text-purple-500 hover:bg-purple-50';
      break;
    case 'primary-light':
      variantClasses =
        'border border-purple-100 text-purple-500 bg-purple-fairy hover:bg-purple-200 text-purple-500';
      break;
    case 'danger':
      variantClasses = 'bg-red-500 text-white hover:bg-red-600';
      break;
    default:
      variantClasses = '';
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full cursor-pointer rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${variantClasses} ${className}`}
    >
      {icon && icon}
      {children}
    </button>
  );
};
