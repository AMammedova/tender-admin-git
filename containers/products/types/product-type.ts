// export interface Product {
//   id: number;
//   title: string;
//   detail: string;
//   categoryDto: {
//     id: number;
//     name: string;
//   };
//   attributeDtos: any[];
//   image: (File | { imageUrl: string })[];
//   productImageDto?: { imageUrl: string }[];
// }

// export interface ProductTranslations {
//   products: string;
//   product: string;
//   search_placeholder: string;
//   export: string;
//   add_product: string;
//   filter_title: string;
//   category_label: string;
//   add: string;
// }

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id?: number;
  title: string;
  detail: string;
  categoryDto: Category;
  image: (File | { imageUrl: string })[];
  productImageDto?: ProductImage[];
}

export interface ProductImage {
  id: number;
  imageUrl: string;
}

export interface Attribute {
  id: number;
  name: string;
  attributeValueList?: AttributeValue[];
  children?: Attribute[];
  productAttributeValue?: string;
}

export interface AttributeValue {
  id: number;
  value: string;
  attributeId: number;
}

export interface AttributeSubmission {
  attributeId: number;
  value: string;
}

export interface ProductFormData {
  title: string;
  detail: string;
  categoryDto: Category;
  image: File[] | null;
}