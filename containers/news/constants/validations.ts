import { z } from "zod";

export const newsSetSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  language: z.string().min(2, "Language is required"),
});

export const formSchema = z.object({
  newsSets: z.array(newsSetSchema).min(3, "All languages (AZ, RU, EN) are required"),
  images: z.array(z.instanceof(File)).optional(),
  coverImage: z.instanceof(File).refine((file) => file != null, "Cover image is required"),
});
