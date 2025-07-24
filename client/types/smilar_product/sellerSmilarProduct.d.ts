interface ApiSmilarProductResponse {
    success: boolean;
    message: string;
    data: Datum[];
    pagination: Pagination;
    seller: Seller;
    meta: Meta;
}
interface Meta {
    algorithm: string;
    version: string;
    totalFound: number;
    criteria: string[];
}
interface Seller {
    id: string;
    companyName: string;
    totalProducts: number;
    currentProduct: CurrentProduct;
}
interface CurrentProduct {
    id: number;
    title: string;
}
interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}
interface Datum {
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