export type SortFilterItem = {
  title: string;
  slug: string | null;
  sortKey: 'RELEVANCE' | 'BEST_SELLING' | 'CREATED_AT' | 'PRICE';
  reverse: boolean;
};

export const defaultSort: SortFilterItem = {
  title: 'Relevance',
  slug: null,
  sortKey: 'RELEVANCE',
  reverse: false
};

export const sorting: SortFilterItem[] = [
  defaultSort,
  { title: 'Trending', slug: 'trending-desc', sortKey: 'BEST_SELLING', reverse: false }, // asc
  { title: 'Latest arrivals', slug: 'latest-desc', sortKey: 'CREATED_AT', reverse: true },
  { title: 'Price: Low to high', slug: 'price-asc', sortKey: 'PRICE', reverse: false }, // asc
  { title: 'Price: High to low', slug: 'price-desc', sortKey: 'PRICE', reverse: true }
];

export const TAGS = {
  collections: 'collections',
  products: 'products',
  cart: 'cart'
};

export const HIDDEN_PRODUCT_TAG = 'nextjs-frontend-hidden';
export const DEFAULT_OPTION = 'Default Title';

export const SIZE_LABELS = {
    S: 'S',
    M: 'M',
    L: 'L',
    '2XS': 'S^(-2)',
    XXS: 'S^(-2)',
    XS: 'S^(-1)',
    XL: 'L^2',
    '2XL': 'L^3',
    XXL: 'L^3',
    '3XL': 'L^4',
    XXXL: 'L^4',
    '4XL': 'L^4',
    XXXXL: 'L^4'
  };
