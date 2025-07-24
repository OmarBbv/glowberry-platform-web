'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, Zoom } from 'swiper/modules';
import { useRef, useState } from 'react';
import classNames from 'classnames';
import { Icon } from '../ui/Icon';

const customImages = [
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/1.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/2.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/3.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/6.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/7.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/8.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/9.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/10.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/1.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/2.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/3.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/6.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/7.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/8.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/9.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/10.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/1.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/2.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/3.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/6.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/7.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/8.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/9.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/10.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/1.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/2.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/3.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/6.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/7.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/8.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/9.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/10.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/1.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/2.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/3.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/6.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/7.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/8.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/9.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/10.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/1.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/2.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/3.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/6.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/7.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/8.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/9.webp',
  'https://basket-01.wbbasket.ru/vol100/part10017/10017401/images/big/10.webp',
];

interface Props {
  variant?: 'horizontal' | 'vertical';
  images?: string[];
  view?: number;
  imageClass?: string;
  isButton?: boolean;
  autoplay?: {
    delay?: number;
    disableOnInteraction?: boolean;
    pauseOnMouseEnter?: boolean;
    enabled?: boolean;
  };
  space?: number;
  buttonPosition?: number;
  zoom?: boolean;
  imageSize?: number;
}

export default function CustomSwiper({
  images = customImages,
  imageClass,
  view = 1,
  isButton = false,
  autoplay = {
    enabled: false,
    delay: 1000,
    pauseOnMouseEnter: false,
    disableOnInteraction: false,
  },
  space,
  buttonPosition = 1,
  variant = 'horizontal',
  zoom = false,
  imageSize = 1200,
}: Props) {
  const swiperRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  switch (variant) {
    case 'horizontal':
      return (
        <div className="relative h-full group">
          <Swiper
            modules={[Navigation, Autoplay, Pagination, Zoom]}
            slidesPerView={view}
            spaceBetween={space}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            zoom={zoom}
            loop={autoplay.enabled ?? false}
            autoplay={
              autoplay.enabled
                ? {
                    delay: autoplay.delay ?? 2000,
                    disableOnInteraction:
                      autoplay.disableOnInteraction ?? false,
                    pauseOnMouseEnter: autoplay.pauseOnMouseEnter ?? true,
                  }
                : false
            }
            className="w-full h-full"
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
          >
            {images.map((img, i) => (
              <SwiperSlide key={i}>
                <div
                  className={classNames('swiper-zoom-container', imageClass)}
                >
                  <Image
                    src={img}
                    width={imageSize}
                    height={imageSize}
                    alt={`img-${i}`}
                    className={classNames('w-full h-full', imageClass)}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {isButton && (
            <>
              <button
                onClick={() => swiperRef.current?.slidePrev()}
                style={{ left: `${buttonPosition}px` }}
                className="absolute top-1/2 -translate-y-1/2 bg-white/60 hover:bg-gray-200 cursor-pointer rounded-full z-10 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Icon name="arrow-left" />
              </button>

              <button
                onClick={() => swiperRef.current?.slideNext()}
                style={{ right: `${buttonPosition}px` }}
                className="absolute top-1/2 -translate-y-1/2 bg-white/60 hover:bg-gray-200 cursor-pointer rounded-full z-10 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Icon name="arrow-right" />
              </button>
            </>
          )}
        </div>
      );
    case 'vertical':
      return (
        <Swiper
          direction={'vertical'}
          // modules={[Pagination]}
          // pagination={{
          //   clickable: true,
          // }}
          className="mySwiper h-full"
          slidesPerView={view}
          spaceBetween={space}
        >
          {images.map((img, i) => {
            return (
              <SwiperSlide key={i}>
                <Image
                  src={img}
                  width={200}
                  height={200}
                  alt="img"
                  className={classNames(
                    'w-full object-cover h-full select-none',
                    imageClass
                  )}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      );
  }
}
