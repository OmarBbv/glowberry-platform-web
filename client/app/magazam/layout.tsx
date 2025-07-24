import StoreTopBar from '@/components/sections/StoreTopBar';
import React from 'react';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <StoreTopBar />
      {children}
    </div>
  );
}
