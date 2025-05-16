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
import { faqService } from "@/lib/services/faqService";
import { formSchema } from "../constants/validations";
import { Faq, FaqSetDto } from "../types/faq-type";
import { toast } from "sonner";

const LANGS = [
  { key: "az", label: "Azərbaycan" },
  { key: "ru", label: "Русский" },
  { key: "en", label: "English" },
];

const initialFaq = {
  az: { id: 0, question: "", answer: "" },
  ru: { id: 0, question: "", answer: "" },
  en: { id: 0, question: "", answer: "" },
};

interface FormComponentProps {
  setIsDialogOpen: (value: boolean) => void;
  onSubmit: (faqSetDtos: FaqSetDto[]) => Promise<void>;
  isLoading?: boolean;
  faqId?: number | null;
  initialValues?: Faq;
}

const FormComponent: React.FC<FormComponentProps> = ({
  setIsDialogOpen,
  onSubmit,
  isLoading = false,
  faqId,
  initialValues,
}) => {
  const t = useTranslations("Faqs");
  const [isLoadingFaq, setIsLoadingFaq] = useState(false);
  const [activeLang, setActiveLang] = useState("az");
  const [faq, setFaq] = useState(initialFaq);
  const [showErrors, setShowErrors] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      faqSetDtos: [],
    },
  });

  useEffect(() => {
    if (faqId) {
      setIsLoadingFaq(true);
      faqService.getFaqById(faqId).then(response => {
        if (response.responseValue) {
          setFaq({
            az: response.responseValue.faqSetDtos.find(f => f.language === "AZ") || { id: 0, question: "", answer: "" },
            ru: response.responseValue.faqSetDtos.find(f => f.language === "RU") || { id: 0, question: "", answer: "" },
            en: response.responseValue.faqSetDtos.find(f => f.language === "EN") || { id: 0, question: "", answer: "" },
          });
        }
      }).finally(() => setIsLoadingFaq(false));
    }
  }, [faqId]);

  const handleChange = (lang: string, field: string, value: string) => {
    setFaq((prev) => ({
      ...prev,
      [lang as keyof typeof prev]: { ...prev[lang as keyof typeof prev], [field]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowErrors(true);

    // Check if all languages are filled
    const allLanguagesFilled = LANGS.every(
      (lang) =>
        faq[lang.key as keyof typeof faq].question.trim() !== "" &&
        faq[lang.key as keyof typeof faq].answer.trim() !== ""
    );

    if (!allLanguagesFilled) {
      toast.error(t("allLanguagesRequired"));
      return;
    }

    const createFaqSetDtos = LANGS.map((lang) => ({
      id: faq[lang.key as keyof typeof faq].id || 0,
      question: faq[lang.key as keyof typeof faq].question,
      answer: faq[lang.key as keyof typeof faq].answer,
      language: lang.key.toUpperCase(),
    }));
    await onSubmit(createFaqSetDtos);
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
                ${activeLang === lang.key
                  ? "bg-white text-black shadow"
                  : "bg-transparent text-gray-500 hover:bg-gray-100"}
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
          <label>{t("question")} <span className="text-red-500">*</span></label>
          <Input
            value={faq[activeLang as keyof typeof faq].question}
            onChange={(e) => handleChange(activeLang, "question", e.target.value)}
            placeholder={t("question")}
          />
          {showErrors && !faq[activeLang as keyof typeof faq].question && (
            <p className="text-red-500 text-sm mt-1">{t("questionRequired")}</p>
          )}
        </div>
        <div>
          <label>{t("answer")} <span className="text-red-500">*</span></label>
          <Textarea
            value={faq[activeLang as keyof typeof faq].answer}
            onChange={(e) => handleChange(activeLang, "answer", e.target.value)}
            placeholder={t("answer")}
          />
          {showErrors && !faq[activeLang as keyof typeof faq].answer && (
            <p className="text-red-500 text-sm mt-1">{t("answerRequired")}</p>
          )}
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
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
