'use client';

import { useImageZoom } from '@/hooks/useImageZoom';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';

interface Props {
  image: string;
  price: number;
  productTitle: string;
  discountedPrice: number;
}

export const ProductHeader = ({
  image,
  price,
  productTitle,
  discountedPrice,
}: Props) => {
  const router = useRouter();
  const { handlers, isZoomed } = useImageZoom();

  if (!productTitle || !discountedPrice || !image || !price) return null;

  return (
    <header className="w-full sticky top-0 left-0 z-20 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-[1504px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-2">
        <button
          onClick={() => router.back()}
          className="flex items-center text-sm cursor-pointer gap-2 group"
        >
          <Icon
            name="arrow-left"
            size={20}
            className="mt-0.5 text-black transition-colors group-hover:text-purple-custom!"
          />
          <span className="text-black transition-colors group-hover:text-purple-custom">
            Назад
          </span>
        </button>
      </div>

      <div className="mx-auto max-w-[1504px] w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-0">
          {/* Image + Info */}
          <div className="flex w-full lg:w-[55%] items-center gap-2">
            <div className="relative shrink-0">
              <Image
                width={100}
                height={100}
                src={image}
                alt="resim"
                className="max-w-[50px] max-h-[60px] rounded-md cursor-pointer hover:shadow-md transition-shadow duration-200"
                {...handlers}
              />
              <div
                className={`mt-4 p-3 shadow-lg rounded-md bg-white absolute top-full origin-top-left transition-all duration-300 ease-out border border-gray-200 z-20
              ${
                isZoomed
                  ? 'scale-100 opacity-100 pointer-events-auto'
                  : 'scale-50 opacity-0 pointer-events-none'
              }`}
              >
                <Image
                  width={300}
                  height={300}
                  src={image || '/placeholder.svg'}
                  alt="zoomed"
                  className="rounded-md min-w-[150px] min-h-[150px]"
                />
                <span className="text-xs font-semibold text-red-500">
                  {discountedPrice} ₽
                </span>
                <br />
                <span className="text-xs line-clamp-2 text-gray-700">
                  {productTitle}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium text-gray-900 line-clamp-2">
                {productTitle}
              </div>
              <div className="text-xs text-gray-600">
                4,9 1 151 оценка 2 шт.
              </div>
            </div>
          </div>

          {/* Price + Actions */}
          <div className="flex flex-col sm:flex-row w-full lg:flex-1 justify-end items-start sm:items-center gap-4">
            {/* Price */}
            <div className="flex flex-col items-start sm:mr-auto border-l sm:border-l border-gray-300 pl-4 sm:pl-6">
              <div className="flex items-center gap-1">
                <span className="text-red-500 font-bold text-lg">
                  {discountedPrice} ₽
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-black font-semibold text-sm">
                  {price} ₽
                </span>
                <span className="text-gray-400 line-through text-sm">
                  {price} ₽
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 text-nowrap">
              <Button type="button" className="h-[44] min-w-[144px]">
                Купить сейчас
              </Button>
              <Button
                variant="primary-light"
                type="button"
                className="h-[44] min-w-[144px]"
              >
                В корзину
              </Button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <Heart className="w-6 h-6 text-gray-600 hover:text-red-500 transition-colors duration-200" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
