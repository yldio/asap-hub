import { NotFoundError } from '@asap-hub/errors';
import { Migration } from '@asap-hub/server-common';
import { SquidexRest } from '@asap-hub/squidex';
import promises from 'fs/promises';
import {
  rollbackHandler,
  runHandler,
} from '../../../src/handlers/webhooks/webhook-run-migrations';
import pinoLogger from '../../../src/utils/logger';

const mockUp = jest.fn();
const mockDown = jest.fn();
class MockModule extends Migration {
  up = mockUp;
  down = mockDown;
}
jest.mock('fs/promises');
jest.mock('../../../src/migrations/test-migration', () => MockModule, {
  virtual: true,
});
jest.mock('../../../src/migrations/1-test-migration', () => MockModule, {
  virtual: true,
});
jest.mock('../../../src/migrations/2-test-migration', () => MockModule, {
  virtual: true,
});
jest.mock('../../../src/migrations/3-test-migration', () => MockModule, {
  virtual: true,
});
describe('Run-migrations Webhook', () => {
  const mockFSPromises = promises as jest.Mocked<typeof promises>;
  const mockHandlerArguments = [{}, {}, undefined] as [any, any, any];

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('Run action', () => {
    test('Should not run anything if no migration files are present', async () => {
      const spy = jest.spyOn(pinoLogger, 'info');
      mockFSPromises.readdir.mockResolvedValueOnce([]);

      await runHandler(...mockHandlerArguments);

      expect(spy).toBeCalledWith(`Executed and saved 0 migrations`);
    });

    test('Should not run anything if migration files are present in the directory but also inside the Migrations schema', async () => {
      const spy = jest.spyOn(pinoLogger, 'info');
      mockFSPromises.readdir.mockResolvedValueOnce([
        'test-migration.ts' as any,
      ]);
      jest.spyOn(SquidexRest.prototype, 'fetchOne').mockResolvedValueOnce({});

      await runHandler(...mockHandlerArguments);

      expect(spy).toBeCalledWith(`Executed and saved 0 migrations`);
    });

    test('Should run the outstanding migration if it is not inside the Migrations schema, then save it in the schema', async () => {
      const loggerInfoSpy = jest.spyOn(pinoLogger, 'info');
      mockFSPromises.readdir.mockResolvedValueOnce([
        'test-migration.ts' as any,
      ]);
      const squidexCreateSpy = jest
        .spyOn(SquidexRest.prototype, 'create')
        .mockResolvedValueOnce(201);
      jest
        .spyOn(SquidexRest.prototype, 'fetchOne')
        .mockRejectedValueOnce(new NotFoundError(undefined));

      await runHandler(...mockHandlerArguments);

      expect(mockUp).toHaveBeenCalled();
      expect(squidexCreateSpy).toHaveBeenCalledWith({
        name: {
          iv: 'test-migration',
        },
      });
      expect(loggerInfoSpy).toBeCalledWith(`Executed and saved 1 migrations`);
    });

    test('Should sort the migrations and execute them in the name order', async () => {
      mockFSPromises.readdir.mockResolvedValueOnce([
        '2-test-migration.ts',
        '3-test-migration.ts',
        '1-test-migration.ts',
      ] as any);
      jest
        .spyOn(SquidexRest.prototype, 'fetchOne')
        .mockRejectedValue(new NotFoundError(undefined));

      const executionPaths: string[] = [];
      mockUp.mockImplementation(function (this: Migration) {
        executionPaths.push(this.path);

        return Promise.resolve(null);
      });

      jest.spyOn(SquidexRest.prototype, 'create').mockResolvedValue(201);
      await runHandler(...mockHandlerArguments);

      expect(mockUp).toHaveBeenCalledTimes(3);
      expect(executionPaths).toEqual([
        '1-test-migration',
        '2-test-migration',
        '3-test-migration',
      ]);
    });

    test('Should save progress after each successful migration run', async () => {
      mockFSPromises.readdir.mockResolvedValueOnce([
        '1-test-migration.ts',
        '2-test-migration.ts',
      ] as any);
      jest
        .spyOn(SquidexRest.prototype, 'fetchOne')
        .mockRejectedValue(new NotFoundError(undefined));

      const executionOrder: string[] = [];
      mockUp.mockImplementation(function (this: Migration) {
        executionOrder.push(`execute ${this.path}`);

        return Promise.resolve(null);
      });
      const squidexCreateSpy = jest
        .spyOn(SquidexRest.prototype, 'create')
        .mockImplementation(function () {
          executionOrder.push('save');

          return Promise.resolve({} as any);
        });

      await runHandler(...mockHandlerArguments);

      expect(mockUp).toHaveBeenCalledTimes(2);
      expect(squidexCreateSpy).toHaveBeenCalledTimes(2);
      expect(executionOrder).toEqual([
        'execute 1-test-migration',
        'save',
        'execute 2-test-migration',
        'save',
      ]);
    });

    test('Should not insert the migration into Migrations schema if it fails to run and throw after logging execution progress', async () => {
      const loggerInfoSpy = jest.spyOn(pinoLogger, 'info');
      mockFSPromises.readdir.mockResolvedValueOnce([
        'test-migration.ts',
      ] as any);
      jest
        .spyOn(SquidexRest.prototype, 'fetchOne')
        .mockRejectedValueOnce(new NotFoundError(undefined));

      mockUp.mockRejectedValueOnce(new Error('some error'));

      const squidexCreateSpy = jest.spyOn(SquidexRest.prototype, 'create');
      await expect(runHandler(...mockHandlerArguments)).rejects.toThrow(
        'some error',
      );

      expect(mockUp).toHaveBeenCalled();
      expect(squidexCreateSpy).not.toHaveBeenCalled();
      expect(loggerInfoSpy).toBeCalledWith(`Executed and saved 0 migrations`);
    });

    test.only('Should not run the consecutive migrations after one fails to run and only save the ones that have', async () => {
      const loggerInfoSpy = jest.spyOn(pinoLogger, 'info');
      const loggerErrorSpy = jest.spyOn(pinoLogger, 'error');
      mockFSPromises.readdir.mockResolvedValueOnce([
        '1-test-migration.ts',
        '2-test-migration.ts',
        '3-test-migration.ts',
      ] as any);
      jest
        .spyOn(SquidexRest.prototype, 'fetchOne')
        .mockRejectedValue(new NotFoundError(undefined));

      mockUp.mockResolvedValueOnce(null);
      mockUp.mockRejectedValueOnce(new Error());
      mockUp.mockResolvedValueOnce(null);
      const squidexCreateSpy = jest.spyOn(SquidexRest.prototype, 'create');

      await expect(runHandler(...mockHandlerArguments)).rejects.toThrow();
      expect(mockUp).toHaveBeenCalledTimes(1);
      expect(squidexCreateSpy).toHaveBeenCalledWith({
        name: {
          iv: '1-test-migration',
        },
      });
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        expect.any(Error),
        expect.stringMatching(/1-test-migration/),
      );
      expect(loggerInfoSpy).toBeCalledWith(`Executed and saved 1 migrations`);
    });
  });

  describe('Rollback action', () => {
    test('Should not run anything if no migrations are present in the Migrations schema', async () => {
      jest.spyOn(SquidexRest.prototype, 'fetch').mockResolvedValueOnce({
        total: 0,
        items: [],
      });

      await rollbackHandler(...mockHandlerArguments);

      expect(mockDown).not.toHaveBeenCalled();
    });

    test('Should throw if a migration is present in the Migrations schema but the file is not', async () => {
      const loggerErrorSpy = jest.spyOn(pinoLogger, 'error');
      jest.spyOn(SquidexRest.prototype, 'fetch').mockResolvedValueOnce({
        total: 1,
        items: [
          {
            created: '',
            lastModified: '',
            version: 42,
            id: '',
            data: {
              name: { iv: 'failed-test-migration.ts' },
            },
          },
        ],
      });

      await expect(rollbackHandler(...mockHandlerArguments)).rejects.toThrow(
        /cannot find module/i,
      );
      expect(mockDown).not.toHaveBeenCalled();
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        expect.any(Object),
        expect.stringMatching(/failed-test-migration.ts/),
      );
    });

    test('Should only run the latest migration rollback from the Migrations schema and remove it once the rollback has been run', async () => {
      jest.spyOn(SquidexRest.prototype, 'fetch').mockResolvedValueOnce({
        total: 2,
        items: [
          {
            created: '',
            lastModified: '',
            version: 42,
            id: 'test-ID-2',
            data: {
              name: { iv: '2-test-migration' },
            },
          },
          {
            created: '',
            lastModified: '',
            version: 42,
            id: 'test-ID-1',
            data: {
              name: { iv: '1-test-migration' },
            },
          },
        ],
      });
      jest.spyOn(SquidexRest.prototype, 'fetchOne').mockResolvedValueOnce({
        created: '',
        lastModified: '',
        version: 42,
        id: 'test-ID-2',
        data: {
          name: { iv: '2-test-migration.ts' },
        },
      });
      const squidexDeleteSpy = jest
        .spyOn(SquidexRest.prototype, 'delete')
        .mockResolvedValue({} as any);
      const loggerInfoSpy = jest.spyOn(pinoLogger, 'info');

      await rollbackHandler(...mockHandlerArguments);

      expect(mockDown).toHaveBeenCalled();
      expect(squidexDeleteSpy).toHaveBeenCalledWith('test-ID-2');
      expect(loggerInfoSpy).toBeCalledWith(
        `Rolled back and removed migration '2-test-migration'`,
      );
    });

    test('Should run rollback and if it fails - report the error but do not remove it from the Migrations schema', async () => {
      const loggerErrorSpy = jest.spyOn(pinoLogger, 'error');
      jest.spyOn(SquidexRest.prototype, 'fetch').mockResolvedValueOnce({
        total: 1,
        items: [
          {
            created: '',
            lastModified: '',
            version: 42,
            id: '',
            data: {
              name: { iv: '1-test-migration' },
            },
          },
        ],
      });
      mockDown.mockRejectedValueOnce(new Error());
      const squidexDeleteSpy = jest.spyOn(SquidexRest.prototype, 'delete');

      await expect(rollbackHandler(...mockHandlerArguments)).rejects.toThrow();

      expect(squidexDeleteSpy).not.toHaveBeenCalled();
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        expect.any(Error),
        expect.stringMatching(/1-test-migration/),
      );
    });

    test('Should throw and log an error if the rollback works but the migration fails to delete from the Migrations schema', async () => {
      const loggerErrorSpy = jest.spyOn(pinoLogger, 'error');
      jest.spyOn(SquidexRest.prototype, 'fetch').mockResolvedValueOnce({
        total: 1,
        items: [
          {
            created: '',
            lastModified: '',
            version: 42,
            id: 'test-ID-1',
            data: {
              name: { iv: '1-test-migration' },
            },
          },
        ],
      });
      jest.spyOn(SquidexRest.prototype, 'fetchOne').mockResolvedValueOnce({
        created: '',
        lastModified: '',
        version: 42,
        id: 'test-ID-2',
        data: {
          name: { iv: '2-test-migration.ts' },
        },
      });
      const squidexDeleteSpy = jest
        .spyOn(SquidexRest.prototype, 'delete')
        .mockRejectedValueOnce(new Error('some error'));

      await expect(rollbackHandler(...mockHandlerArguments)).rejects.toThrow(
        'some error',
      );

      expect(mockDown).toHaveBeenCalled();
      expect(squidexDeleteSpy).toHaveBeenCalledWith('test-ID-2');
      expect(loggerErrorSpy).toBeCalledWith(
        `Rolled back the migration '1-test-migration' but failed to save the rollback progress`,
      );
    });
  });
});
