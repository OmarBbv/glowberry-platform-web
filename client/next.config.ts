import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'feedback08.wbcontent.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'feedback09.wbcontent.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'static-basket-01.wbcontent.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'basket-15.wbbasket.ru',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'basket-01.wbbasket.ru',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'basket-19.wbbasket.ru',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // async headers() {
  //   return [
  //     {
  //       source: '/(.*)',
  //       headers: [
  //         {
  //           key: 'X-Frame-Options',
  //           value: 'SAMEORIGIN',
  //         },
  //         {
  //           key: 'X-XSS-Protection',
  //           value: '1; mode=block',
  //         },
  //         {
  //           key: 'Referrer-Policy',
  //           value: 'strict-origin-when-cross-origin',
  //         },
  //         {
  //           key: 'Strict-Transport-Security',
  //           value: 'max-age=63072000; includeSubDomains; preload',
  //         },
  //         {
  //           key: 'Content-Security-Policy',
  //           value:
  //             "default-src 'self'; img-src *; script-src 'self' 'unsafe-inline';",
  //         },
  //       ],
  //     },
  //   ];
  // },
};

export default nextConfig;
