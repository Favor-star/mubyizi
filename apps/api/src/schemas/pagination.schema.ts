import { z } from "zod";

export const paginationQuerySchema = z.object({
  page: z.coerce.number<string>("The page is expected to be a valid number").int().min(1).default(1),
  limit: z.coerce.number<string>("The limit is expected to be a valid number").int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  sortBy: z.string().optional(),
  order: z.enum(["asc", "desc"]).default("desc")
});
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;