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
import { AttributesSection } from "../types/attributesSection-type";
import { attributeSectionService } from "@/lib/services/attributesSectionService";


interface FormComponentProps {
  setIsDialogOpen: (value: boolean) => void;
  onSubmit: (attributeSection: Partial<AttributesSection>) => Promise<void>;
  isLoading?: boolean;
  attributeSectionId?: number | null;
  initialValues?: AttributesSection;
}

const FormComponent: React.FC<FormComponentProps> = ({
  setIsDialogOpen,
  onSubmit,
  isLoading = false,
  attributeSectionId,
  initialValues,
}) => {
  const t = useTranslations("AttributesSection");
  const [isLoadingAttributeSection, setIsLoadingAttributeSection] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    const fetchAttributeSectionDetails = async () => {
      if (attributeSectionId) {
        setIsLoadingAttributeSection(true);
        try {
          const response = await attributeSectionService.getAttributeSectionById(attributeSectionId);
          if (response.responseValue) {
            form.reset({
              name: response.responseValue.name,
              
            });
          }
        } catch (error) {
          console.error('Error fetching AttributesSection details:', error);
        } finally {
          setIsLoadingAttributeSection(false);
        }
      }
    };

    fetchAttributeSectionDetails();
  }, [attributeSectionId, form]);

  const onFormSubmit = async (formData: { name: string }) => {
    try {
      await onSubmit({ name: formData.name });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6 p-6">
        {isLoadingAttributeSection ? (
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
