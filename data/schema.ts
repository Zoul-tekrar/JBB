import { z } from "zod";

export const projectSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "You must enter a Project name",
    })
    .max(50, {
      message: "The name must be less than 50 characters",
    }),
  address: z.string().min(1, "You must enter a valid Address"),
  notes: z.string().optional(),
});
