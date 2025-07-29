'use client';

import BreadCrump from '@/components/sections/BreadCrump';
import { Icon } from '@/components/ui/Icon';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ReviewsSection } from '@/components/sections/ReviewsSection';
import { useMutation } from '@tanstack/react-query';
import { Loading } from '@/components/ui/Loading';
import { Error } from '@/components/ui/Error';
import { useState, useEffect, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Zoom, FreeMode, Thumbs } from 'swiper/modules';
import Image from 'next/image';
import { formatDate } from '@/utils/formatDate';
import { CreateComment } from '@/components/sections/CreateComment';
import { useRouter } from 'next/navigation';
import { useTokenValid } from '@/hooks/auth/useTokenValid';
import { useDispatch, useSelector } from 'react-redux';
import { handleLoginOpen } from '@/stores/slices/loginSlice';
import SpecificationsAndDescription from '@/components/sections/SpecificationsAndDescription';
import { wishlistService } from '@/services/wishlistService';
import { ShareButton } from '@/components/ui/ShareButton';
import { SmilarProduct } from '@/components/sections/SmilerProduct';
import { useLocalStorageAll } from '@/hooks/auth/useLocalStorageAll';
import { useScrollWidth } from '@/hooks/device/useScrollWidth';
import { RootState } from '@/stores/store';
import { ShareProductModal } from '@/components/common/ShareProductModal';
import Link from 'next/link';
import { useImageHoverZoom } from '@/hooks/ui/useImageHoverZoom';
import { useProductById } from '@/hooks/data/useProduct';
import { useCommentsByProductId } from '@/hooks/data/useComment';
import { useAllWishlist } from '@/hooks/data/useWishlist';

