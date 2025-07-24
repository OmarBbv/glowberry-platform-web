'use client';

import { handleLoginOpen } from '@/stores/slices/loginSlice';
import TopBar from './TopBar';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { Search } from '../sections/Search';
import { Icon } from '../ui/Icon';
import { usePathname, useRouter } from 'next/navigation';
import { getLocation } from '@/utils/getLocation';
import { reverseGeocode } from '@/services/locationService';
import React, { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import { useLocation } from '@/hooks/useLocation';

interface User {
  id: string;
  phoneNumber: string;
}

interface UserDataTokenType {
  message: string;
  token: string;
  refreshToken: string;
  user?: User;
  seller?: any;
}

export default function Navbar() {
  const dispatch = useDispatch();
  const [localData, setLocalData] = useState<UserDataTokenType | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const pathname = usePathname();
  let path = pathname === '/';

  console.log(path);

  const handleRouterStore = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  const { mutate } = useMutation({
    mutationFn: async () => await authService.logout(),
    onSuccess: (data) => {
      localStorage.clear();
      window.location.reload();
    },
    onError: (data) => console.log('cixis olarken xeta oldu', data),
  });

  const handleLogout = () => mutate();
  const handleToggleDropdown = () => setIsOpen((prev) => !prev);

  const handleLoginModalOpen = () => dispatch(handleLoginOpen());
  const handleRouterWish = () => router.push('/secilmisler');

  useEffect(() => {
    const local = localStorage.getItem('data');
    if (local) {
      try {
        setLocalData(JSON.parse(local));
      } catch (err) {
        console.error(
          'LocalStorage verisi çözümlenemedi, veri temizleniyor:',
          err
        );
        localStorage.removeItem('data');
      }
    }
  }, []);

  return (
    <nav
      className={`lg:px-10 px-2 space-y-1 p-2 lg:pb-3 lg:py-1 bg-gradient-to-r from-purple-custom via-violet-light-custom to-violet-custom ${
        path ? 'sticky top-0 left-0' : 'block'
      } w-full z-[999]`}
    >
      <div className="max-w-[1440px] mx-auto ">
        <TopBar />
        <div className="flex items-center gap-4 flex-1">
          <div className="hidden lg:flex items-center gap-2">
            <h1 className="text-[40px] text-white font-semibold">
              <Link href="/">Glowberry</Link>
            </h1>
            <button className="cursor-pointer p-4 font-medium rounded-lg border text-white border-white h-full">
              <Menu width={24} height={24} />
            </button>
          </div>
          <Search />
          <button
            onClick={() => useLocation()}
            className="flex flex-col cursor-pointer gap-1 items-center"
          >
            <Icon name="location" size={25} color="#fff" />
            <span className="hidden lg:flex text-gray-200/60 text-sm">
              Адреса
            </span>
          </button>
          <div className="hidden lg:flex items-center gap-4">
            {!localData ? (
              <button
                type="button"
                onClick={handleLoginModalOpen}
                className="flex flex-col cursor-pointer gap-1 items-center"
              >
                <Icon name="user" size={25} color="#fff" />
                <span className="text-gray-200/60 text-sm">Войти</span>
              </button>
            ) : (
              <div className="flex flex-col cursor-pointer gap-1 items-center relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleToggleDropdown();
                  }}
                  className="cursor-pointer z-[60]"
                >
                  <Icon name="user" size={25} color="#fff" />
                  <span className="text-gray-200/60 text-sm">me</span>
                </button>

                {isOpen && (
                  <>
                    <div
                      onClick={() => setIsOpen(false)}
                      className="fixed inset-0 bg-black/20 z-50"
                    ></div>
                    <div className="hidden lg:block absolute top-full mt-3 right-0 z-50 bg-white min-w-[300px] p-4 rounded-xl shadow-md">
                      <div className="flex items-center gap-3 border-b border-b-gray-300 pb-3">
                        <div className="w-10 h-10 flex items-center justify-center bg-orange-100 rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-violet-custom"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5.121 17.804A7 7 0 0112 15a7 7 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="text-violet-custom font-bold">
                            {localData?.user?.phoneNumber}
                            {localData?.seller?.phoneNumber}
                          </div>
                          <div className="text-gray-500 text-sm">
                            Profil nömrəsi: {localData?.user?.id}
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 space-y-2 text-gray-700 text-[15px] flex flex-col items-start">
                        <ProtectedRoute>
                          <button
                            onClick={() => handleRouterStore('/magazam')}
                            className="cursor-pointer hover:text-purple-custom transition"
                          >
                            Mağazam
                          </button>
                        </ProtectedRoute>
                        <button className="cursor-pointer hover:text-purple-custom transition">
                          Şəxsi hesabı artır
                        </button>
                        <button
                          onClick={() => handleRouterStore('/secilmisler')}
                          className="cursor-pointer hover:text-purple-custom transition"
                        >
                          Seçilmişlər
                        </button>
                        <div className="h-[1px] bg-gray-300 w-full" />
                        <button
                          onClick={handleLogout}
                          className="cursor-pointer hover:text-purple-custom transition"
                        >
                          Çıxış
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
            <button
              onClick={handleRouterWish}
              className="flex flex-col cursor-pointer gap-1 items-center"
            >
              <Icon name="heart" size={25} color="#fff" />
              <span className="text-gray-200/60 text-sm">Корзина</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
