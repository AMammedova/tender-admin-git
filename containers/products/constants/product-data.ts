import { Product } from "../types/product-type";



export const products: Product[] = [
  {
    id: 1,
    productCode: "P001",
    name: "iPhone 14",
    detail: "Latest model with A15 chip.",
    image: "/images/product/product-01.png",
    quantity: 50,
    category: {
      id: 2,
      name: "Smartphones",
      
    },
  },
  {
    id: 2,
    name: "Samsung Galaxy S23",
    productCode: "P002",
    detail: "Flagship phone with advanced camera.",
    image: "/images/product/product-03.png",
    quantity: 40,
    category: {
      id: 2,
      name: "Smartphones",
     
    },
  },
  {
    id: 3,
    name: "MacBook Pro",
    productCode: "P003",
    detail: "Powerful laptop with M1 chip.",
    image: "/images/product/product-02.png",
    quantity: 20,
    category: {
      id: 1,
      name: "Electronics",
    },
  },
  {
    id: 4,
    name: "Sony WH-1000XM5",
    productCode: "P004",
    detail: "Noise-canceling wireless headphones.",
    image: "/images/product/product-04.png",
    quantity: 30,
    category: {
      id: 1,
      name: "Electronics",
    },
  },
];
