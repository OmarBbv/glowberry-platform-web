import { productService } from "@/services/productService";
import { useQuery } from "@tanstack/react-query";

interface Props {
    productId: string;
    enabled?: boolean;
}

const useCommentsByProductId = ({ productId, enabled = false }: Props) => {
    const { data: comments, isLoading, status, isError } = useQuery({
        queryKey: ['get/by/comment'],
        queryFn: () => productService.getProductByIdComment(productId),
        enabled,
    });

    return {
        comments,
        isLoading,
        status,
        isError
    };
}

export { useCommentsByProductId };