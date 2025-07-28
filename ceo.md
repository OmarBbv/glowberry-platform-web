import Head from 'next/head';

const productStructuredData = {
"@context": "https://schema.org/",
"@type": "Product",
"name": "Glowberry Nemlendirici Krem",
"image": [
"https://glowberry.com/images/krem1.jpg",
"https://glowberry.com/images/krem2.jpg"
],
"description": "Cildinizi yoğun şekilde nemlendiren doğal krem.",
"brand": {
"@type": "Brand",
"name": "Glowberry"
},
"aggregateRating": {
"@type": "AggregateRating",
"ratingValue": "4.8",
"reviewCount": "146"
}
};

export default function ProductPage() {
return (
<>

<Head>
<title>Glowberry Nemlendirici Krem</title>
<script type="application/ld+json">
{JSON.stringify(productStructuredData)}
</script>
</Head>
{/_ Diğer sayfa içeriği _/}
</>
);
}
