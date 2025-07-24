'use client';

import HeroBanner from '@/components/sections/HeroBanner';
import ProductGrid from '@/components/sections/ProductGrid';

export default function Home() {
  return (
    <main className="space-y-5">
      <HeroBanner />
      <ProductGrid />
    </main>
  );
}
