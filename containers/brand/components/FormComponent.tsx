"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { useTranslations } from "next-intl";
import { formSchema } from "../constants/validations";
import { Brand } from "../types/brand-type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { brandService } from "@/lib/services/brandService";
import { Category, categoryService } from "@/lib/services/categoryService";

interface FormComponentProps {
  setIsDialogOpen: (value: boolean) => void;
  onSubmit: (brand: Partial<Brand>) => Promise<void>;
  isLoading?: boolean;
  brandId?: number | null;
  initialValues?: Brand;
}

const FormComponent: React.FC<FormComponentProps> = ({
  setIsDialogOpen,
  onSubmit,
  isLoading = false,
  brandId,
  initialValues,
}) => {
  const t = useTranslations("Brands");
  const [isLoadingBrand, setIsLoadingBrand] = useState(false);
  const [category, setCategory] = useState<Category[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    const fetchBrandDetails = async () => {
      if (brandId) {
        setIsLoadingBrand(true);
        try {
          const response = await brandService.getBrandById(brandId);
          if (response.responseValue) {
            form.reset({
              name: response.responseValue.name,
              categoryId: String(response.responseValue.categoryId),
            });
          }
        } catch (error) {
          console.error('Error fetching Brand details:', error);
        } finally {
          setIsLoadingBrand(false);
        }
      }
    };

    fetchBrandDetails();
  }, [brandId, form]);

  useEffect(() => {
    const fetchCategory = async () => {
      const response = await categoryService.getCategoryAll();
      if (response.responseValue) {
        setCategory(response.responseValue);
      }
    };
    fetchCategory();
  }, []);

  const onFormSubmit = async (formData: { name: string;  categoryId: string }) => {
    try {
      await onSubmit({
        name: formData.name,
        categoryId: Number(formData.categoryId),
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6 p-6">
        {isLoadingBrand ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("name")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("namePlaceholder")}
                      className="h-10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
           
            <FormField
              name="categoryId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("category")}</FormLabel>
                  <FormControl>
                    <Select 
                      {...field}
                      // placeholder={t("organizationPlaceholder")}
                      // className="h-10"
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("categoryPlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {category.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <div className="flex justify-end gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
            className="w-[120px]"
          >
            {t("cancel")}
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-[120px]"
          >
            {isLoading ? t("saving") : t("save")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FormComponent;
