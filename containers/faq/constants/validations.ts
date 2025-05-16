import { z } from "zod";

export const faqSetSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  language: z.string().min(2, "Language is required"),
});

export const formSchema = z.object({
  faqSetDtos: z.array(faqSetSchema).min(3, "All languages (AZ, RU, EN) are required"),
});
