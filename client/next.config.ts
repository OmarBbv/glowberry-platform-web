import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
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
};

export default nextConfig;
