'use client';

import Link from 'next/link';
import React from 'react';
import { Icon } from '../ui/Icon';
import { useHoverEffect } from '@/hooks/useHoverEffect';

export default function BreadCrump() {
  const { handlers, isHovered } = useHoverEffect();

  return (
    <nav className="text-sm hidden text-gray-400 md:flex flex-wrap items-center space-x-2 w-full">
      <Link href="/" {...handlers}> 
        <Icon
          name="arrow-left"
          size={25}
          color={isHovered ? '#810bf7' : 'gray'}
        />
      </Link>
      <Link href="#" className="text-purple-600 hover:underline">
        К предыдущей странице
      </Link>
      <span>/</span>
      <Link href="/" className="hover:underline">
        Главная
      </Link>
      <span>/</span>
      <Link href="/zhenchinam" className="hover:underline">
        Женщинам
      </Link>
      <span>/</span> 
      <Link href="/zhenchinam/bryuki" className="hover:underline">
        Брюки
      </Link>
      <span>/</span>
      <span className="font-medium text-gray-900">FenixFit</span>
    </nav>
  );
}
