"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import { formSchema } from "../constants/validations";
import { Images, News, NewsSets } from "@/containers/news/type/news-type";
import { newsService } from "@/lib/services/newsService";
import Image from "next/image";
import { toast } from "sonner";

const LANGS = [
  { key: "az", label: "Azərbaycan" },
  { key: "ru", label: "Русский" },
  { key: "en", label: "English" },
];

const initialNews = {
  az: { title: "", description: "" },
  ru: { title: "", description: "" },
  en: { title: "", description: "" },
};

interface FormComponentProps {
  setIsDialogOpen: (value: boolean) => void;
  onSubmit: (params: {
    id: number | null;
    newsSets: NewsSets[];
    images: File[];
    coverImage: File | null;
    deletedImgId: number[];
  }) => Promise<void>;
  isLoading?: boolean;
  newsId?: number | null;
  initialValues?: any;
}

const FormComponent: React.FC<FormComponentProps> = ({
  setIsDialogOpen,
  onSubmit,
  isLoading = false,
  newsId,
  initialValues,
}) => {
  const t = useTranslations("News");
  const [isLoadingNews, setIsLoadingNews] = useState(false);
  const [activeLang, setActiveLang] = useState("az");
  const [news, setNews] = useState(initialNews);
  const [images, setImages] = useState<File[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<Images[]>([]);
  const [existingCoverImage, setExistingCoverImage] = useState<string | null>(
    null
  );
  const [removedExistingImages, setRemovedExistingImages] = useState<number[]>([]);
  const [showErrors, setShowErrors] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newsSets: [],
      images: [],
      coverImage: undefined,
    },
  });

  const { formState: { errors } } = form;

  useEffect(() => {
    if (newsId) {
      setIsLoadingNews(true);
      newsService
        .getNewsById(newsId)
        .then((response) => {
          if (response.responseValue) {
            setNews({
              az: response.responseValue.newsSets.find(
                (f) => f.language === "AZ"
              ) || { title: "", description: "" },
              ru: response.responseValue.newsSets.find(
                (f) => f.language === "RU"
              ) || { title: "", description: "" },
              en: response.responseValue.newsSets.find(
                (f) => f.language === "EN"
              ) || { title: "", description: "" },
            });
            setExistingCoverImage(response.responseValue.coverImage || null);
            setExistingImages(response.responseValue.images || []);
          }
        })
        .finally(() => setIsLoadingNews(false));
    }
  }, [newsId]);

  const handleChange = (lang: string, field: string, value: string) => {
    setNews((prev) => ({
      ...prev,
      [lang as keyof typeof prev]: {
        ...prev[lang as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setImages((prevImages) => [...prevImages, ...selectedFiles]);
      const newPreviewUrls = selectedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    }
  };

  const handleRemoveImage = (index: number, isExisting: boolean = false) => {
    if (isExisting) {
      const removedImage = existingImages[index];
      if (removedImage && removedImage.id) {
        setRemovedExistingImages((prev) => [...prev, removedImage.id]);
      }
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
      setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    } else {
      const adjustedIndex = index - existingImages.length;
      setImages((prev) => prev.filter((_, i) => i !== adjustedIndex));
      const removedPreviewUrl = previewUrls[index];
      if (removedPreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(removedPreviewUrl);
      }
      setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setCoverImage(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowErrors(true);

    // Check if all languages are filled
    const allLanguagesFilled = LANGS.every(
      (lang) =>
        news[lang.key as keyof typeof news].title.trim() !== "" &&
        news[lang.key as keyof typeof news].description.trim() !== ""
    );

    if (!allLanguagesFilled) {
      toast.error(t("allLanguagesRequired"));
      return;
    }

    // Check if cover image is selected (for new news) or exists (for edit)
    if (!newsId && !coverImage) {
      toast.error("Cover image is required");
      return;
    }

    const newsSets: NewsSets[] = LANGS.map((lang) => ({
      id: 0,
      title: news[lang.key as keyof typeof news].title,
      description: news[lang.key as keyof typeof news].description,
      language: lang.key.toUpperCase(),
    }));

    await onSubmit({
      id: newsId ?? null,
      newsSets,
      images,
      coverImage,
      deletedImgId: removedExistingImages,
    });
    setIsDialogOpen(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        <div className="flex gap-0 mb-4 bg-[#f5f5f5] rounded-lg p-1 w-fit">
          {LANGS.map((lang) => (
            <Button
              type="button"
              key={lang.key}
              className={`px-6 py-2 rounded-lg font-medium transition-colors
                ${
                  activeLang === lang.key
                    ? "bg-white text-black shadow"
                    : "bg-transparent text-gray-500 hover:bg-gray-100"
                }
                `}
              style={{
                border: "none",
                outline: "none",
                boxShadow: activeLang === lang.key ? "0 2px 8px #0001" : "none",
              }}
              onClick={() => setActiveLang(lang.key)}
            >
              {lang.label}
            </Button>
          ))}
        </div>
        <div>
          <label>{t("titles")} <span className="text-red-500">*</span></label>
          <Input
            value={news[activeLang as keyof typeof news].title}
            onChange={(e) => handleChange(activeLang, "title", e.target.value)}
            placeholder={t("titles")}
          />
          {showErrors && !news[activeLang as keyof typeof news].title && (
            <p className="text-red-500 text-sm mt-1">{t("titleRequired")}</p>
          )}
        </div>
        <div>
          <label>{t("description")} <span className="text-red-500">*</span></label>
          <Textarea
            value={news[activeLang as keyof typeof news].description}
            onChange={(e) =>
              handleChange(activeLang, "description", e.target.value)
            }
            placeholder={t("description")}
          />
          {showErrors && !news[activeLang as keyof typeof news].description && (
            <p className="text-red-500 text-sm mt-1">{t("descriptionRequired")}</p>
          )}
        </div>
        <div>
          <div className="md:col-span-1 flex flex-col justify-end">
            <FormLabel className="mb-4">{t("images")}</FormLabel>
            <div className="grid grid-cols-3 gap-4">
              <label className="flex flex-col items-center justify-center w-28 h-28 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex flex-col items-center justify-center pt-3 pb-3">
                  <svg
                    className="w-8 h-8 mb-2 text-gray-500"
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
                  <p className="text-xs text-gray-500 text-center">
                    {t("uploadImages")}
                  </p>
                </div>
                <Input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </label>

              {existingImages.map((img, i) => (
                <div key={`existing-${i}`} className="relative w-28 h-28">
                  <Image
                    src={img.imageUrl}
                    alt={`Existing ${i}`}
                    fill
                    className="rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i, true)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
              {previewUrls.map((url, i) => (
                <div key={`new-${i}`} className="relative w-28 h-28">
                  <Image
                    src={url}
                    alt={`Preview ${i}`}
                    fill
                    className="rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveImage(i + existingImages.length, false)
                    }
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <FormLabel className="mb-4">{t("coverImage")} <span className="text-red-500">*</span></FormLabel>
          <div className="flex gap-4 items-center">
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
                onChange={handleCoverImageChange}
                className="hidden"
                accept="image/*"
              />
            </label>
            {existingCoverImage && !coverImage && (
              <img
                src={existingCoverImage}
                alt="Current Cover"
                className="mt-2 w-24 h-24 object-contain border rounded"
              />
            )}
            {coverImage && (
              <img
                src={URL.createObjectURL(coverImage)}
                alt="New Cover Preview"
                className="mt-2 w-24 h-24 object-contain border rounded"
              />
            )}
          </div>
          {showErrors && !newsId && !coverImage && !existingCoverImage && (
            <p className="text-red-500 text-sm mt-1">{t("coverImageRequired")}</p>
          )}
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
          >
            {t("cancel")}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? t("saving") : t("save")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FormComponent;
