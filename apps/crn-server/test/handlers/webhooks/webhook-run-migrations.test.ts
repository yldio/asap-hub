import { RestMigration } from '@asap-hub/squidex';
import Boom from '@hapi/boom';
import { promises as fsPromise } from 'fs';
import {
  ImportModuleFromPath,
  Migration,
  MigrationModule,
  rollbackFactory,
  runFactory,
} from '../../../src/handlers/webhooks/webhook-run-migrations';
import { identity } from '../../helpers/squidex';
import { loggerMock } from '../../mocks/logger.mock';
import { getSquidexClientMock } from '../../mocks/squidex-client.mock';

describe('Run-migrations Webhook', () => {
  const squidexClientMock = getSquidexClientMock<RestMigration>();
  const mockReadDir: jest.MockedFunction<typeof fsPromise.readdir> = jest.fn();
  const mockHandlerArguments = [{}, {}, undefined] as [any, any, any];
  const mockImportModule: jest.MockedFunction<ImportModuleFromPath> = jest.fn();
  const mockUp = jest.fn();
  const mockDown = jest.fn();
  const MockModule: MigrationModule = (filePath: string) => ({
    up: mockUp,
    down: mockDown,
    getPath: () => filePath,
  });

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
          iv: 'test-migration',
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
        executionPaths.push(this.getPath());

        return Promise.resolve(null);
      });

      await run(...mockHandlerArguments);

      expect(mockUp).toHaveBeenCalledTimes(3);
      expect(executionPaths).toEqual([
        '1-test-migration',
        '2-test-migration',
        '3-test-migration',
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
        executionOrder.push(`execute ${this.getPath()}`);

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
        'execute 1-test-migration',
        'save',
        'execute 2-test-migration',
        'save',
      ]);
    });

    test('Should not insert the migration into Migrations schema if it fails to run and throw after logging execution progress', async () => {
      mockReadDir.mockResolvedValueOnce(['test-migration.ts'] as any);
      squidexClientMock.fetchOne.mockRejectedValueOnce(Boom.notFound());

      const mockDefaultModule = { default: MockModule };
      mockImportModule.mockResolvedValueOnce(mockDefaultModule);

      mockUp.mockRejectedValueOnce(new Error('some error'));

      await expect(run(...mockHandlerArguments)).rejects.toThrow('some error');

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

      await expect(run(...mockHandlerArguments)).rejects.toThrow();
      expect(mockUp).toHaveBeenCalledTimes(2);
      expect(squidexClientMock.create).toHaveBeenCalledWith({
        name: {
          iv: '1-test-migration',
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

    test('Should throw if a migration is present in the Migrations schema but the file is not', async () => {
      squidexClientMock.fetch.mockResolvedValueOnce({
        total: 1,
        items: [
          {
            created: '',
            lastModified: '',
            version: 42,
            id: '',
            data: {
              name: { iv: '1-test-migration.ts' },
            },
          },
        ],
      });
      mockImportModule.mockRejectedValueOnce(new Error('File not found'));

      await expect(rollback(...mockHandlerArguments)).rejects.toThrow(
        'File not found',
      );
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
            version: 42,
            id: 'test-ID-2',
            data: {
              name: { iv: '2-test-migration.ts' },
            },
          },
          {
            created: '',
            lastModified: '',
            version: 42,
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
        version: 42,
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
            version: 42,
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

      await expect(rollback(...mockHandlerArguments)).rejects.toThrow();

      expect(squidexClientMock.delete).not.toHaveBeenCalled();
      expect(loggerMock.error).toHaveBeenCalledWith(
        expect.any(Error),
        expect.stringMatching(/1-test-migration.ts/),
      );
    });

    test('Should throw and log an error if the rollback works but the migration fails to delete from the Migrations schema', async () => {
      squidexClientMock.fetch.mockResolvedValueOnce({
        total: 1,
        items: [
          {
            created: '',
            lastModified: '',
            version: 42,
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
        version: 42,
        id: 'test-ID-2',
        data: {
          name: { iv: '2-test-migration.ts' },
        },
      });
      squidexClientMock.delete.mockRejectedValueOnce(new Error('some error'));

      await expect(rollback(...mockHandlerArguments)).rejects.toThrow(
        'some error',
      );

      expect(mockDown).toHaveBeenCalled();
      expect(squidexClientMock.delete).toHaveBeenCalledWith('test-ID-2');
      expect(loggerMock.error).toBeCalledWith(
        `Rolled back the migration '1-test-migration.ts' but failed to save the rollback progress`,
      );
    });
  });
});
