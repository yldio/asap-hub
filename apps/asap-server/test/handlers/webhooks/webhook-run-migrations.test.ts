import Boom from '@hapi/boom';
import {
  ImportModuleFromPath,
  Migration,
  rollbackFactory,
  runFactory,
} from '../../../src/handlers/webhooks/webhook-run-migrations';
import { loggerMock } from '../../mocks/logger.mock';
import { squidexClientMock } from '../../mocks/squidex-client.mock';
import { promises as fsPromise } from 'fs';
import { identity } from '../../helpers/squidex';

describe('Run-migrations Webhook', () => {
  const mockReadDir: jest.MockedFunction<typeof fsPromise.readdir> = jest.fn();
  const mockHandlerArguments = [{}, {}, undefined] as [any, any, any];
  const mockImportModule: jest.MockedFunction<ImportModuleFromPath> = jest.fn();
  const mockUp = jest.fn();
  const mockDown = jest.fn();
  class MockModule extends Migration {
    up = mockUp;
    down = mockDown;
  }

  const run = runFactory(
    loggerMock,
    squidexClientMock,
    mockReadDir,
    mockImportModule,
  );
  const rollback = rollbackFactory(
    loggerMock,
    squidexClientMock,
    mockImportModule,
  );

  beforeAll(() => {
    identity();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Run action', () => {
    test('Should not run anything if no migration files are present', async () => {
      mockReadDir.mockResolvedValueOnce([]);

      await run(...mockHandlerArguments);

      expect(loggerMock.info).toBeCalledWith(`Executed and saved 0 migrations`);
    });

    test('Should not run anything if migration files are present in the directory but also inside the Migrations schema', async () => {
      mockReadDir.mockResolvedValueOnce(['test-migration.ts'] as any);
      squidexClientMock.fetchOne.mockResolvedValueOnce({} as any);

      await run(...mockHandlerArguments);

      expect(loggerMock.info).toBeCalledWith(`Executed and saved 0 migrations`);
    });

    test('Should run the outstanding migration if it is not inside the Migrations schema, then save it in the schema', async () => {
      mockReadDir.mockResolvedValueOnce(['test-migration.ts'] as any);
      squidexClientMock.fetchOne.mockRejectedValueOnce(Boom.notFound());

      const mockDefaultModule = { default: MockModule };
      mockImportModule.mockResolvedValueOnce(mockDefaultModule);

      await run(...mockHandlerArguments);

      expect(mockUp).toHaveBeenCalled();
      expect(squidexClientMock.create).toHaveBeenCalledWith({
        name: {
          iv: 'test-migration.ts',
        },
      });
      expect(loggerMock.info).toBeCalledWith(`Executed and saved 1 migrations`);
    });

    test('Should sort the migrations and execute them in the name order', async () => {
      mockReadDir.mockResolvedValueOnce([
        '2-test-migration.ts',
        '3-test-migration.ts',
        '1-test-migration.ts',
      ] as any);
      squidexClientMock.fetchOne.mockRejectedValue(Boom.notFound());

      const mockDefaultModule = { default: MockModule };
      mockImportModule.mockResolvedValue(mockDefaultModule);

      const executionPaths: string[] = [];
      mockUp.mockImplementation(function (this: Migration) {
        executionPaths.push(this.path);

        return Promise.resolve(null);
      });

      await run(...mockHandlerArguments);

      expect(mockUp).toHaveBeenCalledTimes(3);
      expect(executionPaths).toEqual([
        '1-test-migration.ts',
        '2-test-migration.ts',
        '3-test-migration.ts',
      ]);
    });

    test('Should save progress after each successful migration run', async () => {
      mockReadDir.mockResolvedValueOnce([
        '1-test-migration.ts',
        '2-test-migration.ts',
      ] as any);
      squidexClientMock.fetchOne.mockRejectedValue(Boom.notFound());

      const mockDefaultModule = { default: MockModule };
      mockImportModule.mockResolvedValue(mockDefaultModule);

      const executionOrder: string[] = [];
      mockUp.mockImplementation(function (this: Migration) {
        executionOrder.push(`execute ${this.path}`);

        return Promise.resolve(null);
      });
      squidexClientMock.create.mockImplementation(function () {
        executionOrder.push('save');

        return Promise.resolve({} as any);
      });

      await run(...mockHandlerArguments);

      expect(mockUp).toHaveBeenCalledTimes(2);
      expect(squidexClientMock.create).toHaveBeenCalledTimes(2);
      expect(executionOrder).toEqual([
        'execute 1-test-migration.ts',
        'save',
        'execute 2-test-migration.ts',
        'save',
      ]);
    });

    test('Should not insert the migration into Migrations schema if it fails to run', async () => {
      mockReadDir.mockResolvedValueOnce(['test-migration.ts'] as any);
      squidexClientMock.fetchOne.mockRejectedValueOnce(Boom.notFound());

      const mockDefaultModule = { default: MockModule };
      mockImportModule.mockResolvedValueOnce(mockDefaultModule);

      mockUp.mockRejectedValueOnce(new Error('some error'));

      await run(...mockHandlerArguments);

      expect(mockUp).toHaveBeenCalled();
      expect(squidexClientMock.create).not.toHaveBeenCalled();
      expect(loggerMock.info).toBeCalledWith(`Executed and saved 0 migrations`);
    });

    test('Should not run the consecutive migrations after one fails to run and only save the ones that have', async () => {
      mockReadDir.mockResolvedValueOnce([
        '1-test-migration.ts',
        '2-test-migration.ts',
        '3-test-migration.ts',
      ] as any);
      squidexClientMock.fetchOne.mockRejectedValue(Boom.notFound());

      const mockDefaultModule = { default: MockModule };
      mockImportModule.mockResolvedValue(mockDefaultModule);

      mockUp.mockResolvedValueOnce(null);
      mockUp.mockRejectedValueOnce(new Error());
      mockUp.mockResolvedValueOnce(null);

      await run(...mockHandlerArguments);

      expect(mockUp).toHaveBeenCalledTimes(2);
      expect(squidexClientMock.create).toHaveBeenCalledWith({
        name: {
          iv: '1-test-migration.ts',
        },
      });
      expect(loggerMock.error).toHaveBeenCalledWith(
        expect.any(Error),
        expect.stringMatching(/2-test-migration/),
      );
      expect(loggerMock.info).toBeCalledWith(`Executed and saved 1 migrations`);
    });
  });

  describe('Rollback action', () => {
    test('Should not run anything if no migrations are present in the Migrations schema', async () => {
      squidexClientMock.fetch.mockResolvedValueOnce({
        total: 0,
        items: [],
      });

      await rollback(...mockHandlerArguments);

      expect(mockDown).not.toHaveBeenCalled();
    });

    test('Should not run anything if a migration is present in the Migrations schema but the file is not', async () => {
      squidexClientMock.fetch.mockResolvedValueOnce({
        total: 1,
        items: [
          {
            created: '',
            lastModified: '',
            id: '',
            data: {
              name: { iv: '1-test-migration.ts' },
            },
          },
        ],
      });
      mockImportModule.mockRejectedValueOnce(new Error('File not found'));

      await rollback(...mockHandlerArguments);

      expect(mockDown).not.toHaveBeenCalled();
      expect(loggerMock.error).toHaveBeenCalledWith(
        expect.any(Error),
        expect.stringMatching(/1-test-migration.ts/),
      );
    });

    test('Should only run the latest migration rollback from the Migrations schema and remove it once the rollback has been run', async () => {
      squidexClientMock.fetch.mockResolvedValueOnce({
        total: 2,
        items: [
          {
            created: '',
            lastModified: '',
            id: 'test-ID-2',
            data: {
              name: { iv: '2-test-migration.ts' },
            },
          },
          {
            created: '',
            lastModified: '',
            id: 'test-ID-1',
            data: {
              name: { iv: '1-test-migration.ts' },
            },
          },
        ],
      });
      const mockDefaultModule = { default: MockModule };
      mockImportModule.mockResolvedValueOnce(mockDefaultModule);
      squidexClientMock.fetchOne.mockResolvedValueOnce({
        created: '',
        lastModified: '',
        id: 'test-ID-2',
        data: {
          name: { iv: '2-test-migration.ts' },
        },
      });

      await rollback(...mockHandlerArguments);

      expect(mockDown).toHaveBeenCalled();
      expect(squidexClientMock.delete).toHaveBeenCalledWith('test-ID-2');
      expect(loggerMock.info).toBeCalledWith(
        `Rolled back and removed migration '2-test-migration.ts'`,
      );
    });

    test('Should run rollback and if it fails - report the error but do not remove it from the Migrations schema', async () => {
      squidexClientMock.fetch.mockResolvedValueOnce({
        total: 1,
        items: [
          {
            created: '',
            lastModified: '',
            id: '',
            data: {
              name: { iv: '1-test-migration.ts' },
            },
          },
        ],
      });
      const mockDefaultModule = { default: MockModule };
      mockImportModule.mockResolvedValueOnce(mockDefaultModule);
      mockDown.mockRejectedValueOnce(new Error());

      await rollback(...mockHandlerArguments);

      expect(squidexClientMock.delete).not.toHaveBeenCalled();
      expect(loggerMock.error).toHaveBeenCalledWith(
        expect.any(Error),
        expect.stringMatching(/1-test-migration.ts/),
      );
    });
  });
});
