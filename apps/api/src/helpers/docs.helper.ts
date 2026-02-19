import { z } from "zod";
import { resolver, type DescribeRouteOptions } from "hono-openapi";
import { apiResponseSchema } from "../schemas/api.schema.js";

type ResponseWithContent = Extract<NonNullable<DescribeRouteOptions["responses"]>[string], { content?: unknown }>;

type JsonContentType = NonNullable<ResponseWithContent["content"]>;

export const docsJsonContent = (schema: z.ZodTypeAny): JsonContentType => ({
  "application/json": {
    schema: resolver(apiResponseSchema(schema))
  }
});
export const paginatedDocsJsonContent = (schema: z.ZodTypeAny): JsonContentType => ({
  "application/json": {
    schema: resolver(
      apiResponseSchema(
        z.object({
          items: z.array(schema),
          meta: z.object({
            page: z.number(),
            limit: z.number(),
            totalItems: z.number(),
            totalPages: z.number(),
            hasNextPage: z.boolean(),
            hasPreviousPage: z.boolean()
          })
        })
      )
    )
  }
});
export const docsErrorResponse = (status: number, description: string): Record<string, unknown> => ({
  [status]: {
    description,
    content: docsJsonContent(z.null())
  }
});
