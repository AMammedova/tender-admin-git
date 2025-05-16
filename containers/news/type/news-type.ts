export interface News {
  id: number;
  title: string;
  description: string;
  language: string;
  coverImage: string;
  newsSets: NewsSets[];
  images: Images[];
}

export interface Images {
  id: number;
  imageUrl: string;
}

export interface NewsSets {
  id: number;
  title: string;
  description: string;
  language: string;
}

export interface ProductTranslations {
  products: string;
  product: string;
  search_placeholder: string;
  export: string;
  add_product: string;
  filter_title: string;
  category_label: string;
  add: string;
}