import { axiosInstancePrivate, axiosInstancePublic } from "@/utils/axios";
import axios from "axios";

interface UserVerifyResponse {
    message: string;
    token: string;
    refreshToken: string;
    user: {
        id: string;
        phoneNumber: string;
    }
}

interface SellerVerifyResponse {
    message: string;
    step: string;
    token: string;
    refreshToken: string;
    seller: {
        id: string;
        phoneNumber: string;
        isCompleted: boolean;
    }
}

type IVerifyResponse = UserVerifyResponse | SellerVerifyResponse;


interface AuthServiceType {
    otp(data: { phoneNumber: string; isSeller: boolean }): Promise<{ message: string }>;
    verify(data: { phoneNumber: string; otp: string; isSeller: boolean }): Promise<IVerifyResponse>;
    logout: () => Promise<void>
}

class AuthService implements AuthServiceType {
    async otp(data: { phoneNumber: string; isSeller: boolean }): Promise<{ message: string }> {
        try {
            const roleName = data.isSeller ? 'seller' : 'user';
            const res = await axiosInstancePublic.post(`/auth/end-otp/${roleName}`, { phoneNumber: data.phoneNumber });
            return { message: res.data.message };
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || error.message);
            } else {
                throw new Error('Bilinmeyen bir hata oluştu.');
            }
        }
    }

    async verify(data: { phoneNumber: string; otp: string; isSeller: boolean }): Promise<IVerifyResponse> {
        try {
            const roleName = data.isSeller ? 'seller' : 'user';
            const res = await axiosInstancePublic.post(`/auth/verify-otp/${roleName}`, {
                phoneNumber: data.phoneNumber,
                otp: data.otp
            });
            return res.data;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || error.message);
            } else {
                throw new Error('Bilinmeyen bir hata oluştu.');
            }
        }
    }

    async logout(): Promise<void> {
        try {
            const res = await axiosInstancePrivate.post('/auth/logout');
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

export const authService = new AuthService();