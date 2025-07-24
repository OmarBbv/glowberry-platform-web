'use client';

import {
  handleIsSeller,
  handleLoginClose,
  nextStep,
  setPhoneNumber,
} from '@/stores/slices/loginSlice';
import { RootState } from '@/stores/store';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '../ui/Icon';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';

export function LoginStep1() {
  const { isLoginOpen, isSeller } = useSelector(
    (state: RootState) => state.login
  );
  const dispatch = useDispatch();

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      phoneNumber: '+994',
      isSeller,
    },
  });

  const watchIsSeller = watch('isSeller');

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: { phoneNumber: string; isSeller: boolean }) =>
      await authService.otp(data),
    onSuccess: () => dispatch(nextStep()),
    onError: (data) => toast.error(`${data}`),
  });

  const onSubmit = (data: { phoneNumber: string; isSeller: boolean }) => {
    console.log('Phone number:', data.phoneNumber);
    console.log('seller:', data.isSeller);
    dispatch(setPhoneNumber(data.phoneNumber));
    mutate(data);
  };

  useEffect(() => {
    dispatch(handleIsSeller(watchIsSeller));
  }, [watchIsSeller, dispatch]);

  if (!isLoginOpen) {
    return null;
  }

  return (
    <form
      onClick={(e: React.MouseEvent<HTMLFormElement>) => e.stopPropagation()}
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md m-4 relative animate-in fade-in-0 zoom-in-95"
    >
      <button
        type="button"
        onClick={() => dispatch(handleLoginClose())}
        className="absolute p-1 top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer hover:bg-gray-300 rounded-md"
      >
        <Icon name="x" size={20} />
      </button>

      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Daxil ol və ya profil yarat
      </h2>

      <div className="space-y-6">
        <div>
          <input
            {...register('phoneNumber', { required: true })}
            type="text"
            placeholder="+994 XXX XX XX"
            className="w-full px-4 py-2 rounded-md border border-gray-400 outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 select-none">
          <input
            {...register('isSeller')}
            type="checkbox"
            id="becomeSeller"
            className="w-4 h-4 text-violet-custom focus:ring-2 focus:ring-violet-custom cursor-pointer border-none rounded-md"
          />
          <label
            htmlFor="becomeSeller"
            className="cursor-pointer text-gray-600 text-sm hover:text-violet-custom hover:underline decoration-blue-500"
          >
            Satıcı olaraq qeydiyyatdan keç
          </label>
        </div>

        <button
          type="submit"
          className="w-full cursor-pointer bg-[#8a2be2] text-white font-semibold py-3 rounded-lg hover:bg-[#7b1fa2] transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isPending ? 'Yüklənir..' : 'Kodu Al'}
        </button>
      </div>
    </form>
  );
}
