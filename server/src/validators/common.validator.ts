import { z } from 'zod';

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export function parsePagination(query: Record<string, unknown>): { page: number; limit: number; skip: number } {
  const { page, limit } = paginationQuerySchema.parse(query);
  return { page, limit, skip: (page - 1) * limit };
}
