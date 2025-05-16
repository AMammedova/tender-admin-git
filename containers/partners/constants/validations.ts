import { z } from "zod";

export const formSchema = z.object({
  img: z.string().min(1, "Logo is required"),
});
