'use client';

import React, { Suspense } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import LoginModal from '../common/LoginModal';
import { Provider } from 'react-redux';
import { store } from '@/stores/store';
import { Loading } from '../ui/Loading';
import { QueryClientProvider } from '@tanstack/react-query';
import client from '@/utils/query';
import { Toaster } from 'react-hot-toast';
import { usePathname } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  const lastSegment = segments[segments.length - 1];

  const pathLastSegment = lastSegment
    ? ['reyler', 'salam'].some((word) => lastSegment.includes(word))
    : false;

  return (
    <Provider store={store}>
      <Toaster position="top-right" />
      <QueryClientProvider client={client}>
        <Navbar />
        <Suspense fallback={<Loading />}>
          <main
            className={`w-full ${
              pathLastSegment
                ? 'w-full'
                : 'max-w-[1440px] mx-auto mb-10 lg:pt-5'
            }`}
          >
            {children}
          </main>
        </Suspense>
        <Footer />
        <LoginModal />
      </QueryClientProvider>
    </Provider>
  );
}
