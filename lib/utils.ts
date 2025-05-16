import { Category } from "@/containers/category/types/category-type"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function buildCategoryTree(categories: Category[], parentId: number | null = 0): Category[] {
  return categories
    .filter(cat => (cat.parentId ?? 0) === parentId)
    .map(cat => ({
      ...cat,
      children: buildCategoryTree(categories, cat.id)
    }));
}

