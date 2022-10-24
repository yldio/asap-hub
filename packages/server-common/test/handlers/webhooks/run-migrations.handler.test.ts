import { NotFoundError } from '@asap-hub/errors';
import { RestMigration } from '@asap-hub/squidex';
import {
  GetMigrationPaths,
  ImportModuleFromPath,
  Migration,
  rollbackMigrationFactory,
  runMigrationFactory,
} from '../../../src/handlers/webhooks/run-migrations.handler';
import { loggerMock } from '../../mocks/logger.mock';
import { getSquidexClientMock } from '../../mocks/squidex-client.mock';

describe('Run-migrations Webhook', () => {
  const squidexClientMock = getSquidexClientMock<RestMigration>();
  const getMigrationPaths: jest.MockedFunction<GetMigrationPaths> = jest.fn();
  const mockEvent = [{}, {}, undefined] as [any, any, any];
  const mockImportModuleFromPath: jest.MockedFunction<ImportModuleFromPath> =
    jest.fn();
  const mockUp = jest.fn();
  const mockDown = jest.fn();
  class MockModule extends Migration {
    up = mockUp;
    down = mockDown;
  }

  const run = runMigrationFactory(
    loggerMock,
    squidexClientMock,
    getMigrationPaths,
    mockImportModuleFromPath,
  );
  const rollback = rollbackMigrationFactory(
    loggerMock,
    squidexClientMock,
    mockImportModuleFromPath,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Run action', () => {
    test('Should not run anything if no migration files are present', async () => {
      getMigrationPaths.mockResolvedValueOnce([]);

      await run(...mockEvent);

      expect(loggerMock.info).toBeCalledWith(`Executed and saved 0 migrations`);
    });

    test('Should not run anything if migration files are present in the directory but also inside the Migrations schema', async () => {
      getMigrationPaths.mockResolvedValueOnce(['test-migration.ts'] as any);
      squidexClientMock.fetchOne.mockResolvedValueOnce({} as any);

      await run(...mockEvent);

      expect(loggerMock.info).toBeCalledWith(`Executed and saved 0 migrations`);
    });

    test('Should run the outstanding migration if it is not inside the Migrations schema, then save it in the schema', async () => {
      getMigrationPaths.mockResolvedValueOnce(['test-migration.ts'] as any);
      squidexClientMock.fetchOne.mockRejectedValueOnce(
        new NotFoundError(undefined),
      );

      const mockModule = jest.fn().mockImplementation(() => {
        return {
          getPath: () => 'test-migration',
          up: mockUp,
          down: mockDown,
        };
      });

      const mockDefaultModule = { default: mockModule };
      mockImportModuleFromPath.mockResolvedValueOnce(mockDefaultModule);

      await run(...mockEvent);

      expect(mockUp).toHaveBeenCalled();
      expect(squidexClientMock.create).toHaveBeenCalledWith({
        name: {
          iv: 'test-migration',
        },
      });
      expect(loggerMock.info).toBeCalledWith(`Executed and saved 1 migrations`);
    });

    test('Should sort the migrations and execute them in the name order', async () => {
      getMigrationPaths.mockResolvedValueOnce([
        '2-test-migration.ts',
        '3-test-migration.ts',
        '1-test-migration.ts',
      ] as any);
      squidexClientMock.fetchOne.mockRejectedValue(
        new NotFoundError(undefined),
      );

      const mockDefaultModule = { default: MockModule };
      mockImportModuleFromPath.mockResolvedValue(mockDefaultModule);

      const executionPaths: string[] = [];
      mockUp.mockImplementation(function (this: Migration) {
        executionPaths.push(this.path);

        return Promise.resolve(null);
      });

      await run(...mockEvent);

      expect(mockUp).toHaveBeenCalledTimes(3);
      expect(executionPaths).toEqual([
        '1-test-migration',
        '2-test-migration',
        '3-test-migration',
      ]);
    });

    test('Should save progress after each successful migration run', async () => {
      getMigrationPaths.mockResolvedValueOnce([
        '1-test-migration.ts',
        '2-test-migration.ts',
      ] as any);
      squidexClientMock.fetchOne.mockRejectedValue(
        new NotFoundError(undefined),
      );

      const mockDefaultModule = { default: MockModule };
      mockImportModuleFromPath.mockResolvedValue(mockDefaultModule);

      const executionOrder: string[] = [];
      mockUp.mockImplementation(function (this: Migration) {
        executionOrder.push(`execute ${this.path}`);

        return Promise.resolve(null);
      });
      squidexClientMock.create.mockImplementation(function () {
        executionOrder.push('save');

        return Promise.resolve({} as any);
      });

      await run(...mockEvent);

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
      getMigrationPaths.mockResolvedValueOnce(['test-migration.ts'] as any);
      squidexClientMock.fetchOne.mockRejectedValueOnce(
        new NotFoundError(undefined),
      );

      const mockDefaultModule = { default: MockModule };
      mockImportModuleFromPath.mockResolvedValueOnce(mockDefaultModule);

      mockUp.mockRejectedValueOnce(new Error('some error'));

      await expect(run(...mockEvent)).rejects.toThrow('some error');

      expect(mockUp).toHaveBeenCalled();
      expect(squidexClientMock.create).not.toHaveBeenCalled();
      expect(loggerMock.info).toBeCalledWith(`Executed and saved 0 migrations`);
    });

    test('Should not run the consecutive migrations after one fails to run and only save the ones that have', async () => {
      getMigrationPaths.mockResolvedValueOnce([
        '1-test-migration.ts',
        '2-test-migration.ts',
        '3-test-migration.ts',
      ] as any);
      squidexClientMock.fetchOne.mockRejectedValue(
        new NotFoundError(undefined),
      );

      const mockDefaultModule = { default: MockModule };
      mockImportModuleFromPath.mockResolvedValue(mockDefaultModule);

      mockUp.mockResolvedValueOnce(null);
      mockUp.mockRejectedValueOnce(new Error());
      mockUp.mockResolvedValueOnce(null);

      await expect(run(...mockEvent)).rejects.toThrow();
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

      await rollback(...mockEvent);

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
      mockImportModuleFromPath.mockRejectedValueOnce(
        new Error('File not found'),
      );

      await expect(rollback(...mockEvent)).rejects.toThrow('File not found');
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
      mockImportModuleFromPath.mockResolvedValueOnce(mockDefaultModule);
      squidexClientMock.fetchOne.mockResolvedValueOnce({
        created: '',
        lastModified: '',
        version: 42,
        id: 'test-ID-2',
        data: {
          name: { iv: '2-test-migration.ts' },
        },
      });

      await rollback(...mockEvent);

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
      mockImportModuleFromPath.mockResolvedValueOnce(mockDefaultModule);
      mockDown.mockRejectedValueOnce(new Error());

      await expect(rollback(...mockEvent)).rejects.toThrow();

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
      mockImportModuleFromPath.mockResolvedValueOnce(mockDefaultModule);
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

      await expect(rollback(...mockEvent)).rejects.toThrow('some error');

      expect(mockDown).toHaveBeenCalled();
      expect(squidexClientMock.delete).toHaveBeenCalledWith('test-ID-2');
      expect(loggerMock.error).toBeCalledWith(
        `Rolled back the migration '1-test-migration.ts' but failed to save the rollback progress`,
      );
    });
  });
});
