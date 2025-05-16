"use client";

import React from "react";
import Image from "next/image";
import { Product } from "../types/product-type";


interface DetailSectionProps {
  product: Product | null;
}

const DetailSection: React.FC<DetailSectionProps> = ({ product }) => {
  if (!product) return <p>No product details available.</p>;

  return (
    <div className="p-6">
      <div className="flex justify-start mb-4">
        <Image
          src={product.image || "/default-image.png"}
          width={240}
          height={240}
          alt={product.name}
          className="rounded-md"
        />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {product.name}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Code
          </dt>
          <dd className="text-base text-gray-900 dark:text-white">
            {product.productCode}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Category
          </dt>
          <dd className="text-base text-gray-900 dark:text-white">
            {product.category?.name}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Quantity
          </dt>
          <dd className="text-base text-gray-900 dark:text-white">
            {product.quantity}
          </dd>
        </div>
      </div>
    </div>
  );
};

export default DetailSection;
