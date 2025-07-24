interface ApiResponseSmilarProduct {
    success: boolean;
    message: string;
    data: Product[];
    productMeta: SimilarProductsMeta;
}
interface SimilarProductsMeta {
    algorithm: string;
    version: string;
    totalFound: number;
    currentPage: number;
    perPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    criteria: string[];
}
interface Product {
    id: number;
    companyName: string;
    title: string;
    description: string;
    price: string;
    discounted_price: string;
    seller_id: string;
    category_id: number;
    quantity: number;
    min_quantity_to_sell: number;
    procurement?: any;
    images: string[];
    specifications: Specifications;
    views: number;
    createdAt: string;
    updatedAt: string;
}
interface Specifications {
    type: string;
    color: string;
    series: string;
    purpose: string;
    brandCountry: string;
    productNumber: string;
    volumeOrWeight: string;
}