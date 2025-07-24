interface IApiAllProductResponse {
    message: string;
    success: boolean;
    filters: {
        search: string | null;
        categoryId: number | null;
        priceRange: {
            min: number | null;
            max: number | null;
        };
        inStockOnly: boolean;
        sortBy: string;
        pagination: {
            currentPage: number;
            perPage: number;
            totalItems: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
        };
    };
    data: IProduct[];
}

interface IProduct {
    id: number;
    companyName: string;
    title: string;
    description: string;
    price: string;
    discounted_price?: string | null;
    seller_id: string;
    category_id: number;
    quantity: number;
    min_quantity_to_sell: number;
    procurement?: string | null;
    images: string[];
    specifications: ISpecifications;
    createdAt: string;
    updatedAt: string;
    sellerPhoneNumber: string
}

interface ISpecifications {
    type: string,
    color: string[] | string,
    series: string,
    purpose: string,
    brandCountry: string,
    productNumber: string,
    volumeOrWeight: string
}