'use client';

import CustomSwiper from '../common/CustomSwiper';

const images = [
  'https://static-basket-01.wbcontent.net/vol1/crm-bnrs/bners1/wb_kosh_12_2880_new.webp',
  'https://static-basket-01.wbcontent.net/vol1/crm-bnrs/bners1/wb_kosh_12_2880_new.webp',
  'https://static-basket-01.wbcontent.net/vol1/crm-bnrs/bners1/wb_kosh_12_2880_new.webp',
  'https://static-basket-01.wbcontent.net/vol1/crm-bnrs/bners1/wb_kosh_12_2880_new.webp',
];
const images2 = [
  'https://static-basket-01.wbcontent.net/vol1/crm-bnrs/bners1/2880vg.webp',
  'https://static-basket-01.wbcontent.net/vol1/crm-bnrs/bnnrsdmn/image/2880x336/6dcb63cf-4730-4a7a-ba61-3cd048fa4d13.webp',
  'https://static-basket-01.wbcontent.net/vol1/crm-bnrs/bnnrsdmn/image/2880x336/7e007e45-1195-4b9c-801e-d6f3a7747ebd.webp',
  'https://static-basket-01.wbcontent.net/vol1/crm-bnrs/bnnrsdmn/image/2880x336/e01daf38-27ad-430a-8597-570c9059d861.webp',
  'https://static-basket-01.wbcontent.net/vol1/crm-bnrs/bners1/wibes_make_2880_300.webp',
];

export default function HeroBanner() {
  return (
    <section className="space-y-2">
      {/* 1 hero */}
      <div className="h-10 px-2 md:px-0">
        <CustomSwiper
          images={images}
          imageClass="rounded-xl h-full object-cover"
          autoplay={{ enabled: true, delay: 3000 }}
          imageSize={1200}
        />
      </div>

      {/* 2 hero */}
      <div className="h-[168px] px-2 md:px-0">
        <CustomSwiper
          images={images2}
          isButton={true}
          imageClass="rounded-xl h-full object-cover"
          autoplay={{ enabled: true, delay: 2000 }}
          buttonPosition={20}
        />
      </div>
    </section>
  );
}
