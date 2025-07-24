import Link from 'next/link';
import React from 'react';
import { Icon } from '../ui/Icon';

export default function BreadCrump() {
  return (
    <nav className="text-sm hidden text-gray-400 md:flex flex-wrap items-center space-x-2 w-full">
      <Link href="/">
        <Icon name="arrow-left" size={25} />
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
