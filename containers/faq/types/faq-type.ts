export interface FaqSetDto {
  id: number;
  question: string;
  answer: string;
  language: string;

}
export interface Faq {
  id: number;
  question: string;
  answer: string;
  faqSetDtos: FaqSetDto[];
  createFaqSetDtos: FaqSetDto[];
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