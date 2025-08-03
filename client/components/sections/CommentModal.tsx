'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Loading } from '../ui/Loading';
import { Icon } from '../ui/Icon';
import { useEffect, useState } from 'react';
import { Navigation } from 'swiper/modules';
import { getUserDisplayName } from '@/utils/userDisplayName';

interface Props {
  comment: IProductComment | null;
  close: () => void;
  isShowModal: boolean;
}

export const CommentModal = ({ comment, close, isShowModal }: Props) => {
  if (!comment) return <Loading />;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleModalClose = () => close();

  const handleNextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % comment.images.length);

  const handlePrevImage = () =>
    setCurrentImageIndex(
      (prev) => (prev - 1 + comment.images.length) % comment.images.length
    );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [close]);

  return (
    <>
      <div
        className={`${isShowModal
          ? 'bg-black/30 fixed inset-0 w-full h-full z-[95] transition-opacity duration-300'
          : 'hidden'
          }`}
        onClick={handleModalClose}
      />

      <div
        className={
          isShowModal
            ? 'fixed inset-0 z-[99] flex items-center justify-center p-2 sm:p-4'
            : 'hidden'
        }
      >
        <div className="w-[94%] h-full max-h-[95vh] bg-white shadow-2xl rounded-xl sm:rounded-2xl overflow-hidden flex flex-col lg:flex-row">
          <div className="relative lg:w-2/3 h-64 sm:h-80 lg:h-full">
            {comment.images && comment.images.length > 0 ? (
              <Swiper
                modules={[Navigation]}
                navigation={{
                  nextEl: '.swiper-button-next-custom',
                  prevEl: '.swiper-button-prev-custom',
                }}
                className="h-full"
                onSlideChange={(swiper) =>
                  setCurrentImageIndex(swiper.activeIndex)
                }
                spaceBetween={0}
                slidesPerView={1}
              >
                {comment.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <Image
                      src={image}
                      alt={`Comment image ${index + 1}`}
                      fill
                      className="object-contain select-none"
                      priority={index === 0}
                      sizes="(max-width: 1024px) 100vw, 66vw"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <p className="text-gray-500 text-sm sm:text-base">
                  Resim bulunamadı
                </p>
              </div>
            )}

            {comment.images && comment.images.length > 1 && (
              <>
                <button
                  className="swiper-button-prev-custom cursor-pointer absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-gray-200 p-2 sm:p-3 rounded-full shadow-lg transition-all duration-200 z-10 backdrop-blur-sm"
                  onClick={handlePrevImage}
                  aria-label="Önceki resim"
                >
                  <Icon
                    name="arrow-left"
                    size={16}
                    color="#333"
                    className="sm:w-5 sm:h-5"
                  />
                </button>

                <button
                  className="swiper-button-next-custom cursor-pointer absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-gray-200 p-2 sm:p-3 rounded-full shadow-lg transition-all duration-200 z-10 backdrop-blur-sm"
                  onClick={handleNextImage}
                  aria-label="Sonraki resim"
                >
                  <Icon
                    name="arrow-right"
                    size={16}
                    color="#333"
                    className="sm:w-5 sm:h-5"
                  />
                </button>
              </>
            )}

            {comment.images && comment.images.length > 1 && (
              <div className="absolute top-4 left-1/2 lg:bottom-4 lg:top-auto z-10 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-xs sm:text-sm backdrop-blur-sm">
                {currentImageIndex + 1} / {comment.images.length}
              </div>
            )}

            <button
              onClick={handleModalClose}
              className="lg:hidden absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-20"
              aria-label="Modalı kapat"
            >
              <Icon name="x" size={20} color="white" />
            </button>
          </div>

          <div className="flex-1 lg:w-1/3 flex flex-col bg-white max-h-[60vh] lg:max-h-full">
            <div className="hidden lg:flex w-full justify-between items-center p-4 border-b border-gray-200">
              <h3 className="font-semibold text-lg">Yorum Detayları</h3>
              <button
                onClick={handleModalClose}
                className="hover:bg-gray-100 p-1 rounded-md transition-colors cursor-pointer"
                aria-label="Modalı kapat"
              >
                <Icon name="x" size={16} />
              </button>
            </div>

            <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-semibold text-lg">Yorum Detayları</h3>
              <button
                onClick={handleModalClose}
                className="hover:bg-gray-100 p-2 rounded-md transition-colors"
                aria-label="Modalı kapat"
              >
                <Icon name="x" size={16} />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <Icon name="user" size={20} color="#666" />
                  </div>
                  <div>
                    <p className="font-medium text-sm sm:text-base">
                      {getUserDisplayName(comment.user)}
                    </p>
                    <div className="flex items-center space-x-1">
                      {comment.rating && (
                        <span className="text-yellow-500 text-lg">
                          <span>{'★'.repeat(comment.rating)}</span>
                          <span>{'☆'.repeat(5 - comment.rating)}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
                    <span className="font-medium">Достоинства:</span>
                    <span>{comment.comment}</span>
                  </p>
                </div>

                {comment.images && comment.images.length > 1 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      Все фото
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {comment.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`rounded-lg overflow-hidden border-2 transition-colors ${currentImageIndex === index
                            ? 'border-blue-500'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                          <Image
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            width={80}
                            height={80}
                            className="w-[70] h-[90] object-cover cursor-pointer"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
