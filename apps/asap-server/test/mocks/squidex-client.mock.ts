import { Squidex } from '@asap-hub/squidex';

export const getSquidexClientMock = <
  T extends { id: string; data: Record<string, unknown> },
>(): jest.Mocked<Squidex<T>> => ({
  client: null as any,
  collection: 'some collection',
  fetch: jest.fn(),
  fetchById: jest.fn(),
  create: jest.fn(),
  upsert: jest.fn(),
  delete: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  fetchOne: jest.fn(),
});
