export const handleError = (err: unknown): Error => {
  if (err instanceof Error) {
    return err;
  }
  return new Error('Unexpected Error');
};
