'use client';

import { MapPin } from 'lucide-react';
import React from 'react';

const obj = ['Товары', 'Авиабилет', 'Авиабилет'];
interface Props {
  location: string | null;
}

export default function TopBar({ location }: Props) {
  const loc = location?.split(' ');

  return (
    <nav className="hidden lg:flex flex-1 items-center p-1">
      <div className="w-[270px] flex items-center">
        <div className="inline-flex items-center gap-1 cursor-pointer">
          <MapPin className="w-4 text-gray-300" />
          <span className="text-gray-300 text-sm">
            {location !== null ? loc?.[0] : 'Adress'}
          </span>
        </div>
      </div>
      <div className="flex-2">
        <div className="inline-flex gap-1 rounded-xl items-center text-sm bg-white/60">
          {obj.map((o, i) => {
            return (
              <div
                key={i}
                className={`${
                  i === 0 && 'bg-white'
                } rounded-xl px-2 cursor-pointer`}
              >
                {o}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex-1 flex items-center gap-3 justify-end text-sm">
        <div>Для бизнеса</div>
        <div>Работа в Wildberries</div>
        <div>RUB</div>
      </div>
    </nav>
  );
}
