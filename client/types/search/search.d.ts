// interface SearchFilters {
//     search?: string;
//     category_id?: number;
//     min_price?: number;
//     max_price?: number;
//     in_stock?: boolean;
//     sort_by?: 'newest' | 'price_asc' | 'price_desc' | 'popular';
//     page?: number;
//     limit?: number;
// }

interface IApiSearchProductResponse {
    success: boolean;
    message: string;
    data: Datum[];
    pagination: Pagination;
    searchInfo: SearchInfo;
}
interface SearchInfo {
    query: string;
    normalizedQuery: string;
    usedFuzzySearch: boolean;
    threshold: number;
    searchStrategies: string[];
}
interface Pagination {
    currentPage: number;
    itemsPerPage: number;
    totalResults: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage?: any;
    previousPage?: any;
}
interface Datum {
    id: number;
    title: string;
    companyName: string;
    description: string;
    searchScore: number;
}