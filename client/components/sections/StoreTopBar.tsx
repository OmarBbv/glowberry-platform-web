'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ITab {
  label: 'odeme' | 'mehsullarim' | 'magazam';
  title: string;
  href: string;
}

const tabs: ITab[] = [
  { label: 'magazam', title: 'Mağazam', href: '/magazam' },
  { label: 'mehsullarim', title: 'Məhsullarım', href: '/magazam/mehsullarim' },
  { label: 'odeme', title: 'Ödəmə', href: '/magazam/odeme' },
];

export default function StoreTopBar() {
  const pathname = usePathname();

  const getActiveTab = () => {
    if (pathname === '/magazam/odeme') return 'odeme';
    if (pathname === '/magazam/mehsullarim') return 'mehsullarim';
    if (pathname === '/magazam') return 'magazam';
    return 'magazam';
  };

  const activeTab = getActiveTab();

  return (
    <div className="max-w-7xl mx-auto px-4 border-b border-gray-200 sticky top-0 z-10">
      <div className="flex justify-center">
        <ul className="flex w-full gap-10 items-center">
          {tabs.map((t, i) => (
            <Link
              href={t.href}
              key={i}
              className={`relative cursor-pointer py-4 text-sm font-medium transition-colors duration-300 ${
                activeTab === t.label
                  ? 'text-purple-600'
                  : 'text-gray-500 hover:text-purple-600'
              }`}
            >
              <span className="block">{t.title}</span>
              <span
                className={`absolute left-0 bottom-0 h-0.5 w-full transition-all duration-300 ${
                  activeTab === t.label ? 'bg-purple-600' : 'bg-transparent'
                }`}
              ></span>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
}
