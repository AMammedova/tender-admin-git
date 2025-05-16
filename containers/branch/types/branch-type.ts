export interface Branch {
  id: number;
  name: string;
  code: number;
  address:Address
}
export interface Address {
  name: string;
  latitude: number;
  longitude: number;
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