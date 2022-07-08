import { CacheClient, MemoryCacheClient } from '../../src/clients/cache.client';

describe('Memory cache client', () => {
  let cacheClient: CacheClient<string>;

  beforeEach(() => {
    cacheClient = new MemoryCacheClient<string>();
  });

  test('Should receive null when the element is not set', async () => {
    expect(cacheClient.get('some-key')).toBeNull();
  });

  test('Should receive the element when the element is set', async () => {
    const key = 'some key';
    const value = 'some value';
    cacheClient.set(key, value);

    expect(cacheClient.get(key)).toBe(value);
  });

  test('Should receive null if another element is set with a different name', async () => {
    const key = 'some key';
    const value = 'some value';
    cacheClient.set('some other key', value);

    expect(cacheClient.get(key)).toBeNull();
  });

  test('Should receive the element, purge the cache and then receive null for the same key', async () => {
    const key = 'some key';
    const value = 'some value';
    cacheClient.set(key, value);

    expect(cacheClient.get(key)).toBe(value);

    cacheClient.purge();
    expect(cacheClient.get(key)).toBeNull();
  });

  test('Should set the element with a key in one instance and get null from another instance using the same key', async () => {
    const key = 'some key';
    const value = 'some value';
    cacheClient.set(key, value);

    const newCacheClient = new MemoryCacheClient<string>();

    expect(cacheClient.get(key)).toBe(value);
    expect(newCacheClient.get(key)).toBeNull();
  });
});
