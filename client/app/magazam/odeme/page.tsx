'use client';

import { Button } from '@/components/ui/Button';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  Settings,
  Plus,
  Download,
  Eye
} from 'lucide-react';

// Örnek ödeme verisi
const mockPayments = [
  {
    id: 1,
    orderId: 'ORD-2024-001',
    amount: 299,
    commission: 14.95,
    netAmount: 284.05,
    status: 'completed',
    date: '2024-01-15',
    customerName: 'Əli Həsənov',
    productName: 'Premium Deri Çanta'
  },
  {
    id: 2,
    orderId: 'ORD-2024-002',
    amount: 89,
    commission: 4.45,
    netAmount: 84.55,
    status: 'pending',
    date: '2024-01-14',
    customerName: 'Fatmə Quliyeva',
    productName: 'Erkek Gömlek'
  },
  {
    id: 3,
    orderId: 'ORD-2024-003',
    amount: 159,
    commission: 7.95,
    netAmount: 151.05,
    status: 'completed',
    date: '2024-01-13',
    customerName: 'Rəşad Məmmədov',
    productName: 'Kadın Elbise'
  },
  {
    id: 4,
    orderId: 'ORD-2024-004',
    amount: 189,
    commission: 9.45,
    netAmount: 179.55,
    status: 'completed',
    date: '2024-01-12',
    customerName: 'Leyla Əliyeva',
    productName: 'Spor Ayakkabı'
  }
];

const mockBankAccount = {
  accountNumber: '****1234',
  bankName: 'Kapital Bank',
  accountHolder: 'Məhəmməd Əliyev',
  isVerified: true
};

export default function page() {
  const totalEarnings = mockPayments.reduce((sum, p) => sum + p.netAmount, 0);
  const pendingPayments = mockPayments.filter(p => p.status === 'pending').length;
  const completedPayments = mockPayments.filter(p => p.status === 'completed').length;
  const totalCommission = mockPayments.reduce((sum, p) => sum + p.commission, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-600';
      case 'pending':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Tamamlandı';
      case 'pending':
        return 'Gözləyir';
      default:
        return 'Bilinmir';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Toplam Gəlir</p>
              <p className="text-2xl font-bold text-green-600">{totalEarnings.toFixed(2)} ₼</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Gözləyən Ödəmə</p>
              <p className="text-2xl font-bold text-orange-600">{pendingPayments}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Clock size={24} className="text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tamamlanan</p>
              <p className="text-2xl font-bold text-blue-600">{completedPayments}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <CheckCircle size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Komissiya</p>
              <p className="text-2xl font-bold text-purple-600">{totalCommission.toFixed(2)} ₼</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <TrendingUp size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Bank Hesabı</h2>
            <Button variant="outline" className="px-4 py-2" icon={<Settings size={16} />}>
              Düzəliş
            </Button>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard size={20} className="text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">{mockBankAccount.bankName}</p>
                    <p className="text-sm text-gray-600">{mockBankAccount.accountNumber}</p>
                  </div>
                </div>
                {mockBankAccount.isVerified && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle size={16} />
                    <span className="text-sm font-medium">Təsdiqləndi</span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p><span className="font-medium">Hesab Sahibi:</span> {mockBankAccount.accountHolder}</p>
            </div>
          </div>
        </div>


        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Ödəmə Ayarları</h2>
            <Button variant="outline" className="px-4 py-2" icon={<Settings size={16} />}>
              Ayarlar
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Avtomatik Ödəmə</p>
                <p className="text-sm text-gray-600">Hər həftə avtomatik ödəmə al</p>
              </div>
              <div className="w-12 h-6 bg-purple-600 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Bildirişlər</p>
                <p className="text-sm text-gray-600">Ödəmə bildirişlərini al</p>
              </div>
              <div className="w-12 h-6 bg-purple-600 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Ödəmə Geçmişi</h2>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="px-4 py-2" icon={<Download size={16} />}>
                İxrac
              </Button>
              <Button variant="outline" className="px-4 py-2" icon={<Calendar size={16} />}>
                Filtr
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left p-6 font-semibold text-gray-900">Sifariş ID</th>
                <th className="text-left p-6 font-semibold text-gray-900">Müştəri</th>
                <th className="text-left p-6 font-semibold text-gray-900">Məhsul</th>
                <th className="text-left p-6 font-semibold text-gray-900">Məbləğ</th>
                <th className="text-left p-6 font-semibold text-gray-900">Komissiya</th>
                <th className="text-left p-6 font-semibold text-gray-900">Xalis</th>
                <th className="text-left p-6 font-semibold text-gray-900">Tarix</th>
                <th className="text-left p-6 font-semibold text-gray-900">Status</th>
                <th className="text-left p-6 font-semibold text-gray-900">Əməliyyat</th>
              </tr>
            </thead>
            <tbody>
              {mockPayments.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-6">
                    <span className="font-medium text-gray-900">{payment.orderId}</span>
                  </td>
                  <td className="p-6">
                    <span className="text-gray-900">{payment.customerName}</span>
                  </td>
                  <td className="p-6">
                    <span className="text-gray-600">{payment.productName}</span>
                  </td>
                  <td className="p-6">
                    <span className="font-semibold text-gray-900">{payment.amount} ₼</span>
                  </td>
                  <td className="p-6">
                    <span className="text-red-600">-{payment.commission} ₼</span>
                  </td>
                  <td className="p-6">
                    <span className="font-semibold text-green-600">{payment.netAmount} ₼</span>
                  </td>
                  <td className="p-6">
                    <span className="text-gray-600">{payment.date}</span>
                  </td>
                  <td className="p-6">
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
                      {getStatusText(payment.status)}
                    </span>
                  </td>
                  <td className="p-6">
                    <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Boş durum mesajı */}
      {mockPayments.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Hələ ödəməniz yoxdur</h3>
          <p className="text-gray-600 mb-6">İlk satışınızı edin və pul qazanmağa başlayın</p>
          <Button variant="primary" className="px-8 py-3" icon={<Plus size={20} />}>
            Məhsul Əlavə Et
          </Button>
        </div>
      )}
    </div>
  );
}
