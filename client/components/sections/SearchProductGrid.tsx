import { productService } from '@/services/productService';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Loading } from '../ui/Loading';
import { Error } from '../ui/Error';
import ProductCard from '../common/ProductCard';
import { QuickPreview } from '../common/QuickPreview';
import { useInView } from 'react-intersection-observer';
import { useSearchParams } from 'next/navigation';
import { wishlistService } from '@/services/wishlistService';
import { useLocalStorageAll } from '@/hooks/useLocalStorageAll';

export const SearchProductGrid = ({ productID }: { productID?: string }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const searchParams = useSearchParams();
  const { ref, inView } = useInView();
  const limit = 12;

  const searchQuery = searchParams.get('basliq') || '';

  const { role, token } = useLocalStorageAll();
  const isWishlistEnabled = role === 'USER' && token !== undefined;
  const { data: wishData, refetch: refetchWishlist } = useQuery({
    queryKey: ['get/wishlist'],
    queryFn: () => wishlistService.getAllWishlist(),
    enabled: !!isWishlistEnabled,
  });

  const isProductInWishlist = useCallback(
    (productId: number) => {
      return wishData?.data?.some((w) => w.product.id === productId) || false;
    },
    [wishData]
  );

  const handleSelectProduct = (product: any) => {
    setSelectedProduct(product);
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ['searchProducts', searchQuery],
      queryFn: ({ pageParam = 1 }) =>
        productService.getAllProduct(pageParam, searchQuery),
      getNextPageParam: (lastPage, allPages) =>
        lastPage.data.length === limit ? allPages.length + 1 : undefined,
      getPreviousPageParam: (firstPage, allPages) =>
        firstPage.data.length === limit ? allPages.length - 1 : undefined,
      initialPageParam: 1,
    });

  const allProducts = data?.pages?.flatMap((page) => page.data) || [];

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === 'pending') {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loading />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Error message="Ürünler yüklenirken bir hata oluştu" />
      </div>
    );
  }

  if (allProducts.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>"{searchQuery}" üçün heç bir məhsul tapılmadı.</p>
        <p className="text-sm mt-2">Başqa açar sözlər cəhd edin.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 text-sm text-gray-600">
        "{searchQuery}" üçün {} məhsul tapıldı
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-6 gap-2 lg:gap-6 p-2 md:p-0">
        {allProducts.map((product, index) => {
          return (
            <ProductCard
              key={`${product.id}-${index}`} // Unique key için index ekle
              product={{
                ...product,
                sellerPhoneNumber: product.seller_id || '',
              }}
              handleSelectProduct={(prod) => handleSelectProduct(prod as any)}
              refetchWishlist={refetchWishlist}
              isInWishlist={isProductInWishlist(product.id)}
            />
          );
        })}
      </div>

      {hasNextPage && (
        <div ref={ref} className="p-6 flex justify-center">
          {isFetchingNextPage ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          ) : (
            <Loading />
          )}
        </div>
      )}

      {selectedProduct && (
        <QuickPreview
          product={selectedProduct}
          isInWishlist={isProductInWishlist}
          refetchWishlist={refetchWishlist}
        />
      )}
    </>
  );
};
