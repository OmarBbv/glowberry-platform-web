import { wishlistService } from "@/services/wishlistService";
import { useQuery } from "@tanstack/react-query";

interface IAllWishlist {
    enabled: boolean;

}

const useAllWishlist = ({ enabled = false }: IAllWishlist) => {
    const {
        data: wishData,
        refetch: refetchWishlist,
        isLoading,
        isError,
        error,
        isPending,
        status,
    } = useQuery({
        queryKey: ['get/wishlist'],
        queryFn: () => wishlistService.getAllWishlist(),
        enabled,
    });

    return {
        wishData,
        refetchWishlist,
        isLoading,
        isError,
        error,
        status,
        isPending,
    };
}

export { useAllWishlist }