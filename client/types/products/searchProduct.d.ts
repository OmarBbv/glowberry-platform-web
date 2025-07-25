interface IApiSearchProduct {
  success: boolean;
  message: string;
  data: ISearchProductItem[];
  searchInfo: ISearchInfo;
}

interface ISearchProductItem {
  id: number;
  title: string;
  companyName: string;
  description: string;
  searchScore: number;
  matches: ISearchMatch[];
}

interface ISearchMatch {
  field: string;
  matchedText: string;
  indices: number[][];
}

interface ISearchInfo {
  query: string;
  totalResults: number;
  usedFuzzySearch: boolean;
  threshold: number;
}

// Legacy interface for backwards compatibility
interface IProduct {
  id: number;
  title: string;
  companyName: string;
  description: string;
}