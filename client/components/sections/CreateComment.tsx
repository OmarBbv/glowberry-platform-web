'use client';

import { Button } from '../ui/Button';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { productService } from '@/services/productService';
import { Dispatch, SetStateAction, useState } from 'react';
import { useTokenValid } from '@/hooks/auth/useTokenValid';
import { toast } from 'react-hot-toast';

interface IFormValue {
  rating: number | null;
  comment: string;
  images: [];
}

interface Props {
  setCommentIsOpen: Dispatch<SetStateAction<boolean>>;
  id: string;
}

export const CreateComment = ({ setCommentIsOpen, id }: Props) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [ratingError, setRatingError] = useState<boolean>(false);

  const { register, handleSubmit } = useForm<IFormValue>({
    defaultValues: {
      rating: null,
      comment: '',
      images: [],
    },
  });

  const { mutateAsync } = useMutation<ICreateComment, Error, ICreateComment>({
    mutationFn: (payload) => productService.createComment(payload),
    onSuccess: () => {
      toast.success('Şərhiniz əlavə edildi');
      setCommentIsOpen(false);
    },
    onError: () => toast.error('xeta bas verdi!'),
  });

  const handleComment = (data: IFormValue) => {
    const payload: ICreateComment = {
      product_id: Number(id),
      rating,
      comment: data.comment,
      images: data.images,
    };

    if (payload.rating === 0) {
      setRatingError(true);
      return;
    }

    mutateAsync(payload);
  };

  const token = useTokenValid();

  console.log('token', token);

  return (
    <div className="fixed inset-0 h-dvh bg-black/20 flex items-center justify-center p-4 z-[999]">
      <form
        onSubmit={handleSubmit(handleComment)}
        className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl"
      >
        <div className="mb-8">
          <h2 className="text-xl font-medium text-gray-900 mb-1">Yorum Yaz</h2>
          <p className="text-sm text-gray-500">Deneyiminizi bizimle paylaşın</p>
        </div>

        <div className="mb-6">
          <textarea
            {...register('comment')}
            placeholder="Yorumunuzu buraya yazın..."
            className="w-full h-32 p-4 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-transparent resize-none placeholder:text-gray-400"
          />
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-700 mb-3">Değerlendirme</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 transition-transform hover:scale-110"
              >
                <svg
                  className={`w-6 h-6 transition-colors ${
                    star <= (hoveredRating || rating)
                      ? 'text-amber-400'
                      : 'text-gray-200'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.388 2.462a1 1 0 00-.364 1.118l1.287 3.974c.3.921-.755 1.688-1.538 1.118L10 13.347l-3.388 2.462c-.783.57-1.838-.197-1.539-1.118l1.288-3.974a1 1 0 00-.364-1.118L2.61 9.401c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.287-3.974z" />
                </svg>
              </button>
            ))}
          </div>
          {ratingError && (
            <p className="text-red-500 text-xs mt-1 mx-1">
              Lütfen bir değerlendirme seçin
            </p>
          )}
        </div>

        <div className="mb-8">
          <p className="text-sm text-gray-700 mb-3">Fotoğraf Ekle</p>
          <label className="group block">
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer transition-colors group-hover:border-gray-300 group-hover:bg-gray-50/50">
              <div className="w-10 h-10 mx-auto mb-3 text-gray-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-500">
                Fotoğraf seçin veya sürükleyin
              </p>
            </div>
            <input
              {...register('images')}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
            />
          </label>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => setCommentIsOpen(false)}
            variant="primary-light"
            className="flex-1 py-3 px-4 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors capitalize"
          >
            Bağla
          </Button>
          <Button
            type="submit"
            className="flex-1 py-3 px-4 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors capitalize"
          >
            Şərhi paylaş
          </Button>
        </div>
      </form>
    </div>
  );
};
