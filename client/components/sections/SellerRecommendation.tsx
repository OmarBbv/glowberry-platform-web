'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '../ui/Icon';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { useInfiniteQuery } from '@tanstack/react-query';
import { productService } from '@/services/productService';
import { Loading } from '../ui/Loading';
import { Error } from '../ui/Error';

interface Props {
  productID: string;
}

export const SellerRecommendation = ({ productID: id }: Props) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['get/seller-similar-product', id],
    queryFn: ({ pageParam = 1 }) => {
      return productService.getSimilarProductsBySeller(id, pageParam);
    },
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNextPage
        ? lastPage.pagination.page + 1
        : undefined;
    },
    initialPageParam: 1,
  });

  const allProducts = data?.pages.flatMap((page) => page.data) ?? [];

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);

    const { activeIndex, slides } = swiper;
    const shouldLoadNext = activeIndex > slides.length - 5;

    if (shouldLoadNext && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <Error />;
  if (!allProducts.length) return null;

  return (
    <div className="w-full rounded-lg">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
        Продавец рекомендует
      </h2>

      <div className="relative">
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={handleSlideChange}
          spaceBetween={12}
          slidesPerView="auto"
          breakpoints={{
            640: {
              spaceBetween: 16,
            },
            1024: {
              spaceBetween: 24,
            },
          }}
          modules={[Navigation]}
          className="!pb-2"
        >
          {allProducts.map((product) => {
            const discountPercentage = product.discounted_price
              ? Math.round(
                  ((parseFloat(product.price) -
                    parseFloat(product.discounted_price)) /
                    parseFloat(product.price)) *
                    100
                )
              : 0;

            return (
              <SwiperSlide key={product.id} className="!w-auto">
                <Link href={`/mehsullar/${product.id}`}>
                  <div className="w-[140px] select-none h-[240px] sm:w-[160px] sm:h-[280px] lg:w-[178px] lg:h-[318px] bg-white shrink-0 rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-full h-[70%] relative">
                      <Image
                        src={product.images[0] || '/next.svg'}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                      {discountPercentage > 0 && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded">
                          -{discountPercentage}%
                        </div>
                      )}
                    </div>

                    <div className="w-full h-[30%] px-2 sm:px-3 py-2 flex flex-col justify-between">
                      <div className="text-red-600 font-semibold text-sm sm:text-base">
                        {product.discounted_price
                          ? product.discounted_price
                          : product.price}{' '}
                        ₽
                        {product.discounted_price && (
                          <span className="text-gray-500 line-through text-xs ml-1">
                            {product.price} ₽
                          </span>
                        )}
                      </div>
                      <div className="text-gray-800 text-xs sm:text-sm line-clamp-2 leading-tight">
                        {product.title}
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 text-xs">
                        <span className="flex items-center">
                          <span className="text-orange-400 mr-1">⭐</span>
                          4.5
                        </span>
                        <span>•</span>
                        <span>{product.views} görüntüleme</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}

          {isFetchingNextPage && (
            <SwiperSlide className="!w-auto">
              <div className="w-[140px] select-none h-[240px] sm:w-[160px] sm:h-[280px] lg:w-[178px] lg:h-[318px] bg-gray-100 shrink-0 rounded-xl overflow-hidden flex items-center justify-center">
                <Loading />
              </div>
            </SwiperSlide>
          )}
        </Swiper>

        <button
          onClick={handlePrev}
          className={`hidden sm:block absolute top-1/2 -left-4 lg:-left-6 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md rounded-full z-10 p-2 lg:p-3 transition-all duration-300 ${
            isBeginning ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          aria-label="Previous slide"
        >
          <Icon name="arrow-left" size={16} className="lg:w-5 lg:h-5" />
        </button>

        <button
          onClick={handleNext}
          className={`hidden sm:block absolute top-1/2 -right-4 lg:-right-6 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md rounded-full z-10 p-2 lg:p-3 transition-all duration-300 ${
            isEnd ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          aria-label="Next slide"
        >
          <Icon name="arrow-right" size={16} className="lg:w-5 lg:h-5" />
        </button>
      </div>
    </div>
  );
};
