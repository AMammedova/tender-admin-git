export interface Category{
  id: number;
  name:string;
  parentId:number;
  parentCategoryName:string;
  isActive?: boolean;
  children?: Category[];
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