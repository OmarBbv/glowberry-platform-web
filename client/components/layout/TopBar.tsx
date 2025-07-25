'use client';
import { MapPin, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = ['Товары', 'Авиабилет', 'Авиабилет'];

interface Props {
  location: string | null;
}

export default function TopBar({ location }: Props) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const loc = location?.split(' ');

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center justify-between py-1.5">
        {/* Location Section */}
        <div className="flex items-center min-w-0 flex-shrink-0">
          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/70 backdrop-blur-sm border border-gray-200/50 hover:bg-white/90 transition-all duration-200 cursor-pointer group">
            <MapPin className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-700 transition-colors" />
            <span className="text-xs font-medium text-gray-700 truncate">
              {location !== null ? loc?.[0] : 'Адрес'}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 flex ml-[200px] px-3">
          <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200/50 p-0.5 shadow-sm">
            {navItems.map((item, index) => (
              <button
                key={index}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                  index === 0
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 text-xs font-medium text-white">
          <a
            href="#"
            className="hover:text-gray-900 transition-colors whitespace-nowrap"
          >
            Для бизнеса
          </a>
          <a
            href="#"
            className="hover:text-gray-900 transition-colors whitespace-nowrap"
          >
            Работа в Wildberries
          </a>
          <div className="px-2 py-1 bg-white/70 rounded-md border border-gray-200/50 text-gray-700 font-semibold">
            RUB
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden bg-gradient-to-r from-slate-50 to-gray-100 border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Location */}
          <div className="inline-flex items-center gap-2 px-2 py-1 rounded-lg bg-white/70 backdrop-blur-sm border border-gray-200/50">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 truncate max-w-[120px]">
              {location !== null ? loc?.[0] : 'Адрес'}
            </span>
          </div>

          {/* Currency */}
          <div className="px-3 py-1.5 bg-white/70 rounded-lg border border-gray-200/50 text-sm font-semibold text-gray-700">
            RUB
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-white/70 border border-gray-200/50 hover:bg-white/90 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-gray-600" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="px-4 pb-4 bg-white/90 backdrop-blur-sm border-t border-gray-200/50">
            {/* Navigation Items */}
            <div className="flex flex-wrap gap-2 mb-4">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    index === 0
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Business Links */}
            <div className="flex flex-col gap-2 text-sm">
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors py-1"
              >
                Для бизнеса
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors py-1"
              >
                Работа в Wildberries
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
