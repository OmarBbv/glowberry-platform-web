import { Dispatch, SetStateAction } from 'react';
import { Icon } from '../ui/Icon';

interface Props {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  product: IProduct | undefined;
}

export default function SpecificationsAndDescription({
  isOpen,
  setIsOpen,
  product,
}: Props) {
  return (
    <div>
      {/* Overlay */}
      <div
        className={`fixed inset-0 h-screen bg-black/30 z-[999] transition-opacity duration-200 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => (setIsOpen(false), (document.body.style.overflow = ''))}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 z-[999] h-full bg-white shadow-lg transition-transform duration-500 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ width: '520px' }}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            Характеристики и описание
          </h2>
          <button
            onClick={() => (
              setIsOpen(false), (document.body.style.overflow = '')
            )}
            className="text-gray-400 p-1 hover:text-gray-600 hover:bg-gray-200 text-2xl w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer"
          >
            <Icon name="x" size={14} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Documents verified */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-sm text-gray-600">Документы проверены</span>
          </div>

          {/* Basic Information */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Основная информация
            </h3>
            <div className="space-y-4">
              <div className="flex">
                <span className="text-sm text-gray-500 w-20 flex-shrink-0">
                  Состав
                </span>
                <span className="text-sm text-gray-700 leading-relaxed">
                  {product?.description}
                </span>
              </div>
            </div>
          </div>

          {/* General Characteristics */}
          {/* <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Общие характеристики
            </h3>
            <div className="space-y-4">
              <div className="flex">
                <span className="text-sm text-gray-500 w-32 flex-shrink-0">
                  Количество предметов в упаковке
                </span>
                <span className="text-sm text-gray-700">1 шт</span>
              </div>
            </div>
          </div> */}

          {/* Additional Information */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Дополнительная информация
            </h3>
            <div className="space-y-4">
              <div className="flex">
                <span className="text-sm text-gray-500 w-20 flex-shrink-0">
                  Действие
                </span>
                <span className="text-sm text-gray-700">
                  питание, укрепление, восстановление
                </span>
              </div>
              <div className="flex">
                <span className="text-sm text-gray-500 w-20 flex-shrink-0">
                  Объем товара
                </span>
                <span className="text-sm text-gray-700">350 мл</span>
              </div>
              <div className="flex">
                <span className="text-sm text-gray-500 w-28 flex-shrink-0">
                  Назначение маски
                </span>
                <span className="text-sm text-gray-700">
                  для окрашенных волос; для кудрявых волос; для всех типов волос
                </span>
              </div>
              <div className="flex">
                <span className="text-sm text-gray-500 w-20 flex-shrink-0">
                  Срок годности
                </span>
                <span className="text-sm text-gray-700">
                  36 месяцев; 3 года
                </span>
              </div>
              <div className="flex">
                <span className="text-sm text-gray-500 w-32 flex-shrink-0">
                  Страна производства
                </span>
                <span className="text-sm text-gray-700">Китай</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Price and Purchase Section */}
        <div className="border-t border-gray-100 px-6 py-4 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-2xl font-bold text-red-500">222 ₽</div>
              <div className="text-sm text-gray-500">2 августа</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 bg-purple-100 text-purple-700 font-medium py-3 px-4 rounded-lg hover:bg-purple-200 transition-colors">
              Купить сейчас
            </button>
            <button className="flex-1 bg-purple-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors">
              В корзину
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
