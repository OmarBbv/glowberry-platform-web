interface ProductCommentResponse {
    success: boolean;
    message: string;
    data: IProductComment[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    ratings: {
        averageRating: string,
        totalRatings: number
    }
}

interface IProductComment {
    id: string;
    product_id: number;
    user_id: string;
    rating: number;
    comment: string;
    images: string[];
    createdAt: string;
    updatedAt: string;
    user: User
}

interface User {
    id: string,
    name: string,
    phoneNumber: string
}

