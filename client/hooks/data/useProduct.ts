import { productService } from "@/services/productService";
import { useQuery } from "@tanstack/react-query"

interface Props {
    productId: string;
    id: string | any;
}

const useProductById = ({ id, productId }: Props) => {
    const { data: product,
        isLoading,
        isError, } = useQuery({
            queryKey: ['get/byId/products'],
            queryFn: () => productService.getProductById(productId),
            enabled: !!id,
        })

    return {
        product,
        isLoading,
        isError,
    }
}

export { useProductById }