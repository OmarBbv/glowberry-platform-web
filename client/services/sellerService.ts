import { axiosInstancePrivate } from "@/utils/axios";
import axios from "axios";

export interface ISellerUpdateDto {
    companyName: string;
    phoneNumber: string;
    address: string;
    isCompleted: boolean;
}
interface ISellerService {
    updateSeller(data: ISellerUpdateDto): Promise<void>
}

class SellerService implements ISellerService {
    async updateSeller(data: ISellerUpdateDto): Promise<void> {
        try {
            const res = await axiosInstancePrivate.put('/sellers/info', data);
            console.log(res.data);
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


export const sellerService = new SellerService();
