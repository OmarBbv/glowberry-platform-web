'use client';

import { Home, Menu, ShoppingCart, Heart, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const BottomNavigation = () => {
  const pathname = usePathname(); // ✅ pathname alınır

  const isActive = (href: string) => pathname === href;

  return (
    <div className="fixed md:hidden bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-[52px] z-50">
      <div className="flex items-center justify-around h-full">
        <Link
          href="/"
          className={`p-3 transition-colors ${
            isActive('/') ? 'text-black' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Home className="w-6 h-6" />
        </Link>

        <button className="p-3 text-gray-400 hover:text-gray-600 transition-colors">
          <Menu className="w-6 h-6" />
        </button>

        <button className="p-3 text-gray-400 hover:text-gray-600 transition-colors relative">
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute top-1 -right-1 bg-red-500 text-white text-[9px] rounded-full w-5 h-5 flex items-center justify-center font-medium">
            3
          </span>
        </button>

        <Link
          href="/secilmisler"
          className={`p-3 transition-colors ${
            isActive('/secilmisler')
              ? 'text-black'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Heart className="w-6 h-6" />
        </Link>

        <button className="p-3 text-gray-400 hover:text-gray-600 transition-colors">
          <User className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
