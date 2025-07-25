import { PaginationQueryDto } from '../dto/common/pagination-query.dto';
import { DrizzlePagination } from '../interfaces/db.interface';

/**
 * Throw error if value is falsy
 */
export function nonNullableUtils<Nullable>(
  nullable: Nullable,
  error: Error,
): NonNullable<Nullable> {
  if (!nullable) {
    throw error;
  }

  return nullable;
}

/**
 * Transform input PaginationQueryDto to DrizzlePagination
 */
export function paginationQueryToDrizzle(
  query: PaginationQueryDto,
): DrizzlePagination {
  return {
    offset: (query.page - 1) * query.size,
    limit: query.size,
  };
}
