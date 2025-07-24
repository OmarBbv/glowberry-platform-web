interface ICreateProduct {
    title: string;
    description: string;
    price: string;
    discountedPrice?: any;
    categoryId: number;
    quantity: number;
    minQuantityToSell: number;
    procurement?: any;
    images: FileList;
    specifications: Record<string, any>;
}