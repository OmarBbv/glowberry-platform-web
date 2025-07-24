import { useImageZoom } from '@/hooks/useImageZoom';
import Image from 'next/image';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';

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
  const { handlers, isZoomed } = useImageZoom();

  return (
    <header className="w-full sticky top-0 left-0 z-10 bg-white">
      <div className="flex items-center justify-between flex-1">
        <div className="flex w-[55%] items-center gap-2">
          <div className="relative">
            <Image
              width={100}
              height={100}
              src={image}
              alt="resim"
              className="max-w-[50px] max-h-[60px] rounded-md cursor-pointer"
              {...handlers}
            />
            <div
              className={`mt-4 p-3 shadow-md rounded-md bg-white absolute top-full origin-top-left transition-all duration-300 ease-out
                 ${
                   isZoomed
                     ? 'scale-100 opacity-100 pointer-events-auto'
                     : 'scale-50 opacity-0 pointer-events-none'
                 }`}
            >
              <Image
                width={300}
                height={300}
                src={image}
                alt="zoomed"
                className="rounded-md min-w-[150px] min-h-[150px]"
              />
              <span className="text-xs">{price}</span>
              <br />
              <span className="text-xs line-clamp-2">{productTitle}</span>
            </div>
          </div>

          <div className="space-y-1">
            <div>{productTitle}</div>
            <div>4,9 1 151 оценка 2 шт.</div>
          </div>
        </div>
        <div className="flex flex-1 justify-end items-center gap-4">
          {/* Fiyatlar */}
          <div className="flex flex-col items-start mr-auto border-l border-gray-400 pl-6">
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

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="primary"
              className="py-[10px] px-6 text-nowrap"
            >
              Купить сейчас
            </Button>
            <Button
              type="button"
              variant="primary-light"
              className="py-[10px] px-6 text-nowrap"
            >
              В корзину
            </Button>

            <button className="p-2">
              <Icon name="heart" size={25} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
