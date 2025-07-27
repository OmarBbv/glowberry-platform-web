'use client';

import { useState } from 'react';
import { ChevronDown, Grid3X3, List, Check } from 'lucide-react';
import { Search } from 'lucide-react';
import ProductGrid from '@/components/sections/ProductGrid';
import { SearchProductGrid } from '@/components/sections/SearchProductGrid';

export default function page() {
  return (
    <div className="w-full space-y-5">
      <ProductFilerSearch />
      <SearchProductGrid />
    </div>
  );
}

const ProductFilerSearch = () => {
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

const SearchFilterToolbar = () => {
  const [saleActive, setSaleActive] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const FilterDropdown = ({
    title,
    options,
    isActive,
  }: {
    title: string;
    options: string[];
    isActive: boolean;
  }) => (
    <div className="relative">
      <button
        onClick={() => toggleDropdown(title)}
        className="flex items-center gap-1 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
      >
        {title}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isActive ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isActive && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px]">
          <div className="py-2">
            {options.map((option, index) => (
              <button
                key={index}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const FilterButton = ({
    title,
    hasCheck = false,
  }: {
    title: string;
    hasCheck?: boolean;
  }) => (
    <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors">
      {hasCheck && <Check className="w-4 h-4 text-blue-500" />}
      {title}
    </button>
  );

  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div>
        <div className="flex items-center justify-between py-3">
          {/* Left section */}
          <div className="flex items-center gap-6">
            {/* Sale toggle */}
            <div className="flex items-center gap-3">
              <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                РАСПРОДАЖА
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={saleActive}
                  onChange={(e) => setSaleActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>

            {/* Sort dropdown */}
            <FilterDropdown
              title="По популярности"
              options={[
                'По популярности',
                'По цене (возрастание)',
                'По цене (убывание)',
                'По рейтингу',
                'Новинки',
              ]}
              isActive={activeDropdown === 'По популярности'}
            />

            {/* All filters button */}
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors">
              <div className="w-4 h-4 flex flex-col gap-0.5">
                <div className="w-full h-0.5 bg-gray-400"></div>
                <div className="w-full h-0.5 bg-gray-400"></div>
                <div className="w-full h-0.5 bg-gray-400"></div>
              </div>
              Все фильтры
            </button>
          </div>

          {/* Center section - Filter dropdowns */}
          <div className="flex items-center gap-1">
            <FilterDropdown
              title="Категория"
              options={['Одежда', 'Обувь', 'Аксессуары', 'Сумки', 'Украшения']}
              isActive={activeDropdown === 'Категория'}
            />

            <FilterDropdown
              title="Цена, Р"
              options={['До 1000', '1000-5000', '5000-10000', 'Свыше 10000']}
              isActive={activeDropdown === 'Цена, Р'}
            />

            <FilterDropdown
              title="Срок доставки"
              options={['1-2 дня', '3-5 дней', '1 неделя', '2 недели']}
              isActive={activeDropdown === 'Срок доставки'}
            />

            <FilterDropdown
              title="Бренд"
              options={['Nike', 'Adidas', 'Zara', 'H&M', 'Uniqlo']}
              isActive={activeDropdown === 'Бренд'}
            />

            <FilterButton title="Оригинал" hasCheck={true} />

            <FilterDropdown
              title="Цвет"
              options={['Черный', 'Белый', 'Красный', 'Синий', 'Зеленый']}
              isActive={activeDropdown === 'Цвет'}
            />

            <FilterDropdown
              title="Размеры одежды"
              options={['XS', 'S', 'M', 'L', 'XL', 'XXL']}
              isActive={activeDropdown === 'Размеры одежды'}
            />
          </div>

          {/* Right section - View toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Overlay to close dropdowns */}
      {activeDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </div>
  );
};
