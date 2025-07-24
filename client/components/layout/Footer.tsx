import { Instagram, Youtube, Shell } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-pink-100 text-gray-800 pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Marka ve Açıklama */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Beautique</h2>
          <p className="text-sm">
            Натуральная косметика для вашей повседневной красоты. Мы заботимся о
            вашей коже с любовью и качеством.
          </p>
        </div>

        {/* Kategoriler */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Категории</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-pink-500">
                Уход за кожей
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-pink-500">
                Макияж
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-pink-500">
                Парфюмерия
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-pink-500">
                Волосы
              </a>
            </li>
          </ul>
        </div>

        {/* Yardım */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Помощь</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-pink-500">
                Связаться с нами
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-pink-500">
                Доставка и оплата
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-pink-500">
                Возврат товара
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-pink-500">
                Часто задаваемые вопросы
              </a>
            </li>
          </ul>
        </div>

        {/* Sosyal Medya */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Следите за нами</h3>
          <div className="flex space-x-4">
            <a href="#" className="flex items-center gap-2 hover:text-pink-500">
              <Instagram size={20} /> Instagram
            </a>
            <a href="#" className="flex items-center gap-2 hover:text-pink-500">
              <Shell size={20} /> VK
            </a>
            <a href="#" className="flex items-center gap-2 hover:text-pink-500">
              <Youtube size={20} /> YouTube
            </a>
          </div>
        </div>
      </div>

      {/* Alt Bilgi */}
      <div className="mt-10 border-t pt-4 text-center text-sm text-gray-500">
        © 2025 Beautique. Все права защищены.
      </div>
    </footer>
  );
};

export default Footer;
