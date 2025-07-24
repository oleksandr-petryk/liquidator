/**
 * This function can be used to throw error if value is falsy
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
