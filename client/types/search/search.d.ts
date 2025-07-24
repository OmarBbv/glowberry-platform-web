interface SearchFilters {
    search?: string;
    category_id?: number;
    min_price?: number;
    max_price?: number;
    in_stock?: boolean;
    sort_by?: 'newest' | 'price_asc' | 'price_desc' | 'popular';
    page?: number;
    limit?: number;
}