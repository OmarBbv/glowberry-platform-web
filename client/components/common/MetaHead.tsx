import Head from 'next/head';

interface MetaProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  image?: string;
  url?: string;
  robots?: string;
}

export const MetaHead = ({
  title = 'Glowberry | Güzellik ve Bakım Ürünleri',
  description = 'Glowberry: Cilt bakımı, makyaj, saç ve vücut ürünleri ile güzelliğinizi keşfedin. Kaliteli markalar, hızlı teslimat.',
  keywords = 'güzellik, bakım, kozmetik, makyaj, cilt bakımı, saç ürünleri, doğal kozmetik',
  canonical,
  image = '/default-og-image.jpg',
  url = 'https://glowberry.com',
  robots = 'index, follow',
}: MetaProps) => {
  const canonicalUrl = window ? window.location.href : url;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content={robots} />
      <link rel="icon" href="/favicon.ico" />
      {canonicalUrl && (
        <link
          rel="canonical"
          href={canonicalUrl !== undefined ? canonicalUrl : canonical}
        />
      )}

      {/* Open Graph (Facebook, WhatsApp vs.) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Head>
  );
};
