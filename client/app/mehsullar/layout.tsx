import { BottomNavigation } from '@/components/layout/BottomNavigation';
import { ProductActions } from '@/components/layout/ProductActions';
import React from 'react';

export default function MehsullarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative">
      <div className="bg-white">{children}</div>
      <div className="fixed bottom-13 left-0 md:hidden right-0 border-t border-gray-200 z-50">
        <ProductActions />
      </div>
    </div>
  );
}
