import React from 'react';
import { Icon } from './Icon';

interface Props {
  title: string;
  text: string;
}

export const ShareButton = ({ title, text }: Props) => {
  const url = window.location.pathname;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'Paylaşılacak Başlık',
          text: text || 'Paylaşılacak açıklama',
          url: url,
        });
        console.log('Paylaşıldı!');
      } catch (error) {
        console.error('Paylaşım iptal edildi veya hata oluştu:', error);
      }
    } else {
      alert('Bu tarayıcıda paylaşım desteği yok.');
    }
  };

  return (
    <button
      onClick={handleShare}
      className="cursor-pointer p-2 hover:bg-gray-100 rounded-full"
      aria-label="Paylaş"
    >
      <Icon name="share" size={20} className="sm:w-6 sm:h-6" />
    </button>
  );
};
