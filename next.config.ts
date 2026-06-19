import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'loremflickr.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/kategoriler/:slug',
        destination: '/:slug',
        permanent: true,
      },
      // Eski / kısa blog slug'ları -> güncel URL'ler (Google eski indeks)
      {
        source: '/blog/perde-mekanizmasi-sistemleri',
        destination: '/blog/perde-mekanizmasi-secimi-zincirli-reduktorlu-ve-motorlu-sistemler',
        permanent: true,
      },
      {
        source: '/blog/perde-mekanizmasi-secimi',
        destination: '/blog/perde-mekanizmasi-secimi-zincirli-reduktorlu-ve-motorlu-sistemler',
        permanent: true,
      },
      {
        source: '/blog/baskili-isyeri-perdeleri',
        destination: '/blog/baskili-isyeri-perdeleri-logo-baskili-stor-perde-nerelerde-kullanilir',
        permanent: true,
      },
      {
        source: '/blog/yonetici-odalari-icin-perde',
        destination: '/blog/yonetici-odalari-icin-ahsap-jaluzi-ve-prestijli-perde-secenekleri',
        permanent: true,
      },
      {
        source: '/blog/kis-bahcesi-perdeleri',
        destination: '/blog/kis-bahcesi-perdeleri-gunes-isi-ve-mahremiyet-kontrolu',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
