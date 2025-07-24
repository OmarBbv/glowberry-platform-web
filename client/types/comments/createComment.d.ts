interface IApiCommentResponse {
    success: boolean;
    message: string;
    data: Data;
}
interface Data {
    id: string;
    product_id: number;
    user_id: string;
    rating: number;
    comment: string;
    images: any[];
    updatedAt: string;
    createdAt: string;
}

interface ICreateComment {
    product_id: number;
    rating: number;
    comment: string;
    images: string[];
}