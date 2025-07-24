'use client';

import type React from 'react';
import { X, Upload, Plus, Minus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { productService } from '@/services/productService';
import { categories } from '@/services/categoryService';
import { Dispatch, SetStateAction, useState } from 'react';

interface CreateProductProps {
  onClose: () => void;
  setIndex: Dispatch<SetStateAction<number>>;
}

interface ICreateProductForm {
  title: string;
  description: string;
  price: string;
  category_id: string;
  quantity: string;
  discounted_price: string;
  images: FileList;
  procurement?: string;
}

export const CreateProduct = ({ onClose, setIndex }: CreateProductProps) => {
  const [specifications, setSpecifications] = useState({
    productNumber: '',
    series: '',
    purpose: '',
    type: '',
    volumeOrWeight: '',
    color: '',
    brandCountry: '',
  });

  const { register, handleSubmit, reset } = useForm<ICreateProductForm>({
    defaultValues: {
      title: '',
      description: '',
      price: '',
      category_id: '',
      quantity: '',
      discounted_price: '',
      images: null as any,
      procurement: '',
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (data: ICreateProduct) => {
      return await productService.handleCreateProduct(data);
    },
    onSuccess: (data) => {
      console.log('mehsul paylasildi', data);
      setIndex((p) => p + 1);
      onClose();
      reset();
    },
    onError: (data: any) => {
      throw new Error(data);
    },
  });

  const handleSubmitData = (data: ICreateProductForm) => {
    const newValue: ICreateProduct = {
      title: data.title,
      description: data.description,
      price: data.price,
      categoryId: parseInt(data.category_id),
      quantity: parseInt(data.quantity),
      discountedPrice: data.discounted_price
        ? parseFloat(data.discounted_price)
        : undefined,
      images: data.images,
      procurement: data.procurement,
      minQuantityToSell: 1,
      specifications,
    };
    mutate(newValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setSpecifications((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const standardProductTemplate = [
    { name: 'productNumber', label: 'Product №', type: 'text' },
    { name: 'series', label: 'Seriya', type: 'text' },
    { name: 'purpose', label: 'Təyinat', type: 'text' },
    { name: 'type', label: 'Növ', type: 'text' },
    {
      name: 'volumeOrWeight',
      label: 'Həcm/çəki',
      type: 'number',
    },
    { name: 'color', label: 'Rəng', type: 'text' },
    {
      name: 'brandCountry',
      label: 'Brendin ölkəsi',
      type: 'text',
    },
  ];

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/20 z-[999] p-4">
      <div className="max-w-4xl bg-white w-full max-h-[90vh] rounded-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between py-2 px-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-900">Yeni Ürün Ekle</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <form
            onSubmit={handleSubmit(handleSubmitData)}
            className="p-6 space-y-8"
          >
            {/* Basic Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Temel Bilgiler
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Ürün Başlığı *
                    </label>
                    <input
                      {...register('title')}
                      id="title"
                      type="text"
                      placeholder="Ürün başlığını girin"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Kategori *
                    </label>
                    <select
                      {...register('category_id')}
                      id="category"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Kategori seçin</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Ürün Açıklaması
                  </label>
                  <textarea
                    {...register('description')}
                    id="description"
                    placeholder="Ürün hakkında detaylı bilgi verin"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Fiyat ve Stok
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Fiyat (₺) *
                    </label>
                    <input
                      {...register('price')}
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="discounted_price"
                      className="block text-sm font-medium text-gray-700"
                    >
                      İndirimli Fiyat (₺)
                    </label>
                    <input
                      {...register('discounted_price')}
                      id="discounted_price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="quantity"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Stok Miktarı
                    </label>
                    <input
                      {...register('quantity')}
                      id="quantity"
                      type="number"
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Product Images */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ürün Görselleri
              </h3>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="space-y-2">
                    <label
                      htmlFor="images"
                      className="cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Görsel Yükle
                    </label>
                    <input
                      {...register('images')}
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                    />
                    <p className="text-sm text-gray-500">
                      PNG, JPG, GIF (Maksimum 5 görsel)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Teknik Özellikler
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {standardProductTemplate.map((field) => (
                  <div key={field.name} className="flex flex-col">
                    <label
                      htmlFor={field.name}
                      className="text-sm text-gray-700 mb-1"
                    >
                      {field.label}
                    </label>
                    <input
                      onChange={handleChange}
                      name={field.name}
                      type={field.type}
                      id={field.name.replace('specifications.', '')}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Ürün Oluştur
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
