import { productService } from "@/services/productService";
import { useQuery } from "@tanstack/react-query";

interface Props {
    id: string;
    productId: string;
}

const useCommentsByProductId = ({ id, productId }: Props) => {
    const { data: comments, isLoading, status } = useQuery({
        queryKey: ['get/by/comment'],
        queryFn: () => productService.getProductByIdComment(productId),
        enabled: !!id,
    });

    return {
        comments,
        isLoading,
        status,
    };
}

export { useCommentsByProductId };