import { nullOnUndefined, withEmptyListFallback } from '../query-fn';

describe('withEmptyListFallback', () => {
  const empty = { total: 0, items: [] };

  it('resolves with the fetched value', async () => {
    await expect(
      withEmptyListFallback(async () => ({ total: 1, items: ['a'] }), empty),
    ).resolves.toEqual({ total: 1, items: ['a'] });
  });

  it('re-throws Error rejections', async () => {
    await expect(
      withEmptyListFallback(async () => {
        throw new Error('boom');
      }, empty),
    ).rejects.toThrow('boom');
  });

  it('resolves with the fallback on non-Error rejections', async () => {
    await expect(
      withEmptyListFallback(
        // eslint-disable-next-line prefer-promise-reject-errors
        () => Promise.reject('not an error'),
        empty,
      ),
    ).resolves.toEqual(empty);
  });
});

describe('nullOnUndefined', () => {
  it('resolves with the fetched value', async () => {
    await expect(nullOnUndefined(async () => 'value')).resolves.toBe('value');
  });

  it('maps undefined to null', async () => {
    await expect(nullOnUndefined(async () => undefined)).resolves.toBeNull();
  });

  it('keeps other falsy values as-is', async () => {
    await expect(nullOnUndefined(async () => 0)).resolves.toBe(0);
  });
});
