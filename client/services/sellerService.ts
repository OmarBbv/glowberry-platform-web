import { axiosInstancePrivate } from "@/utils/axios";

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
            throw new Error(error.message || error);
        }
    }
}


export const sellerService = new SellerService();
