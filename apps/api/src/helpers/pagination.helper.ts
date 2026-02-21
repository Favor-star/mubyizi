import { QueryMode } from "../lib/generated/prisma/internal/prismaNamespace.js";
import { type PaginationQuery } from "../schemas/pagination.schema.js";

export const getPagination = (query: PaginationQuery) => {
  const { page, limit } = query;

  const take = limit;
  const skip = (page - 1) * limit;

  return { ...query, page, limit, take, skip };
};

export const buildPaginationMeta = (page: number, limit: number, totalItems: number) => {
  const totalPages = Math.ceil(totalItems / limit);

  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};

export const whereSearchQueryBuilder = <T>(query: PaginationQuery, fields: (keyof T)[]) => {
  const fieldBuilder = (field: string) => ({
    [field]: {
      contains: query.search,
      mode: "insensitive" as QueryMode
    }
  });
  return query.search
    ? {
        OR: fields.map((field) => fieldBuilder(field as string))
      }
    : undefined;
};
