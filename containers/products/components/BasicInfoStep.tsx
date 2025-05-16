"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import { Product, ProductFormData } from "../types/product-type";
import { formSchema } from "../constants/validations";
import { useCategoriesAll } from '@/lib/hooks/useCategories';
import { CategoryTreePicker } from "@/containers/category/components/CategoryTreePicker";

interface BasicInfoStepProps {
  initialValues?: Product;
  productId?: number | null;
  existingImages: { id: number; imageUrl: string }[];
  previewUrls: string[];
  setPreviewUrls: React.Dispatch<React.SetStateAction<string[]>>;
  setRemovedExistingImages: React.Dispatch<React.SetStateAction<number[]>>;
  onSubmit: (data: ProductFormData, images: File[]) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  initialValues,
  productId,
  existingImages,
  previewUrls,
  setPreviewUrls,
  setRemovedExistingImages,
  onSubmit,
  onCancel,
  isLoading
}) => {
  const t = useTranslations("Products");
  const [images, setImages] = useState<File[]>([]);
  const { data: categoriesData, isLoading: isCategoriesLoading } = useCategoriesAll();
  const categoryTree = categoriesData?.responseValue || [];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      title: "",
      detail: "",
      categoryDto: {
        id: 0,
        name: "",
      },
      image: [],
    },
  });

  useEffect(() => {
    console.log("initialValues", initialValues)
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues, form]);

  // Cleanup preview URLs
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
  }, [previewUrls]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setImages((prevImages) => [...prevImages, ...selectedFiles]);
      const newPreviewUrls = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const handleRemoveImage = (index: number, isExisting: boolean = false) => {
    if (isExisting) {
      const removedImage = existingImages[index];
      setRemovedExistingImages(prev => [...prev, removedImage.id]);
      // Update previewUrls to reflect the removal
      setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    } else {
      const adjustedIndex = index - existingImages.length;
      setImages(prev => prev.filter((_, i) => i !== adjustedIndex));

      // Remove the preview URL and revoke object URL if it's a blob
      const removedPreviewUrl = previewUrls[index];
      if (removedPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(removedPreviewUrl);
      }
      setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(
      { ...values, image: values.image ?? [] }, // Ensure image is never undefined
      images
    );
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="bg-white rounded-xl  p-2  grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-6">
          <FormField
            name="title"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold mb-2">{t("title")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t("titlePlaceholder")}
                    className="h-12 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="detail"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold mb-2">{t("detail")}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={t("detailPlaceholder")}
                    className="min-h-[100px] rounded-lg focus:ring-0 transition w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel className="text-base font-semibold mb-2">{t("images")}</FormLabel>
            <div className="flex flex-wrap gap-4">
              <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                  </svg>
                  <p className="text-sm text-gray-500 text-center">{t("uploadImages")}</p>
                </div>
                <Input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </label>

              {previewUrls.map((url, i) => (
                <div key={i} className="relative w-32 h-32">
                  <Image
                    src={url}
                    alt={`Preview ${i}`}
                    fill
                    className="rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i, i < existingImages.length)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white rounded-xl  p-2 ">
            <FormLabel className="text-lg font-semibold mb-2 block">{t("category")}</FormLabel>
            <FormField
              name="categoryDto.id"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CategoryTreePicker
                      tree={categoryTree}
                      selectedId={field.value}
                      onSelect={id => form.setValue("categoryDto.id", id ?? 0)}
                      disabled={isCategoriesLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="col-span-full flex justify-end gap-4 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="w-full md:w-[140px] h-12 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
          >
            {t("cancel")}
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-[140px] h-12 rounded-lg bg-primary text-white font-semibold shadow hover:bg-primary-dark transition"
          >
            {isLoading ? t("saving") : t("next")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BasicInfoStep;