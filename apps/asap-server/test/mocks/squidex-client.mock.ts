import { RestMigration, Squidex } from '@asap-hub/squidex';

export const squidexClientMock: jest.Mocked<Squidex<RestMigration>> = {
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
};
