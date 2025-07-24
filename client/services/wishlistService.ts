import { axiosInstancePrivate } from "@/utils/axios";
import axios from "axios";

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
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || error.message);
            } else {
                throw new Error('Bilinmeyen bir hata oluştu.');
            }
        }
    }

    async getAllWishlist(): Promise<IApiWishResponse> {
        try {
            const res = await axiosInstancePrivate.get(`/wishlist`);
            return res.data;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || error.message);
            } else {
                throw new Error('Bilinmeyen bir hata oluştu.');
            }
        }
    }
    async deleteAllWishlist(): Promise<void> {
        try {
            const res = await axiosInstancePrivate.delete('/wishlist');
            return res.data;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || error.message);
            } else {
                throw new Error('Bilinmeyen bir hata oluştu.');
            }
        }
    }
}

export const wishlistService = new WishListService();
