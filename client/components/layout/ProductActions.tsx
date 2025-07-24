'use client';

import { MessageCircle } from 'lucide-react';

export const ProductActions = () => {
  return (
    <div className="bg-white py-4 px-3 lg:p-4 space-y-4">
      {/* Price Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-red-500 text-lg font-medium line-through">
            595 ₽
          </span>
          <span className="text-black text-lg font-semibold">608 ₽</span>
        </div>
        <div className="text-gray-500 text-sm">27 июля ›</div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 items-center">
        <button className="w-1/2 text-sm bg-purple-200 hover:bg-purple-300 text-purple-700 font-medium py-4 px-2 lg:py-4 lg:px-6 rounded-xl transition-colors">
          Купить сейчас
        </button>
        <button className="w-1/2 text-sm bg-purple-600 hover:bg-purple-700 text-white font-medium py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors">
          В корзину
          <MessageCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
