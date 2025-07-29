'use client';

import { MetaHead } from '@/components/common/MetaHead';
import CreateProduct from '@/components/sections/CreateProduct';
import { SellerCompleteForm } from '@/components/sections/SellerCompleteForm';
import { Button } from '@/components/ui/Button';
import { useSellerProduct } from '@/hooks/data/useProduct';
import {
  Edit3,
  Plus,
  Trash2,
  Eye,
  TrendingUp,
  Package,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function page() {
  const [isCreate, setIsCreate] = useState(false);
  const [isOpen, setisOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const { data } = useSellerProduct({ index });

  const handleComplatedToggle = () => setisOpen((prev) => !prev);

  const handleToggle = () => {
    const isComplated = localStorage.getItem('isCompleted');
    console.log('isComplated:', isComplated);

    if (isComplated === 'true') {
      setIsCreate((prev) => !prev);
      if (!isCreate) document.body.style.overflow = 'hidden';
      else document.body.style.overflow = 'auto';
    } else {
      handleComplatedToggle();
    }
  };

  const products = data?.data || [];

  const totalProducts = products.length;
  const activeProducts = products.filter((p: any) => p.quantity > 0).length;
  const totalSales = products.reduce(
    (sum: number, p: any) => sum + p.quantity * parseFloat(p.discounted_price),
    0
  );
  const lowStockProducts = products.filter((p: any) => p.quantity <= 10).length;

  return (
    <>
      <MetaHead
        title="Məhsullarım - Satıcı Paneli"
        description="Məhsullarınızı idarə edin, yeni məhsul əlavə edin və satışlarınızı izləyin."
        keywords="satıcı paneli, məhsul idarəetməsi, online satış, məhsul əlavə et"
      />
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* İstatistikler */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam Məhsul</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalProducts}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Package size={24} className="text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aktif Məhsul</p>
                <p className="text-2xl font-bold text-green-600">
                  {activeProducts}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam Değər</p>
                <p className="text-2xl font-bold text-blue-600">
                  {totalSales.toLocaleString()} ₼
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <TrendingUp size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Az Stok</p>
                <p className="text-2xl font-bold text-orange-600">
                  {lowStockProducts}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <AlertTriangle size={24} className="text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Başlık ve Yeni Ürün Butonu */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Məhsullarım</h1>
          <Button
            onClick={handleToggle}
            variant="primary"
            className="px-6 py-3 max-w-[250px]"
            icon={<Plus size={20} />}
          >
            Yeni Məhsul Əlavə Et
          </Button>
        </div>

        {/* Ürün Listesi */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left p-4 font-semibold text-gray-900">
                    ID
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-900">
                    Məhsul
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-900">
                    Qiymət
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-900">
                    Kateqoriya
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-900">
                    Stok
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-900">
                    Min. Satış
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-900">
                    Spesifikasiya
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-900">
                    Şəkillər
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-900">
                    Əməliyyat
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((product: any) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4">
                      <span className="font-mono text-sm text-gray-600">
                        #{product.id}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                          {product.images && product.images.length > 0 ? (
                            <Image
                              src={product.images[0]}
                              alt={product.title}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <Package size={16} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm truncate">
                            {product.title}
                          </h3>
                          <p className="text-xs text-gray-600 truncate line-clamp-1 max-w-[100px]">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 text-sm">
                            {product.discounted_price} ₼
                          </span>
                          {parseFloat(product.discounted_price) <
                            parseFloat(product.price) && (
                            <span className="text-xs text-gray-500 line-through">
                              {product.price} ₼
                            </span>
                          )}
                        </div>
                        {parseFloat(product.discounted_price) <
                          parseFloat(product.price) && (
                          <span className="text-xs text-green-600">
                            %
                            {Math.round(
                              (1 -
                                parseFloat(product.discounted_price) /
                                  parseFloat(product.price)) *
                                100
                            )}{' '}
                            endirim
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                        {product.category_id}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          product.quantity === 0
                            ? 'bg-red-100 text-red-600'
                            : product.quantity <= 10
                            ? 'bg-orange-100 text-orange-600'
                            : 'bg-green-100 text-green-600'
                        }`}
                      >
                        {product.quantity} ədəd
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-600">
                        {product.min_quantity_to_sell} ədəd
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-xs text-gray-600 space-y-1 max-w-48">
                        {product.specifications && (
                          <>
                            <div>
                              <span className="font-medium">Növ:</span>{' '}
                              {product.specifications.type}
                            </div>
                            <div>
                              <span className="font-medium">Rəng:</span>{' '}
                              {product.specifications.color}
                            </div>
                            <div>
                              <span className="font-medium">Seriya:</span>{' '}
                              {product.specifications.series}
                            </div>
                            <div>
                              <span className="font-medium">Marka ölkəsi:</span>{' '}
                              {product.specifications.brandCountry}
                            </div>
                            <div>
                              <span className="font-medium">Məhsul №:</span>{' '}
                              {product.specifications.productNumber}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">
                          {product.images ? product.images.length : 0} şəkil
                        </span>
                        {product.images && product.images.length > 0 && (
                          <div className="flex -space-x-1">
                            {product.images
                              .slice(0, 3)
                              .map((image: string, index: number) => (
                                <div
                                  key={index}
                                  className="w-6 h-6 rounded-full overflow-hidden border-2 border-white bg-gray-100"
                                >
                                  <Image
                                    src={image}
                                    alt={`${product.title} ${index + 1}`}
                                    width={24}
                                    height={24}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            {product.images.length > 3 && (
                              <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                                <span className="text-xs text-gray-600">
                                  +{product.images.length - 3}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          product.quantity > 0
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {product.quantity > 0 ? 'Aktiv' : 'Stokda yox'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit3 size={14} />
                        </button>
                        <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={14} />
                        </button>
                        <button className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <Eye size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {(!data?.data || data.data.length === 0) && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Hələ məhsulunuz yoxdur
            </h3>
            <p className="text-gray-600 mb-6">
              İlk məhsulunuzu əlavə edin və satışa başlayın
            </p>
            <Button
              onClick={handleToggle}
              variant="primary"
              className="px-8 py-3 max-w-[350px] mx-auto"
              icon={<Plus size={20} />}
            >
              İlk Məhsulunuzu Əlavə Edin
            </Button>
          </div>
        )}

        {isCreate && (
          <CreateProduct onClose={handleToggle} setIndex={setIndex} />
        )}
        {isOpen && <SellerCompleteForm close={handleComplatedToggle} />}
      </div>
    </>
  );
}
