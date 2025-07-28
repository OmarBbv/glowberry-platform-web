import { productService } from '@/services/productService';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Loading } from '../ui/Loading';
import { Error } from '../ui/Error';
import ProductCard from '../common/ProductCard';
import { QuickPreview } from '../common/QuickPreview';
import { useCallback, useState, useRef, useEffect } from 'react';
import { wishlistService } from '@/services/wishlistService';
import { useLocalStorageAll } from '@/hooks/useLocalStorageAll';

export default function ProductGrid() {
  const { role, token } = useLocalStorageAll();
  const [selectProduct, setSelectProduct] = useState<IProduct | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const isWishlistEnabled = role === 'USER' && token !== undefined;

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['get/all/products'],
    queryFn: ({ pageParam = 1 }) => productService.getAllProduct(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.filters.pagination;
      return pagination.hasNextPage ? pagination.currentPage + 1 : undefined;
    },
  });

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

  const handleSelectProduct = (product: IProduct) => setSelectProduct(product);
  const allProducts = data?.pages.flatMap((page) => page.data) ?? [];

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) return <Loading />;
  if (isError) return <Error />;

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-6 gap-2 lg:gap-6 p-2 md:p-0">
        {allProducts.map((product) => {
          return (
            <ProductCard
              key={product.id}
              isInWishlist={isProductInWishlist(product.id)}
              product={product}
              handleSelectProduct={handleSelectProduct}
              refetchWishlist={refetchWishlist}
            />
          );
        })}
      </div>

      {hasNextPage && (
        <div
          ref={loadMoreRef}
          className="h-10 flex items-center justify-center"
        >
          {isFetchingNextPage && <Loading />}
        </div>
      )}

      {selectProduct !== null && (
        <QuickPreview
          product={selectProduct}
          isInWishlist={isProductInWishlist}
          refetchWishlist={refetchWishlist}
        />
      )}
    </div>
  );
}
