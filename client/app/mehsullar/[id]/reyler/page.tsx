'use client';

import { ProductHeader } from '@/components/common/ProductHeader';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { useImageZoom } from '@/hooks/useImageZoom';
import { MoreHorizontal, Star } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FreeMode, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

export default function page() {
  const router = useRouter();
  const { isZoomed, handlers } = useImageZoom();

  const productImages = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    src: 'https://feedback09.wbcontent.net/vol3137/part313792/313792902/photos/ms.webp',
    alt: `Product photo ${i + 1}`,
  }));

  return (
    <div className="w-full min-h-screen">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center"
      >
        <Icon name="arrow-left" />
        <span>Назад</span>
      </button>
      <ProductHeader
        image="https://feedback09.wbcontent.net/vol3132/part313298/313298170/photos/ms.webp"
        productTitle="Nutrilon / Молочная смесь Nutrilon Premium 1 с рождения, 1200г"
        price={1556}
        discountedPrice={1400}
      />
      <div className="flex flex-1 gap-16 mt-10 bg-gray-100 py-8 justify-between">
        <div className="w-3/4 bg-red-100">
          <div className="space-y-2 p-2">
            <div>Все отзывы</div>
            <div className="mb-6 relative">
              <Swiper
                modules={[Navigation, FreeMode]}
                spaceBetween={1}
                slidesPerView="auto"
                freeMode={true}
                navigation={{
                  nextEl: '.swiper-button-next-custom',
                  prevEl: '.swiper-button-prev-custom',
                }}
                // breakpoints={{
                //   320: {
                //     slidesPerView: 4,
                //     spaceBetween: 8,
                //   },
                //   640: {
                //     slidesPerView: 6,
                //     spaceBetween: 12,
                //   },
                //   768: {
                //     slidesPerView: 8,
                //     spaceBetween: 12,
                //   },
                //   1024: {
                //     slidesPerView: 10,
                //     spaceBetween: 12,
                //   },
                // }}
                className="product-gallery-swiper"
              >
                {productImages.map((image) => (
                  <SwiperSlide key={image.id} className="!w-24">
                    <div className="w-[84px] h-[112px] rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity">
                      <Image
                        height={115}
                        width={115}
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* comments */}
          <div className="space-y-10">
            {Array.from({ length: 10 }).map((_, index) => {
              return (
                <div className="p-6 bg-gray-300" key={index}>
                  {/* User Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-medium">П</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">
                            Покупатель Wildberries
                          </h3>
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                            ✓ Выкупили
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Star Rating */}
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= 3
                                ? 'fill-orange-400 text-orange-400'
                                : 'fill-gray-200 text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 ml-2">
                        Сегодня, 19:03
                      </span>
                      <button className="ml-2 p-1 hover:bg-gray-100 rounded">
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="mb-4">
                    <p className="text-gray-900 mb-3">
                      <span className="font-medium">Достоинства:</span> Вот за
                      это поставила тройку но а в целом все хорошо
                    </p>
                  </div>

                  {/* Product Images */}
                  <div className="flex gap-3 mb-6">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      <img
                        src="/placeholder.svg?height=80&width=80"
                        alt="Product image 1"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      <img
                        src="/placeholder.svg?height=80&width=80"
                        alt="Product image 2"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* sidebar */}
        <div className="flex flex-col items-center justify-center max-h-[150px] bg-white rounded-xl shadow-md p-4 ">
          <div className="flex items-center space-x-1 mb-3">
            <span className="text-xl font-semibold">4.8</span>
            <div className="flex text-orange-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                >
                  <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-500 text-sm">18 171 reviews</span>
          </div>
          <Button
            variant="primary-light"
            className="bg-purple-100 text-purple-600 text-sm font-medium py-3 px-4 rounded-lg hover:bg-purple-200 transition"
          >
            Write a review
          </Button>
        </div>
      </div>
    </div>
  );
}
