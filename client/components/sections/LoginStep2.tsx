'use client';

import { handleLoginClose, previousStep } from '@/stores/slices/loginSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '../ui/Icon';
import { useForm, Controller } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { RootState } from '@/stores/store';
import { close } from '@/stores/slices/globalToggleSlice';

type FormValues = {
  code: string[];
};

export function LoginStep2() {
  const { phoneNumber, isSeller } = useSelector(
    (state: RootState) => state.login
  );
  const dispatch = useDispatch();
  const { control, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: { code: ['', '', '', '', '', ''] },
  });

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const watchedCode = watch('code');

  const { mutate: verifyCodeMutate, isPending: isVerifying } = useMutation({
    mutationFn: async (data: { phoneNumber: string; otp: string }) => {
      const dataValue = { ...data, isSeller };
      const response = await authService.verify(dataValue);
      return response as IAuthResponse;
    },
    onSuccess: (data) => {
      localStorage.setItem('data', JSON.stringify(data));
      if ('user' in data) {
        const auth = data as IAuthUserResponse;
        localStorage.setItem('phoneNumber', auth.user.phoneNumber);
        localStorage.setItem('token', auth.token);
        localStorage.setItem('role', auth.user.role);
        dispatch(close());
      } else {
        const auth = data as IAuthSellerResponse;
        localStorage.setItem('phoneNumber', auth.seller.phoneNumber);
        localStorage.setItem('token', auth.token);
        localStorage.setItem('isCompleted', String(auth.seller.isCompleted));
        localStorage.setItem('role', auth.seller.role);

        dispatch(close());
      }

      window.location.reload();
    },
  });

  const { mutate: resendOtpMutate, isPending: isResending } = useMutation({
    mutationFn: async (data: { phoneNumber: string; isSeller: boolean }) => {
      const response = await authService.otp(data);
      return response;
    },
    onSuccess: () => {
      console.log('Kod yeniden gönderildi');
    },
  });

  const onSubmit = (data: FormValues) => {
    const enteredCode = data.code.join('');
    if (enteredCode.length === 6) {
      return verifyCodeMutate({ phoneNumber, otp: enteredCode });
    }
  };

  const handleResendCode = () => {
    resendOtpMutate({ phoneNumber, isSeller });
  };

  return (
    <div
      onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md m-4 relative animate-in fade-in-0 zoom-in-95"
    >
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => dispatch(previousStep())}
          className="text-gray-400 hover:text-gray-700 transition-colors"
        >
          <Icon name="arrow-left" size={24} />
        </button>
        <button
          onClick={() => dispatch(handleLoginClose())}
          className="text-gray-400 hover:text-gray-700 transition-colors"
        >
          <Icon name="x" size={24} />
        </button>
      </div>

      {/* Başlık */}
      <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
        Doğrulama Kodu
      </h2>
      <p className="text-center text-gray-600 mb-8">
        Telefon numaranıza gönderilen 6 haneli kodu giriniz
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-center space-x-3 mb-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <Controller
              key={index}
              name={`code.${index}`}
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  ref={(el) => {
                    field.ref(el);
                    inputsRef.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      field.onChange(value);
                      if (value && index < 5) {
                        inputsRef.current[index + 1]?.focus();
                      }
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !field.value && index > 0) {
                      setValue(`code.${index}`, '');
                      inputsRef.current[index - 1]?.focus();
                    }
                  }}
                  className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a2be2] focus:border-[#8a2be2] transition-all duration-200"
                  autoFocus={index === 0}
                />
              )}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={isVerifying || watchedCode.some((digit) => digit === '')}
          className="w-full cursor-pointer bg-[#8a2be2] text-white font-semibold py-3 rounded-lg hover:bg-[#7b1fa2] transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed mb-4"
        >
          {isVerifying ? 'Doğrulanıyor...' : 'Doğrula'}
        </button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">Kod gelmedi mi?</p>
        <button
          onClick={handleResendCode}
          disabled={isResending}
          className="text-[#8a2be2] hover:underline font-medium text-sm disabled:opacity-50"
        >
          {isResending ? 'Gönderiliyor...' : 'Kodu Yeniden Gönder'}
        </button>
      </div>
    </div>
  );
}
