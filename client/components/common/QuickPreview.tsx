'use client';

import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Zoom, Thumbs } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';
import chechkIcon from '@/public/icons/BadgeCheck.svg';
import { close } from '@/stores/slices/globalToggleSlice';
import { RootState } from '@/stores/store';

import {
  QueryObserverResult,
  RefetchOptions,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { productService } from '@/services/productService';
import { useRouter } from 'next/navigation';
import { useImageZoom } from '@/hooks/useImageZoom';
import { wishlistService } from '@/services/wishlistService';
import { useLocalStorageAll } from '@/hooks/useLocalStorageAll';
import { useTokenValid } from '@/hooks/useTokenValid';
import { handleLoginOpen } from '@/stores/slices/loginSlice';

interface Props {
  product: IProduct;
  isInWishlist?: (productId: number) => boolean;
  refetchWishlist?: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<IApiWishResponse, Error>>;
}

export const QuickPreview = ({
  product,
  isInWishlist,
  refetchWishlist,
}: Props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isOpen } = useSelector((state: RootState) => state.popup);
  const [activeIndex, setActiveIndex] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const token = useTokenValid();
  const isProductInWishlist = isInWishlist?.(product.id) ?? false;
  const [isShowMore, setIsShowMore] = useState(false);
  // const { handlers, isZoomed } = useImageZoom();

  const { data: comments } = useQuery({
    queryKey: ['get/product/comment/preview'],
    queryFn: () => productService.getProductByIdComment(String(product.id)),
    enabled: !!product.id,
  });

  const averageRating = comments?.ratings.averageRating;
  const totalRatings = comments?.ratings.totalRatings;

  const { mutate: wishMutate } = useMutation({
    mutationFn: (id: string) => wishlistService.addWishlist(id),
    onSuccess: () => refetchWishlist?.(),
  });

  const handleWishList = (productId: string) => {
    if (!productId) return;

    if (!token) {
      dispatch(handleLoginOpen());
      return;
    }

    wishMutate(productId);
  };

  const handleClose = () => {
    setIsShowMore(false);
    dispatch(close());
    document.body.style.paddingRight = '';
    document.body.style.overflow = 'visible';
  };

  const handleRouterForProduct = () => {
    if (!product.id) return;
    document.body.style.paddingRight = '';
    router.push(`/mehsullar/${product.id}`);
    document.body.style.overflow = '';
  };

  return (
    <>
      <div
        onClick={handleClose}
        className={`inset-0 fixed z-[999] bg-black/20 w-full h-screen ${
          isOpen ? 'block' : 'hidden'
        }`}
      ></div>
      <section
        className={`max-w-[1000px] rounded-2xl overflow-hidden fixed top-1/2 -translate-y-1/2 z-[999] left-1/2 -translate-x-1/2 mx-auto w-full bg-white max-h-[600px] ${
          isOpen ? 'flex' : 'hidden'
        }`}
      >
        <div className="w-1/2 relative">
          <Swiper
            modules={[Navigation, Pagination, Zoom, Thumbs]}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            // zoom={true}
            thumbs={{ swiper: thumbsSwiper }}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            className="h-full w-full"
          >
            {product?.images?.map((image, index) => (
              <SwiperSlide
                key={index}
                className="flex items-center justify-center"
              >
                <div className="swiper-zoom-container">
                  <Image
                    src={image}
                    alt={`Product image ${index + 1}`}
                    width={500}
                    height={500}
                    className="object-contain h-full w-full max-h-[600px]"
                  />
                </div>
              </SwiperSlide>
            ))}

            {/* Navigation buttons */}
            <div className="swiper-button-prev !text-white !bg-black/50 !w-10 !h-10 !rounded-full after:!text-sm after:!font-bold"></div>
            <div className="swiper-button-next !text-white !bg-black/50 !w-10 !h-10 !rounded-full after:!text-sm after:!font-bold"></div>
          </Swiper>

          {/* Image counter */}
          <div className="absolute z-50 bg-white rounded-2xl px-3 bottom-3 left-3">
            <span className="text-sm tracking-wider font-medium">
              {activeIndex + 1}/{product?.images?.length || 0}
            </span>
          </div>
        </div>

        {/* right */}
        <div className="w-1/2 relative">
          <button
            onClick={handleClose}
            className="absolute right-3 top-3 cursor-pointer z-50 p-1 hover:bg-gray-200 rounded-md"
          >
            <Icon
              name="x"
              size={20}
              className="cursor-pointer"
              color="#6c757d"
            />
          </button>
          {/* header */}
          <div className="sticky left-0 w-full top-0 px-8 pt-8 pb-2">
            <p className="text-[25px] line-clamp-1 font-semibold tracking-wide">
              {product.title}
            </p>
            <div className="flex items-center gap-1 text-sm font-medium">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Icon name="star" fill="#FFD700" strokeWidth={0} size={18} />
                  <span>{averageRating}</span>
                </div>
                <span>.</span>
                <div className="flex items-center gap-1">
                  <span>{totalRatings} оценок</span>
                  <Icon
                    name="arrow-right"
                    size={10}
                    className="text-white"
                    strokeWidth={1}
                  />
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <Image src={chechkIcon} width={16} height={16} alt="icon" />
                <span>Оригинал</span>
              </div>
              <div className="text-xs flex items-center gap-1">
                <span>Арт: {product.id}</span>
                <button className="cursor-pointer">
                  <Icon name="copy" size={16} />
                </button>
              </div>
            </div>
          </div>
          {/* bottom */}

          {/* main overflow content */}
          <div
            id="scroll-container"
            className="px-8 py-2 max-h-[500px] overflow-auto space-y-5"
          >
            <div className="mt-2 flex items-center">
              <span className="text-2xl block text-red-custom font-semibold tracking-wide leading-3">
                {product.discounted_price &&
                parseFloat(product.discounted_price) > 0
                  ? product.discounted_price
                  : product.price}{' '}
                AZN
              </span>
              <div>
                {product.discounted_price &&
                  parseFloat(product.discounted_price) > 0 && (
                    <span className="text-lg text-gray-400 line-through ml-2">
                      {product.price} AZN
                    </span>
                  )}
              </div>
            </div>
            <div className="inline-flex px-2 rounded-xl items-center gap-2 bg-[#E8E8F0] cursor-pointer">
              <Icon name="thumbsup" size={15} fill="#A73AFD" strokeWidth={0} />
              <span>Хорошая цена</span>
            </div>

            <div className="w-full bg-white space-y-3">
              <h3 className="text-gray-800 font-semibold text-sm border-b border-b-gray-300 pb-2">
                Ürün Özellikleri
              </h3>
              <div className="flex flex-col text-sm">
                <span className={!isShowMore ? 'line-clamp-2' : ''}>
                  {product.description}
                </span>
                <button
                  onClick={() => setIsShowMore((prev) => !prev)}
                  className="font-medium text-xs text-primary self-end cursor-pointer hover:underline"
                >
                  {isShowMore ? 'Скрыть' : 'Показать больше'}
                </button>
              </div>
            </div>

            {/* Thumbnail swiper */}
            <div className="relative">
              <Swiper
                modules={[Thumbs]}
                onSwiper={setThumbsSwiper}
                slidesPerView="auto"
                watchSlidesProgress={true}
                className="thumbnail-swiper"
              >
                {product?.images?.map((image, index) => (
                  <SwiperSlide
                    key={index}
                    className="cursor-pointer py-2 ml-2 max-h-[250px] max-w-[57px] relative"
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      width={90}
                      height={90}
                      className={`rounded-md h-[76px] object-cover w-full select-none ${
                        activeIndex === index
                          ? 'ring-2 ring-offset-1 ring-purple-custom'
                          : ''
                      }`}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="flex items-center gap-2">
              <div className="space-y-2 w-full">
                <Button className="p-2">В корзину</Button>
                <Button className="p-2" variant="primary-light">
                  Купить сейчас
                </Button>
              </div>
              <button
                onClick={() => handleWishList(String(product.id))}
                className="cursor-pointer p-2 hover:bg-gray-100 rounded-full"
              >
                <Icon
                  name="heart"
                  size={20}
                  className="sm:w-6 sm:h-6"
                  color={isProductInWishlist ? '#AA41FF' : 'gray'}
                  fill={isProductInWishlist ? '#AA41FF' : 'gray'}
                />
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-sm mb-[70px]">
              <Icon name="left-right" size={20} color="#AB43FF" />
              <span>14 дней на возврат</span>
            </div>
          </div>
          <div className="fixed bg-white z-40 bottom-0 right-0 shadow-md w-1/2 p-4 border-t-gray-200 border-t-2 flex items-center justify-center">
            <button
              onClick={handleRouterForProduct}
              className="hover:underline hover:text-violet-custom cursor-pointer underline-offset-2"
            >
              Больше информации о товаре
            </button>
          </div>
        </div>
      </section>
    </>
  );
};
