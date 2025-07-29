'use client';

import { SearchProductGrid } from '@/components/sections/SearchProductGrid';
import { ProductFilerSearch } from '@/components/sections/ProductFilerSearch';
import { MetaHead } from '@/components/common/MetaHead';

export default function page() {
  return (
    <div className="w-full space-y-5">
      <MetaHead
        title="Axtaris - Search Products"
        description="Explore a wide range of products available on Axtaris. Use our search and filter options to find exactly what you need."
        keywords="Axtaris, search products, product filter, online shopping"
      />
      <ProductFilerSearch />
      <SearchProductGrid />
    </div>
  );
}
