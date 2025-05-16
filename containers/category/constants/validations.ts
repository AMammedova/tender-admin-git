import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  parentId: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number()
  ),
  isActive: z.boolean().default(true),
});
