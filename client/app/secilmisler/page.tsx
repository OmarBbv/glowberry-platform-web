'use client';

import type React from 'react';

import { useMutation, useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Trash2, ShoppingCart, Star } from 'lucide-react';
import { formatDate } from '@/utils/formatDate';
import { wishlistService } from '@/services/wishlistService';
import { useLocalStorageAll } from '@/hooks/auth/useLocalStorageAll';
import { useAllWishlist } from '@/hooks/data/useWishlist';

export default function page() {
  const { role, token } = useLocalStorageAll();
  const isWishlistEnabled = role === 'USER' && token !== undefined;

  const { wishData, refetchWishlist, isError, isPending } = useAllWishlist({
    enabled: !!isWishlistEnabled,
  });

  const { mutate: removeFromWishlist } = useMutation({
    mutationFn: (wishID: string) => wishlistService.addWishlist(wishID),
    onSuccess: () => refetchWishlist(),
  });

  const { mutate: removeAllWishlist } = useMutation({
    mutationFn: () => wishlistService.deleteAllWishlist(),
    onSuccess: () => refetchWishlist(),
  });

  const handleRemoveFromWishlist = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    wishID: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromWishlist(wishID);
  };

  const handleAllRemove = () => removeAllWishlist();

  if (isPending) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Что-то пошло не так
          </h2>
          <p className="text-gray-600 mb-4">
            Не удалось загрузить избранные товары
          </p>
          <button
            onClick={() => refetchWishlist()}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Избранное</h1>
            <p className="text-gray-600">
              {wishData?.data.length}{' '}
              {wishData?.data.length === 1 ? 'товар' : 'товаров'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleAllRemove}
              className="text-gray-500 hover:text-gray-900 transition-colors underline underline-offset-2 cursor-pointer"
            >
              Очистить все
            </button>
          </div>
        </div>

        {wishData?.data.length === 0 && (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Ваш список избранного пуст
            </h2>
            <p className="text-gray-600 mb-6">
              Добавляйте товары в избранное, чтобы не потерять их
            </p>
            <Link
              href="/axtaris"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Перейти к покупкам
            </Link>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {wishData?.data.map((w) => (
            <Link
              href={`/mehsullar/${w.product.id}`}
              key={w.id}
              className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <Image
                  src={
                    w.product.images?.[0] ||
                    '/placeholder.svg?height=200&width=200'
                  }
                  alt={w.product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>

              {/* Product Info */}
              <div className="p-4">
                {/* Title */}
                <h3 className="text-sm font-medium text-gray-900 mb-2 leading-tight line-clamp-1">
                  {w.product.title}
                </h3>

                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-gray-900">
                    {w.product.price} ₽
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={(e) =>
                      handleRemoveFromWishlist(e, String(w.product.id))
                    }
                    className="flex-1 bg-purple-600 text-white text-sm py-2 px-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-1"
                  >
                    <ShoppingCart className="w-4 h-4" />В корзину
                  </button>
                  <button
                    onClick={(e) =>
                      handleRemoveFromWishlist(e, String(w.product.id))
                    }
                    className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center hover:border-red-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Date Added */}
                <p className="text-xs text-gray-400 mt-2">
                  Добавлено {formatDate(w.product.createdAt)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
