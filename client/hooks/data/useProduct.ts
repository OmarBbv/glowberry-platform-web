import { productService } from "@/services/productService";
import { useQuery } from "@tanstack/react-query"

const useProductById = ({ id, productId }: {
    productId: string;
    id: string;
}) => {
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

const useSellerProduct = ({ index }: { index: number }) => {
    const { data } = useQuery({
        queryKey: ['get seller products', index],
        queryFn: async () => await productService.getProductsBySeller(),
    });

    return {
        data
    }
}


const useProductSearch = ({ inputValue, enabled = false }: { inputValue: string; enabled: boolean }) => {
    const { data, refetch, isFetching } = useQuery({
        queryKey: ['/get/search/products', inputValue],
        queryFn: () => productService.getProductSearch(inputValue),
        enabled: false,
    });

    return {
        data, refetch, isFetching
    }
}

export { useProductById, useSellerProduct, useProductSearch }