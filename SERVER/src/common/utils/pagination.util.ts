export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function buildPaginationMeta(page: number, limit: number, totalItems: number): PaginationMeta {
  const totalPages = Math.max(Math.ceil(totalItems / limit), 1);
  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

export function paginationSkip(page = 1, limit = 10): number {
  return (Math.max(page, 1) - 1) * limit;
}

/**
 * Parses the documented `sort` query param format into a Prisma `orderBy`.
 * Supports "-created_at" (desc) and "name:asc" / "name:desc" styles.
 */
export function parseSort(
  sort: string | undefined,
  allowedFields: string[],
  fallback: Record<string, 'asc' | 'desc'>,
): Record<string, 'asc' | 'desc'> {
  if (!sort) return fallback;

  let field = sort;
  let direction: 'asc' | 'desc' = 'asc';

  if (sort.startsWith('-')) {
    field = sort.slice(1);
    direction = 'desc';
  } else if (sort.includes(':')) {
    const [f, d] = sort.split(':');
    field = f;
    direction = d === 'desc' ? 'desc' : 'asc';
  }

  // Accept snake_case query values mapped to camelCase Prisma fields.
  const camel = field.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
  if (!allowedFields.includes(camel)) {
    return fallback;
  }
  return { [camel]: direction };
}
