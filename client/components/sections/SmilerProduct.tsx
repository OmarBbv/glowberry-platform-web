import { productService } from '@/services/productService';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Loading } from '../ui/Loading';
import { Error } from '../ui/Error';
import ProductCard from '../common/ProductCard';
import { QuickPreview } from '../common/QuickPreview';
import { useLocalStorageAll } from '@/hooks/auth/useLocalStorageAll';
import { wishlistService } from '@/services/wishlistService';
import { MetaHead } from '@/components/common/MetaHead';
import { useAllWishlist } from '@/hooks/data/useWishlist';

const limit = 8;

export const SmilarProduct = ({ productID }: { productID: string }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const loadMoreRef = useRef(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ['get/all/similar/products', productID],
    queryFn: ({ pageParam = 1 }) =>
      productService.getSimilarProducts(productID, pageParam, limit),
    getNextPageParam: (lastPage) => {
      return lastPage.productMeta.hasNextPage
        ? lastPage.productMeta.currentPage + 1
        : undefined;
    },

    getPreviousPageParam: (firstPage) => {
      return firstPage.productMeta.hasPreviousPage
        ? firstPage.productMeta.currentPage - 1
        : undefined;
    },

    initialPageParam: 1,
  });

  const { role, token } = useLocalStorageAll();
  const isWishlistEnabled = role === 'USER' && token !== undefined;

  const { wishData, refetchWishlist } = useAllWishlist({
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

  const allProducts = data?.pages?.flatMap((page) => page.data) ?? [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

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
        <Error message="Benzer ürünler yüklenirken bir hata oluştu" />
      </div>
    );
  }

  if (allProducts.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        Henüz benzer ürün bulunamadı.
      </div>
    );
  }

  return (
    <>
      <MetaHead
        title="Benzer Ürünler - Glowberry"
        description="İlgilendiğiniz ürüne benzer diğer güzellik ve bakım ürünlerini keşfedin."
      />
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-6 gap-2 lg:gap-6 p-2 md:p-0">
        {allProducts.map((product) => {
          return (
            <ProductCard
              key={product.id}
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
        <div
          ref={loadMoreRef}
          className="h-10 flex items-center justify-center mt-4"
        >
          {isFetchingNextPage && <Loading />}
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
