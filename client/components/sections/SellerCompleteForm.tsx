'use client';

import { ISellerUpdateDto, sellerService } from '@/services/sellerService';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';

interface Props {
  close: () => void;
}

export const SellerCompleteForm = ({ close }: Props) => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      companyName: '',
      email: '',
      address: '',
    },
  });

  const { mutate, isPending } = useMutation<void, Error, ISellerUpdateDto>({
    mutationFn: async (data: ISellerUpdateDto) =>
      await sellerService.updateSeller(data),
    onSuccess: () => {
      localStorage.setItem('isCompleted', 'true');
      close();
    },
    onError: () => console.log('onError'),
  });

  const onSubmit = (data: any) => {
    const phoneNumber = localStorage.getItem('phoneNumber');

    if (!phoneNumber) return null;

    const payload: ISellerUpdateDto = {
      companyName: data.companyName,
      phoneNumber,
      address: data.address,
      isCompleted: true,
    };

    mutate(payload);
  };

  return (
    <>
      <div className="fixed inset-0 z-[999991] bg-black/20 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
          <button
            onClick={close}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
          >
            &times;
          </button>

          <h2 className="text-xl font-semibold mb-4">
            Satıcı Bilgilerini Doldur
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Firma Adı</label>
              <input
                {...register('companyName')}
                type="text"
                name="companyName"
                className="mt-1 w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                {...register('email')}
                type="email"
                name="email"
                className="mt-1 w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Adres</label>
              <input
                {...register('address')}
                type="text"
                name="address"
                className="mt-1 w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <Button type="submit" variant="primary" className="p-2">
              {isPending ? 'yuklenir..' : 'Kaydet'}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};
