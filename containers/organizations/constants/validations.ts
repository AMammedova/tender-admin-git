import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  logoFile: z.string().min(1, "Logo is required"),
});
