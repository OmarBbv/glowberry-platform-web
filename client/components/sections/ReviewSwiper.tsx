'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { formatDate } from '@/utils/formatDate';

interface Props {
  comments: ProductCommentResponse | undefined;
}

export const ReviewSwiper = ({ comments }: Props) => {
  return (
    <div className="w-full relative">
      <Swiper
        modules={[Navigation]}
        spaceBetween={12}
        slidesPerView={1.2}
        navigation={{
          prevEl: '.swiper-button-prev-custom',
          nextEl: '.swiper-button-next-custom',
        }}
        breakpoints={{
          480: {
            slidesPerView: 1.5,
            spaceBetween: 16,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 16,
          },
          768: {
            slidesPerView: 2.5,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1280: {
            slidesPerView: 3.5,
            spaceBetween: 20,
          },
        }}
        className="!pb-4"
      >
        {comments?.data
          .filter((rev) => rev.comment)
          .map((review) => {
            return (
              <SwiperSlide key={review.id}>
                <div className="bg-gray-100 p-3 sm:p-4 rounded-lg h-auto min-h-[160px] sm:min-h-[170px] cursor-pointer transition-shadow hover:shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center mb-3 gap-2 sm:gap-0">
                    <div className="flex items-center gap-2 sm:gap-0">
                      <span className="font-semibold text-gray-800 text-sm sm:text-base sm:mr-2">
                        {review?.user?.name ?? 'Anonim'}
                      </span>
                      <span className="text-gray-500 text-xs sm:text-sm sm:mr-4">
                        {formatDate(review?.createdAt)}
                      </span>
                    </div>
                    <div className="flex">
                      {[...Array({ length: 5 })].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 sm:w-4 sm:h-4 fill-orange-400 text-orange-400"
                        />
                      ))}
                      {[...Array({ length: 5 })].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 sm:w-4 sm:h-4 fill-gray-300 text-gray-300"
                        />
                      ))}
                    </div>
                  </div>

                  {/* {review.pros && (
                  <div className="text-xs sm:text-sm text-gray-700 mb-2">
                    <span className="font-medium">Достоинства:</span>
                    <span className="break-words">{review.pros}</span>
                  </div>
                )} */}

                  {review.comment && (
                    <div className="text-xs sm:text-sm text-gray-700">
                      <span className="font-medium">Комментарий:</span>{' '}
                      <span className="break-words leading-relaxed">
                        {review.comment}
                      </span>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            );
          })}
      </Swiper>

      {/* Navigation Buttons - Hidden on mobile, visible on larger screens */}
      <button className="swiper-button-prev-custom hidden sm:flex absolute top-1/2 -translate-y-1/2 -left-4 lg:-left-6 bg-white shadow-lg rounded-full p-2 lg:p-3 z-10 cursor-pointer hover:bg-gray-50 transition-colors">
        <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
      </button>

      <button className="swiper-button-next-custom hidden sm:flex absolute top-1/2 -translate-y-1/2 -right-4 lg:-right-6 bg-white shadow-lg rounded-full p-2 lg:p-3 z-10 cursor-pointer hover:bg-gray-50 transition-colors">
        <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
      </button>
    </div>
  );
};
