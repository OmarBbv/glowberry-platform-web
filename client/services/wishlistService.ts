import { axiosInstancePrivate } from "@/utils/axios";

interface WishListServiceType {
    addWishlist: (productId: string) => Promise<any>;
    getAllWishlist: () => Promise<IApiWishResponse>;
    deleteAllWishlist: () => Promise<void>
}

class WishListService implements WishListServiceType {
    async addWishlist(productId: string): Promise<any> {
        try {
            const res = await axiosInstancePrivate.post(`/wishlist/add-or-remove/${productId}`);
            return res.data;
        } catch (error: any) {
            throw new Error(error.message || error);
        }
    }

    async getAllWishlist(): Promise<IApiWishResponse> {
        try {
            const res = await axiosInstancePrivate.get(`/wishlist`);
            return res.data;
        } catch (error: any) {
            throw new Error(error.message || error);
        }
    }
    async deleteAllWishlist(): Promise<void> {
        try {
            const res = await axiosInstancePrivate.delete('/wishlist');
            return res.data;
        } catch (error: any) {
            throw new Error(error.message || error);
        }
    }
}

export const wishlistService = new WishListService();
