import { z } from "zod";

export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: z.union([dataSchema, z.array(dataSchema), z.null()]).nullable(),
    error: z.array(z.string().nullable()),
    message: z.string(),
    success: z.boolean()
  });
