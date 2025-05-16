import { z } from "zod";

export const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  detail: z.string().min(1, "Detail is required"),
  categoryDto: z.object({
    id: z.number(),
    name: z.string(),
  }),
  image: z.array(z.any()).optional(),
});
