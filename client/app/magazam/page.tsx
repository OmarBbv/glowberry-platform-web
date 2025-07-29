'use client';

import { MetaHead } from '@/components/common/MetaHead';
import { Button } from '@/components/ui/Button';
import {
  TrendingUp,
  Users,
  Package,
  DollarSign,
  Plus,
  Settings,
} from 'lucide-react';

export default function page() {
  const storeStats = {
    totalProducts: 4,
    totalSales: 224,
    totalEarnings: 699.15,
    totalViews: 5740,
    monthlyGrowth: '+12.5%',
  };

  return (
    <>
      <MetaHead
        title="Mağaza Paneli - İdarəetmə"
        description="Mağazanızı idarə edin, məhsul əlavə edin və satışlarınızı izləyin."
        keywords="mağaza paneli, məhsul idarəetməsi, online satış, mağaza istatistikleri"
      />
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Hoş geldin mesajı */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-8 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Mağazanıza Xoş Gəlmisiniz!
                </h1>
                <p className="text-purple-100 text-lg">
                  Satışlarınızı idarə edin və gəlirinizi artırın
                </p>
              </div>
              <div className="hidden md:block">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {storeStats.monthlyGrowth}
                    </div>
                    <div className="text-sm text-purple-100">Bu ay artım</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mağaza İstatistikləri */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Məhsullar</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {storeStats.totalProducts}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Package size={24} className="text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Satışlar</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {storeStats.totalSales}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp size={24} className="text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Gəlir</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {storeStats.totalEarnings} ₼
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <DollarSign size={24} className="text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Baxışlar</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {storeStats.totalViews.toLocaleString('tr-TR')}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Users size={24} className="text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Tez Əməliyyatlar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Tez Əməliyyatlar
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="p-4 h-auto flex-col gap-2 text-left justify-start"
                icon={<Plus size={20} />}
              >
                <span className="font-medium">Yeni Məhsul</span>
                <span className="text-sm text-gray-600">
                  Mağazanıza yeni məhsul əlavə edin
                </span>
              </Button>

              <Button
                variant="outline"
                className="p-4 h-auto flex-col gap-2 text-left justify-start"
                icon={<TrendingUp size={20} />}
              >
                <span className="font-medium">Satış Analizi</span>
                <span className="text-sm text-gray-600">
                  Məhsullarınızın performansını görün
                </span>
              </Button>

              <Button
                variant="outline"
                className="p-4 h-auto flex-col gap-2 text-left justify-start"
                icon={<Settings size={20} />}
              >
                <span className="font-medium">Mağaza Ayarları</span>
                <span className="text-sm text-gray-600">
                  Profil və ayarları yenilə
                </span>
              </Button>
            </div>
          </div>

          {/* Son Fəaliyyət */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Son Fəaliyyət
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp size={16} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Yeni satış</p>
                  <p className="text-sm text-gray-600">
                    Spor Ayakkabı məhsulunuzdan 1 ədəd satıldı
                  </p>
                </div>
                <div className="text-sm text-gray-500">2 saat əvvəl</div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users size={16} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Yeni baxış</p>
                  <p className="text-sm text-gray-600">
                    Premium Deri Çanta məhsulunuza 15 yeni baxış
                  </p>
                </div>
                <div className="text-sm text-gray-500">5 saat əvvəl</div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <DollarSign size={16} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Ödəmə alındı</p>
                  <p className="text-sm text-gray-600">
                    179.55 ₼ hesabınıza köçürüldü
                  </p>
                </div>
                <div className="text-sm text-gray-500">1 gün əvvəl</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