export default function page() {
  const { id } = useParams();

  const safeId = Array.isArray(id) ? id[0] : id;

  if (!id) return null;

  const scroll = useScrollWidth();

  const productId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();

  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mainSwiper, setMainSwiper] = useState<any>(null);
  const [commentIsOpen, setCommentIsOpen] = useState(false);
  const { isShowShareModal } = useSelector((state: RootState) => state.popup);
  const dispatch = useDispatch();
  const token = useTokenValid();
  const [isSpecificationOpen, setIsSpecificationOpen] = useState(false);
  const [isWish, setIsWish] = useState(false);
  const { role } = useLocalStorageAll();

  const { isError, isLoading, product } = useProductById({
    id: safeId!,
    productId,
  });

  const { comments } = useCommentsByProductId({
    productId,
    enabled: !!safeId,
  });

  const isWishlistEnabled = role === 'USER' && product !== undefined && token;

  const { wishData, refetchWishlist } = useAllWishlist({
    enabled: !!isWishlistEnabled,
  });

  const handleBackRouter = () => router.back();

  const handleThumbClick = (index: number) => {
    setActiveIndex(index);
    if (mainSwiper) {
      mainSwiper.slideTo(index);
    }
  };

  const handleWhatsappRedirect = () => {
    if (!token) return dispatch(handleLoginOpen());

    const cleanedNumber = product?.sellerPhoneNumber.replace(/\D/g, '');
    const currentUrl = window.location.href;

    const message = `Merhaba, "${product?.title}" ürünü hakkında bilgi almak istiyorum. Ürün linki: ${currentUrl}`;

    const encodedMessage = encodeURIComponent(message);

    const url = `https://wa.me/${cleanedNumber}?text=${encodedMessage}`;

    window.open(url, '_blank');
  };

  const handleCommentProduct = () => {
    token ? setCommentIsOpen(true) : dispatch(handleLoginOpen());
  };

  const { mutate: wishMutate } = useMutation({
    mutationFn: (id: string) => wishlistService.addWishlist(id),
    onSuccess: () => refetchWishlist(),
  });

  const handleToggleWishlist = (productId: string) => {
    if (role === 'USER') wishMutate(productId);
    return;
  };

  const allWish = wishData?.data.map((w) => w.product.id);

  const isWishData = useMemo(
    () => allWish?.includes(Number(productId)),
    [allWish, productId]
  );
  const { handleMouseMove, handleMouseLeave } = useImageHoverZoom();

  useEffect(() => {
    setIsWish(!!isWishData);
  }, [isWishData]);

  useEffect(() => {
    if (thumbsSwiper && activeIndex !== undefined) {
      thumbsSwiper.slideTo(activeIndex);
    }
  }, [activeIndex, thumbsSwiper]);

  if (isLoading) return <Loading />;
  if (isError) return <Error />;

  return (
    <main className="space-y-6 lg:space-y-10 lg:px-0 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 lg:mb-6 gap-4">
        <div className="w-full sm:w-auto">
          <BreadCrump />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={handleBackRouter}
            className="mr-auto md:hidden flex items-center gap-2"
          >
            <Icon name="arrow-left" size={20} />
            <span>Назад</span>
          </button>

          <button
            onClick={() => handleToggleWishlist(productId)}
            className="cursor-pointer p-2 hover:bg-gray-100 rounded-full"
          >
            <Icon
              name="heart"
              size={20}
              className="sm:w-6 sm:h-6"
              color={isWish ? '#AA41FF' : 'gray'}
              fill={isWish ? '#AA41FF' : 'gray'}
            />
          </button>

          <ShareButton
            title="Harika bir ürün"
            text="Bu ürünü kesinlikle görmelisin!"
          />

          <button className="cursor-pointer p-2 hover:bg-gray-100 rounded-full">
            <Icon
              name="message-circle-warning"
              size={20}
              className="sm:w-6 sm:h-6"
            />
          </button>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-6 px-4 lg:px-0 lg:gap-4">
        <div className="w-full lg:w-[600px] order-1">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="hidden sm:block max-h-[400px] lg:max-h-[600px] w-full sm:w-[80px] lg:w-[112px]">
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={8}
                slidesPerView="auto"
                freeMode={true}
                watchSlidesProgress={true}
                direction="vertical"
                modules={[FreeMode, Navigation, Thumbs]}
                className="h-full"
              >
                {product?.images.map((image, index) => (
                  <SwiperSlide
                    key={index}
                    className="cursor-pointer flex justify-center items-center !h-[72px] p-2"
                  >
                    <div
                      onClick={() => handleThumbClick(index)}
                      className={`relative w-[64px] aspect-square rounded-md ${
                        activeIndex === index ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      <div className="absolute inset-0 overflow-hidden rounded-md">
                        <Image
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="w-full sm:flex-1 h-[200px] lg:h-auto max-w-[500px] relative">
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
                zoom={true}
                thumbs={{ swiper: thumbsSwiper }}
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                className="h-full w-full"
              >
                {product?.images?.map((image, index) => (
                  <SwiperSlide
                    key={index}
                    className="flex items-center justify-center"
                  >
                    <div className="swiper-zoom-container max-h-[600px]">
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

                <div className="swiper-button-prev !text-white !bg-black/50 !w-10 !h-10 !rounded-full after:!text-sm after:!font-bold"></div>
                <div className="swiper-button-next !text-white !bg-black/50 !w-10 !h-10 !rounded-full after:!text-sm after:!font-bold"></div>
              </Swiper>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[500px] order-3 lg:order-2">
          <div
            id="scroll-container"
            className="lg:pl-[28px] lg:max-h-[600px] lg:overflow-y-auto overflow-x-hidden lg:scrollbar-hide space-y-4 lg:space-y-6"
          >
            <button className="p-2 px-3 bg-gray-100 rounded-md flex items-center cursor-pointer">
              <span className="text-sm font-medium">
                {product?.companyName}
              </span>
              <Icon name="right" size={16} className="ml-1" />
            </button>

            <div className="space-y-3">
              <h1 className="text-lg lg:text-xl font-semibold text-gray-900 leading-tight">
                {product?.title}
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Icon
                      name="star"
                      fill="#FFD700"
                      strokeWidth={0}
                      size={16}
                    />
                    <span className="font-medium">
                      {comments?.ratings.averageRating}
                    </span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <div className="flex items-center gap-1 text-gray-600">
                    <span>{comments?.ratings?.totalRatings} оценок</span>
                    <Icon name="arrow-right" size={12} strokeWidth={1} />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Icon name="questionMark" size={14} />
                  <Link
                    href={`/mehsullar/${productId}/reyler`}
                    className="hover:underline"
                  >
                    {comments?.totalCount} вопросов
                  </Link>
                  <Icon name="right" size={14} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-sm text-gray-600">Дополнительные фото</span>
              <div>
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
                      className="cursor-pointer py-2 ml-2 max-w-[57px]"
                    >
                      <Image
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        width={90}
                        height={90}
                        className={`rounded-md h-[76px] object-cover w-full select-none ${
                          activeIndex === index
                            ? 'ring ring-offset-2 ring-purple-custom'
                            : ''
                        }`}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Артикул</span>
                  <span className="font-medium">{product?.id}</span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Объем (л)</span>
                  <span className="font-medium">
                    {product?.specifications.volumeOrWeight} л
                  </span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Серия</span>
                  <span className="font-medium">
                    {product?.specifications.series}
                  </span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Тип</span>
                  <span className="font-medium">
                    {product?.specifications.type}
                  </span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Цвет</span>
                  <span className="font-medium">
                    {product?.specifications.color}
                  </span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Страна производства</span>
                  <span className="font-medium">
                    {product?.specifications.brandCountry}
                  </span>
                </div>
              </div>

              <Button
                onClick={() => {
                  document.body.style.paddingRight = `${scroll}px`;
                  document.body.style.overflow = 'hidden';
                  setIsSpecificationOpen(true);
                }}
                variant="secondary"
                className="hidden text-xs font-medium tracking-wider cursor-pointer lg:block mt-4 w-full sm:w-auto text-gray-900 bg-gray-200 hover:bg-gray-300 rounded-lg py-3 px-4 transition-colors"
              >
                Характеристики и описание
              </Button>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-2">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center flex-1">
                  <div className="w-6 h-6 mr-3 flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="text-gray-900 font-medium text-sm sm:text-base truncate">
                      Кремы Для Уборки MAX
                    </div>
                    <div className="text-gray-500 text-xs sm:text-sm flex items-center">
                      В каталог бренда
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 ml-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex items-center flex-1">
                  <div className="w-6 h-6 mr-3 flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="text-gray-900 font-medium text-sm sm:text-base truncate">
                      Кремы Для Уборки
                    </div>
                    <div className="text-gray-500 text-xs sm:text-sm flex items-center">
                      Все товары в категории
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 ml-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:flex-1 order-2 lg:order-3 hidden lg:block">
          <div className="lg:sticky lg:top-5 bg-white border border-gray-200 rounded-lg p-4 lg:p-4 space-y-4 lg:max-h-[400px]">
            <div className="flex items-center gap-3">
              <span className="text-2xl lg:text-3xl font-bold text-gray-900">
                {product?.price}
              </span>
              <span className="text-xl lg:text-2xl font-semibold text-red-500">
                {product?.discounted_price} ₽
              </span>
            </div>

            <button className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm">
              <Icon name="thumbsup" size={14} />
              <span>Хорошая цена</span>
            </button>

            <div className="flex flex-col gap-3">
              <Button
                onClick={handleWhatsappRedirect}
                className="w-full py-2 text-base lg:text-lg text-white font-medium capitalize"
              >
                whatsapp ilə əlaqə
              </Button>
              <Button
                onClick={handleCommentProduct}
                className="w-full py-2 text-base lg:text-lg text-gray-900 font-medium capitalize"
                variant="primary-light"
              >
                Məshul haqqında şərh yaz
              </Button>
            </div>

            <div className="space-y-3 pt-2 border-t border-gray-100">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-4 h-4 bg-gray-400 rounded-sm mr-2 flex-shrink-0"></div>
                <span>
                  {product && formatDate(product?.createdAt)}, склад WB
                </span>
              </div>

              <div className="flex items-center text-sm">
                <div className="w-4 h-4 bg-blue-500 rounded-sm mr-2 flex-shrink-0"></div>
                <span className="text-gray-800 font-medium mr-2">
                  {product?.companyName}
                </span>
                <span className="text-orange-400 mr-1">⭐</span>
                <span className="text-gray-700 font-semibold mr-1">
                  4,6(satici ulduzu)
                </span>
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8 lg:space-y-10">
        <ReviewsSection productID={productId} />
        <SmilarProduct productID={productId} />
      </div>
      {commentIsOpen && (
        <CreateComment setCommentIsOpen={setCommentIsOpen} id={productId} />
      )}
      <SpecificationsAndDescription
        product={product}
        setIsOpen={setIsSpecificationOpen}
        isOpen={isSpecificationOpen}
      />

      {isShowShareModal && <ShareProductModal />}
    </main>
  );
}
