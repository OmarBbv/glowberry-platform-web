interface IApiWishResponse {
    message: string;
    data: IWishlist[];
}
interface IWishlist {
    id: string;
    userId: string;
    productId: number;
    createdAt: string;
    updatedAt: string;
    product: Product;
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