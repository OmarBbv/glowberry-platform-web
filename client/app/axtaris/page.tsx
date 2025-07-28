'use client';

import { SearchProductGrid } from '@/components/sections/SearchProductGrid';
import { ProductFilerSearch } from '@/components/sections/ProductFilerSearch';

export default function page() {
  return (
    <div className="w-full space-y-5">
      <ProductFilerSearch />
      <SearchProductGrid />
    </div>
  );
}
