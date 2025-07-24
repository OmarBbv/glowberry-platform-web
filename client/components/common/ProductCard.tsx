'use client';

import { BadgePercent, FileHeart, ShoppingCart, Star } from 'lucide-react';
import Image from 'next/image';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { useDispatch } from 'react-redux';
import { open } from '@/stores/slices/globalToggleSlice';
import { useRouter } from 'next/navigation';
import {
  QueryObserverResult,
  RefetchOptions,
  useMutation,
} from '@tanstack/react-query';
import { wishlistService } from '@/services/wishlistService';
import { useTokenValid } from '@/hooks/useTokenValid';
import { handleLoginOpen } from '@/stores/slices/loginSlice';
import { formatDate } from '@/utils/formatDate';
import { useLocalStorageAll } from '@/hooks/useLocalStorageAll';

interface Props {
  product: IProduct;
  handleSelectProduct?: (product: IProduct) => void;
  isInWishlist?: boolean | undefined;
  refetchWishlist?: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<IApiWishResponse, Error>>;
}

export default function ProductCard({
  product,
  handleSelectProduct,
  isInWishlist,
  refetchWishlist,
}: Props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useTokenValid();
  const { role } = useLocalStorageAll();

  const [localIsInWishlist, setLocalIsInWishlist] = useState<
    boolean | undefined
  >(isInWishlist);

  const handleQuick = (e: React.MouseEvent) => {
    handleSelectProduct?.(product);
    e.stopPropagation();
    dispatch(open());
    document.body.style.overflow = 'hidden';
  };

  const handleRouteProduct = () => {
    router.push(`/mehsullar/${product.id}`);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => wishlistService.addWishlist(id),
    onSuccess: (data: IApiWishResponse) => {
      refetchWishlist?.();
    },
    onError: (error) => {
      console.log('error wishlist', error);
      setLocalIsInWishlist(isInWishlist);
    },
  });

  const handleWishList = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!token) dispatch(handleLoginOpen());
    if (role === 'USER') {
      mutate(String(product.id));
      setLocalIsInWishlist(!localIsInWishlist);
    }
  };

  useEffect(() => {
    setLocalIsInWishlist(isInWishlist);
  }, [isInWishlist]);

  return (
    <div
      onClick={handleRouteProduct}
      className="flex flex-col gap-2 cursor-pointer"
    >
      <div className="w-full h-[170px] lg:h-[250px] rounded-t-2xl relative overflow-hidden group">
        <Image
          src={
            product.images[0] ??
            'https://via.placeholder.com/300x300?text=Görsel+Yok'
          }
          width={1000}
          height={1000}
          className="w-full h-full object-cover rounded-2xl"
          alt={product.title}
        />
        <button
          className={`absolute cursor-pointer top-1 right-2 m-2 p-2 rounded-full transition-all duration-200 ${
            localIsInWishlist
              ? 'bg-violet-custom text-white'
              : 'bg-white/50 hover:bg-white'
          } ${isPending ? 'opacity-70' : ''}`}
          onClick={handleWishList}
          disabled={isPending}
        >
          <Icon
            name="heart"
            size={16}
            color={localIsInWishlist ? 'white' : 'black'}
          />
        </button>
        <div className="hidden group-hover:flex items-center justify-center absolute bottom-2 left-1/2 -translate-x-1/2 w-full">
          <button
            onClick={handleQuick}
            className="bg-white/90 w-4/5 rounded-md py-2 cursor-pointer"
          >
            Быстрый просмотр
          </button>
        </div>
      </div>
      <div className="bg-white text-xs space-y-1">
        {/* Discount Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-red-600">
            <BadgePercent size={18} />
            <span className="text-sm lg:text-lg font-bold">
              {product.discounted_price &&
              parseFloat(product.discounted_price) > 0
                ? product.discounted_price
                : product.price}{' '}
              ₼
            </span>
          </div>
          {product.discounted_price &&
            parseFloat(product.discounted_price) > 0 && (
              <span className="text-gray-400 line-through text-sm">
                {product.price} ₼
              </span>
            )}
        </div>

        {/* Seller Info */}
        <div className="text-red-600 line-clamp-1 text-xs lg:text-sm">
          {product.title}
        </div>

        {/* Product Name */}
        <div className="space-y-1 my-1">
          <div className="font-semibold text-gray-900 text-sm lg:text-base">
            {product.companyName}
          </div>
          <div className="text-gray-600 line-clamp-1 text-xs lg:text-sm">
            {product.description}
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star size={12} className="fill-orange-400 text-orange-400" />
            <span className="font-semibold text-gray-900 text-[10px] lg:text-sm">
              4,7
            </span>
          </div>
          <span className="text-gray-500 text-[10px] lg:text-sm">
            • 1 627 оценок
          </span>
        </div>

        {/* Purchase Button */}
        <Button
          variant="primary"
          className="px-4 h-[40px]"
          icon={<ShoppingCart size={18} />}
        >
          {formatDate(product.createdAt)}
        </Button>
      </div>
    </div>
  );
}
