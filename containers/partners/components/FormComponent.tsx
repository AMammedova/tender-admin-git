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
import { Partner } from "../types/partner-type";
import { partnerService } from "@/lib/services/partnerService";

interface FormComponentProps {
  setIsDialogOpen: (value: boolean) => void;
  onSubmit: (partner: FormData | Partial<Partner>) => Promise<void>;
  isLoading?: boolean;
  partnerId?: number | null;
  initialValues?: Partner;
}

const FormComponent: React.FC<FormComponentProps> = ({
  setIsDialogOpen,
  onSubmit,
  isLoading = false,
  partnerId,
  initialValues,
}) => {
  const t = useTranslations("Partners");
  const [isLoadingPartner, setIsLoadingPartner] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      img: "",
    },
  });

  useEffect(() => {
    const fetchPartnerDetails = async () => {
      if (partnerId) {
        setIsLoadingPartner(true);
        try {
          const response = await partnerService.getPartnerById(partnerId);
          if (response.responseValue) {
            form.reset({
              img: response.responseValue.img || "",
            });
            if (response.responseValue.img) {
              setLogoPreview(response.responseValue.img);
              form.setValue("img", response.responseValue.img, { shouldValidate: true });
            }
          }
        } catch (error) {
          console.error("Error fetching Partner details:", error);
        } finally {
          setIsLoadingPartner(false);
        }
      }
    };

    fetchPartnerDetails();
  }, [partnerId, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
      setLogoPreview(URL.createObjectURL(e.target.files[0]));
      form.setValue("img", e.target.files[0].name, { shouldValidate: true });
    }
  };

  const onFormSubmit = async (formData: { img: string }) => {
    try {
      const data = new FormData();
      if (logoFile) {
        data.append("img", logoFile);
      }
      await onSubmit(data);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onFormSubmit)}
        className="space-y-6 p-6"
      >
        {isLoadingPartner ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
          
            <div className="flex items-center gap-3">
              <FormField
                name="img"
                control={form.control}
                render={() => (
                  <FormItem>
                    <FormLabel>{t("logoFile")}</FormLabel>
                    <FormControl>
                     <div className="flex gap-4">
                     <label className="flex items-center justify-center w-32 h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 mb-4 text-gray-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <p className="text-sm text-gray-500 text-center">
                            {t("uploadImages")}
                          </p>
                        </div>
                        <Input
                          type="file"
                          onChange={handleFileChange}
                          className="hidden"
                          accept="image/*"
                        />
                        
                      </label>
                      {(logoPreview) && (
                          <img
                            src={logoPreview}
                            alt="Logo Preview"
                            className="mt-2 w-24 h-24 object-contain border rounded"
                          />
                        )}
                     </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
          <Button type="submit" disabled={isLoading} className="w-[120px]">
            {isLoading ? t("saving") : t("save")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FormComponent;
