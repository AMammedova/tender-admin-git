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
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import { formSchema } from "../constants/validations";
import { Region, regionService } from "@/lib/services/regionService";


interface FormComponentProps {
  setIsDialogOpen: (value: boolean) => void;
  onSubmit: (region: Partial<Region>) => Promise<void>;
  isLoading?: boolean;
  regionId?: number | null;
  initialValues?: Region;
}

const FormComponent: React.FC<FormComponentProps> = ({
  setIsDialogOpen,
  onSubmit,
  isLoading = false,
  regionId,
  initialValues,
}) => {
  const t = useTranslations("Regions");
  const [isLoadingRegion, setIsLoadingRegion] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    const fetchRegionDetails = async () => {
      if (regionId) {
        setIsLoadingRegion(true);
        try {
          const response = await regionService.getRegionById(regionId);
          if (response.responseValue) {
            form.reset({
              name: response.responseValue.name,
              
            });
          }
        } catch (error) {
          console.error('Error fetching Region details:', error);
        } finally {
          setIsLoadingRegion(false);
        }
      }
    };

    fetchRegionDetails();
  }, [regionId, form]);

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
        {isLoadingRegion ? (
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
