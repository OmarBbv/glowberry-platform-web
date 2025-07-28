'use client';

import { ProductHeader } from '@/components/common/ProductHeader';
import { productService } from '@/services/productService';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { MoreHorizontal, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { FreeMode, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';
import { Loading } from '@/components/ui/Loading';
import { Error } from '@/components/ui/Error';
import { Button } from '@/components/ui/Button';
import { CommentModal } from '@/components/sections/CommentModal';
import { getUserDisplayName } from '@/utils/userDisplayName';

export default function Page() {
  const { id } = useParams();
  const [selectComment, setSelectComment] = useState<IProductComment | null>(
    null
  );
  const [isCommentModal, setIsCommentModal] = useState<boolean>(false);

  const commentId = Array.isArray(id) ? id[0] : id;

  const { data: productById } = useQuery({
    queryKey: ['get/all/product/comment/page'],
    queryFn: () => productService.getProductById(String(commentId)),
    enabled: !!commentId,
  });

  const {
    data: comments,
    status,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['get/all/product/comment', commentId],
    queryFn: ({ pageParam = 1 }) =>
      productService.getProductByIdComment(commentId!, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.success && lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
  });

  const { ref, inView } = useInView();

  const allComments = comments?.pages.flatMap((page) => page.data) || [];
  const filterComment = allComments.filter(
    (c) => c.comment.length > 0 && c.comment.trim() !== ''
  );

  const ratingsData = comments?.pages[0]?.ratings;
  const allImages = filterComment.flatMap((c) => c.images);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 24) {
      return `Bugün, ${date.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
    } else if (diffInDays < 7) {
      return `${diffInDays} gün önce`;
    } else {
      return date.toLocaleDateString('tr-TR');
    }
  };

  const getUserAvatarLetter = (user: any) => {
    if (user.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return 'K';
  };

  const handleSelectComment = (comment: IProductComment) => {
    setSelectComment(comment);
    setIsCommentModal(true);
    console.log('comment selected:', comment);
  };

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === 'pending') return <Loading />;
  if (status === 'error') return <Error message="Xeta bas verdi" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <ProductHeader
        image={productById?.images?.[0] || productById?.images?.[1]!}
        productTitle={productById?.title!}
        price={Number(productById?.price)}
        discountedPrice={Number(productById?.discounted_price)}
      />

      <div className="max-w-[1504px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col xl:flex-row gap-8 mt-10">
          <div className="flex-1 xl:w-3/4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Все комментарии{' '}
                  {comments?.pages[0]?.totalCount &&
                    `(${comments.pages[0].totalCount})`}
                </h2>
                <div className="relative">
                  <Swiper
                    modules={[Navigation, FreeMode]}
                    spaceBetween={12}
                    slidesPerView="auto"
                    freeMode={true}
                    navigation={{
                      nextEl: '.swiper-button-next-custom',
                      prevEl: '.swiper-button-prev-custom',
                    }}
                    breakpoints={{
                      320: {
                        slidesPerView: 3,
                        spaceBetween: 8,
                      },
                      640: {
                        slidesPerView: 5,
                        spaceBetween: 12,
                      },
                      768: {
                        slidesPerView: 7,
                        spaceBetween: 12,
                      },
                      1024: {
                        slidesPerView: 9,
                        spaceBetween: 12,
                      },
                    }}
                    className="product-gallery-swiper !pb-2"
                  >
                    {allImages.map((img, i) => (
                      <SwiperSlide key={i} className="!w-auto">
                        <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-gray-50 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-200">
                          <Image
                            height={112}
                            width={96}
                            src={img ?? 'placeholder'}
                            alt={`şəkil+${i}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {/* Custom Navigation Buttons */}
                  <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200">
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200">
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {filterComment.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    Henüz yorum yapılmamış.
                  </div>
                ) : (
                  filterComment.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-6 hover:bg-gray-50/50 transition-colors duration-200"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                            <span className="text-white font-semibold text-lg">
                              {getUserAvatarLetter(comment.user)}
                            </span>
                          </div>
                          <div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                              <h3 className="font-semibold text-gray-900">
                                {getUserDisplayName(comment.user)}
                              </h3>
                              <span className="bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full font-medium inline-flex items-center gap-1 w-fit">
                                <svg
                                  className="w-3 h-3"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Doğrulanmış
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= comment.rating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'fill-gray-200 text-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500 whitespace-nowrap">
                            {formatDate(comment.createdAt)}
                          </span>
                          <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                            <MoreHorizontal className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                      <div className="mb-4 pl-0 sm:pl-15">
                        <p className="text-gray-700 leading-relaxed">
                          {comment.comment}
                        </p>
                      </div>
                      {comment.images && comment.images.length > 0 && (
                        <div className="flex gap-3 pl-0 sm:pl-15">
                          {comment.images.map((image, idx) => (
                            <div
                              key={idx}
                              className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                              onClick={() => handleSelectComment(comment)}
                            >
                              <img
                                src={image || '/placeholder.svg'}
                                alt={`Review image ${idx + 1}`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}

                {hasNextPage && (
                  <div ref={ref} className="p-6 flex justify-center">
                    {isFetchingNextPage ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                    ) : (
                      <span className="text-gray-500">
                        Daha fazla yorum yükle...
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="xl:w-1/4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-40">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    {ratingsData?.averageRating || '0.0'}
                  </span>
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i + 1 <=
                          Math.round(
                            parseFloat(ratingsData?.averageRating || '0')
                          )
                            ? 'fill-current'
                            : 'fill-gray-200 text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-500 text-sm mb-6">
                  {comments?.pages[0]?.totalCount || 0} yorum
                </p>

                <div className="space-y-2 mb-6">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const percentage = comments?.pages[0]?.totalCount
                      ? rating * 20
                      : 0;

                    return (
                      <div
                        key={rating}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className="w-3 text-gray-600">{rating}</span>
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-amber-400 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-500 text-xs w-8 text-right">
                          {Math.floor(
                            (comments?.pages[0]?.totalCount || 0) *
                              (rating / 15)
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <Button className="py-2"> Yorum Yaz</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CommentModal
        comment={selectComment}
        isShowModal={isCommentModal}
        close={() => setIsCommentModal(false)}
      />
    </div>
  );
}
