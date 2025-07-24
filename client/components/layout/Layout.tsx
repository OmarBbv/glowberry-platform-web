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

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <Toaster position="top-right" />
      <QueryClientProvider client={client}>
        <Navbar />
        <Suspense fallback={<Loading />}>
          <main className="w-full lg:pt-5 mb-10 max-w-[1440px] mx-auto">
            {children}
          </main>
        </Suspense>
        <Footer />
        <LoginModal />
      </QueryClientProvider>
    </Provider>
  );
}
