import { Search } from 'lucide-react';
import React from 'react';
import { SearchFilterToolbar } from './SearchFilterToolbar';

export const ProductFilerSearch = () => {
  return (
    <section className="space-y-5">
      <p>
        По запросу
        <span className="text-purple-custom mx-2">
          «Labranvo Бесшовные трусы сл» ничего не нашлось. Показали товары по
          похожему запросу «трусы женские бесшовные белье»
        </span>
      </p>

      <div className="flex flex-1 justify-between">
        <p>
          <span className="text-lg">трусы женские бесшовные белье</span>
          <span className="text-xs">30 831 товар найден</span>
        </p>
        <button className="text-gray-500 text-sm underline decoration-dashed underline-offset-4 cursor-pointer hover:text-gray-900">
          Рекомендации для вас
        </button>
      </div>

      <div className="flex items-center gap-2">
        {Array.from({ length: 6 }).map((_, i) => {
          return (
            <button
              key={i}
              className="flex items-center gap-2 cursor-pointer bg-gray-200 p-2 max-w-[250px] line-clamp-1 rounded-2xl"
            >
              <Search />
              <span>бесшовные стринги</span>
            </button>
          );
        })}
      </div>

      <SearchFilterToolbar />
    </section>
  );
};
