import CustomSwiper from '../common/CustomSwiper';
import { ReviewSwiper } from './ReviewSwiper';
import { SellerRecommendation } from './SellerRecommendation';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/productService';
import { Loading } from '../ui/Loading';
import { Error } from '../ui/Error';
import Link from 'next/link';
import { useCommentsByProductId } from '@/hooks/data/useComment';

interface Props {
  productID: string;
}

export const ReviewsSection = ({ productID: id }: Props) => {
  const { comments, isLoading, isError } = useCommentsByProductId({
    productId: id,
    enabled: !!id,
  });

  const images = comments?.data.flatMap((img) => img.images);

  if (isLoading) return <Loading />;
  if (isError) return <Error />;

  return (
    <div className="px-4 lg:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 mb-6">
        <div className="flex items-center">
          <span className="text-black font-semibold text-lg sm:text-xl mr-2">
            Оценки
          </span>
          <span className="text-gray-600 text-sm sm:text-base">
            {comments?.ratings?.totalRatings}
          </span>
        </div>
        <div className="flex items-center">
          <span className="text-gray-400 font-semibold text-lg sm:text-xl mr-2">
            Вопросы
          </span>
          <span className="text-gray-400 text-sm sm:text-base">
            {comments?.totalCount}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-2xl sm:text-3xl font-bold">
            {comments?.ratings?.averageRating}
          </span>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-orange-400 text-lg sm:text-xl">
                ★
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1 text-gray-600 text-sm sm:text-base">
            <span>{comments?.ratings?.totalRatings} оценок</span>
            <span>›</span>
          </div>
        </div>
        {comments?.data && comments?.data.length > 0 && (
          <div className="flex items-center text-gray-500 text-sm sm:text-base cursor-pointer hover:text-gray-700">
            <span>Смотреть все фото и видео</span>
            <span className="ml-1">›</span>
          </div>
        )}
      </div>

      <div className="mb-6 hidden lg:block sm:mb-8">
        <div className="w-full">
          <CustomSwiper
            images={images || []}
            view={15.5}
            space={8}
            imageClass="rounded-md h-[80px] w-[60px] sm:h-[100px] sm:w-[75px] lg:h-[112px] lg:w-[84px] object-cover"
            isButton={true}
            buttonPosition={-15}
          />
        </div>
      </div>

      <div className="mb-6 sm:mb-8 lg:hidden">
        <div className="w-full">
          <CustomSwiper
            images={images}
            view={4.6}
            space={0}
            imageClass="rounded-md h-[80px] w-[60px] sm:h-[100px] sm:w-[75px] lg:h-[112px] lg:w-[84px] object-cover"
            isButton={true}
            buttonPosition={-15}
          />
        </div>
      </div>

      <div className="mb-6">
        {comments?.data && comments?.data.length > 0 ? (
          <ReviewSwiper comments={comments} />
        ) : (
          'Serh yoxdur'
        )}
      </div>

      {comments?.data && comments.data.length > 0 && (
        <div className="mb-8">
          <Link
            href={`/mehsullar/${id}/reyler`}
            className="w-full sm:w-auto bg-purple-100 text-purple-700 px-6 py-4 rounded-lg font-medium hover:bg-purple-200 transition-colors"
          >
            Смотреть все отзывы
          </Link>
        </div>
      )}

      <SellerRecommendation productID={id} />
    </div>
  );
};
