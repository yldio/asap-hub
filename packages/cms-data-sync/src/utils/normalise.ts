export const date = (value: unknown): string | null => {
  if (typeof value === 'string' && value.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}/)) {
    return value;
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  return null;
};
