import { axiosInstancePrivate, axiosInstancePublic } from "@/utils/axios";

interface ProductServiceType {
    getAllProduct(pageParams: number, search?: string): Promise<IApiAllProductResponse>;
    getAdvancedProducts(filters: SearchFilters): Promise<IApiAllProductResponse>;
    handleCreateProduct(data: ICreateProduct): Promise<any>;
    getProductById(id: string): Promise<IProduct>;
    getProductByIdComment(id: string): Promise<ProductCommentResponse>
    getProductsBySeller(): Promise<IApiSellerProductResponse>
    createComment(payload: ICreateComment): Promise<IApiCommentResponse>
    addWishlist: (productId: string) => Promise<any>;
    getSimilarProductsBySeller: (id: string, page?: number) => Promise<ApiSmilarProductResponse>
    getSimilarProducts: (id: string, page: number, limit: number) => Promise<ApiResponseSmilarProduct>
}

class ProductService implements ProductServiceType {
    async getAllProduct(pageParams: number = 1, search?: string): Promise<IApiAllProductResponse> {
        try {
            const params: any = { page: pageParams };
            if (search) {
                params.search = search;
            }

            const res = await axiosInstancePublic.get('/products', { params });
            return res.data;
        } catch (error: any) {
            throw new Error(error.message || error);
        }
    }

    async getAdvancedProducts(filters: SearchFilters): Promise<IApiAllProductResponse> {
        try {
            const params: any = { page: filters.page || 1 };

            if (filters.search && filters.search.trim()) {
                params.search = filters.search.trim();
            }

            if (filters.category_id && filters.category_id > 0) {
                params.category_id = filters.category_id;
            }

            if (filters.min_price !== undefined && filters.min_price >= 0) {
                params.min_price = filters.min_price;
            }

            if (filters.max_price !== undefined && filters.max_price >= 0) {
                params.max_price = filters.max_price;
            }

            if (filters.in_stock !== undefined) {
                params.in_stock = filters.in_stock;
            }

            if (filters.sort_by) {
                params.sort_by = filters.sort_by;
            }

            if (filters.limit && filters.limit > 0) {
                params.limit = filters.limit;
            }

            const res = await axiosInstancePublic.get('/products', { params });
            return res.data;
        } catch (error: any) {
            throw new Error(error.message || error);
        }
    }

    async handleCreateProduct(data: ICreateProduct): Promise<any> {
        try {
            const formData = new FormData();

            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('price', data.price);
            formData.append('category_id', data.categoryId.toString());
            formData.append('quantity', data.quantity.toString());
            formData.append('min_quantity_to_sell', data.minQuantityToSell.toString());

            if (data.discountedPrice) {
                formData.append('discounted_price', data.discountedPrice.toString());
            }

            if (data.procurement) {
                formData.append('procurement', data.procurement);
            }

            formData.append('specifications', JSON.stringify(data.specifications));

            if (data.images && data.images.length > 0) {
                for (let i = 0; i < data.images.length; i++) {
                    formData.append('images', data.images[i]);
                }
            }

            const res = await axiosInstancePrivate.post('/sellers/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return res.data
        } catch (error: any) {
            throw new Error(error.message || error);
        }
    }

    async getProductById(id: string): Promise<IProduct> {
        try {
            const res = await axiosInstancePublic.get(`/products/${id}`);
            return res.data;
        } catch (error: any) {
            throw new Error(error.message || error);
        }
    }

    async getProductByIdComment(id: string): Promise<ProductCommentResponse> {
        try {
            const res = await axiosInstancePublic.get(`/comments/${id}`);
            return res.data;
        } catch (error: any) {
            throw new Error(error.message || error);
        }
    }

    async getProductsBySeller(): Promise<IApiSellerProductResponse> {
        try {
            const res = await axiosInstancePrivate.get(`/sellers/products`);
            console.log('seller product: ', res.data);
            return res.data;
        } catch (error: any) {
            throw new Error(error.message || error);
        }
    }

    async createComment(payload: ICreateComment) {
        try {
            console.log('payload', payload);

            const formData = new FormData();
            formData.append('product_id', payload.product_id.toString());
            formData.append('rating', payload.rating.toString());
            formData.append('comment', payload.comment);

            Array.from(payload.images).forEach((image) => {
                formData.append('images', image);
            });

            const res = await axiosInstancePrivate.post('/comments', formData);
            return res.data;
        } catch (error: any) {
            throw new Error(error.message || error);
        }
    }

    async addWishlist(productId: string): Promise<any> {
        try {
            const res = await axiosInstancePrivate.post(`/wishlist/add-or-remove/${productId}`);
            return res.data
        } catch (error: any) {
            throw new Error(error.message || error);
        }
    }

    async getSimilarProductsBySeller(id: string, page: number = 1): Promise<ApiSmilarProductResponse> {
        try {
            const params = { page };
            const res = await axiosInstancePublic.get(`/products/${id}/similar-by-seller`, { params });

            return res.data
        } catch (error: any) {
            throw new Error(error.message || error);
        }
    }

    async getSimilarProducts(id: string, page: number, limit: number): Promise<ApiResponseSmilarProduct> {
        try {
            const res = await axiosInstancePublic.get(`/products/${id}/similar`, {
                params: { page, limit }
            });

            return res.data;
        } catch (error: any) {
            throw new Error(error);
        }
    }
}

export const productService = new ProductService();