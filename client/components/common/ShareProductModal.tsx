'use client';

import { useEffect, useState } from 'react';
import { Icon } from '../ui/Icon';
import { Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { useDispatch } from 'react-redux';
import { handleToggleProductShareModal } from '@/stores/slices/globalToggleSlice';

export const ShareProductModal = () => {
  const hostname = window.location.href;
  const [isCopy, setIsCopy] = useState(true);
  const dispatch = useDispatch();

  const copyLink = () => {
    setIsCopy(false);
    navigator.clipboard.writeText(hostname);
  };
  const close = () => dispatch(handleToggleProductShareModal());

  useEffect(() => {
    if (!isCopy) {
      const timer = setTimeout(() => {
        setIsCopy(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isCopy]);

  return (
    <div className="fixed w-full h-screen top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-lg p-6 min-w-md mx-auto">
        <h3 className="text-lg font-semibold mb-4">Поделиться товаром</h3>
        <div className="flex flex-col gap-4 w-full">
          <div className="w-full p-2 border border-gray-300 flex itecems-center gap-2 rounded-md">
            <input
              type="text"
              defaultValue={hostname}
              className="rounded-md outline-none w-full"
              readOnly
            />
            {isCopy ? (
              <button onClick={copyLink} className="cursor-pointer">
                <Icon name="copy" color="gray" size={20} />
              </button>
            ) : (
              <button>
                <Check color="green" size={20} />
              </button>
            )}
          </div>
          <Button
            onClick={close}
            variant="primary-light"
            className="p-2 font-medium text-black tracking-wide"
          >
            Bağla
          </Button>
        </div>
      </div>
    </div>
  );
};
