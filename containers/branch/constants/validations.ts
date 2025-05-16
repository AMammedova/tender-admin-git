import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.number().min(1, "Code is required"),
  address: z.object({
    name: z.string().min(1, "Address is required"),
    latitude: z.number(),
    longitude: z.number(),
  }),
});
