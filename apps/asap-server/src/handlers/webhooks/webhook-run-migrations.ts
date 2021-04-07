import { RestMigration, Squidex } from '@asap-hub/squidex';
import { isBoom } from '@hapi/boom';
import { Handler } from 'aws-lambda';
import { promises } from 'fs';
import { migrationDir } from '../../config';
import logger from '../../utils/logger';

const squidexClient = new Squidex<RestMigration>('migration');

export const run: Handler = async () => {
  const migrationPaths = await getMigrationPaths();
  const unexecutedMigrationPaths = await filterUnexecutedMigrations(
    migrationPaths,
  );

  logger.debug(
    { migrations: unexecutedMigrationPaths },
    'Outstanding migrations',
  );

  const migrations = await getMigrationsFromPaths(unexecutedMigrationPaths);

  for (const migration of migrations) {
    logger.debug(`Executing migration '${migration.getPath()}`);
    await migration.up();
    logger.info(`Executed migration '${migration.getPath()}`);
  }

  logger.debug('Finished executing migrations, saving progress...');

  await saveExecutedMigrations(unexecutedMigrationPaths);

  logger.info(`Executed and saved ${migrations.length} migrations`);
};

export const rollback: Handler = async () => {
  const migrationPaths = await getMigrationPaths();
  const executedMigrationPaths = await filterExecutedMigrations(migrationPaths);

  logger.debug({ migrations: executedMigrationPaths }, 'Executed migrations');

  if (executedMigrationPaths.length > 0) {
    // assert non-null because we know the array has at least one element
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const lastMigrationPath = executedMigrationPaths.slice(-1).pop()!;
    const [migration] = await getMigrationsFromPaths([lastMigrationPath]);

    logger.debug(`Executing rollback of migration '${migration.getPath()}`);

    await migration.down();

    logger.debug('Finished executing rollback, saving progress...');

    await removeExecutedMigration(lastMigrationPath);

    logger.info(`Rolled back and removed migration '${migration.getPath()}'`);
  }
};

const getMigrationPaths = async () =>
  (await promises.readdir(migrationDir)).sort();

const getMigrationsFromPaths = async (
  migrationPaths: string[],
): Promise<Migration[]> => {
  const migrations = Promise.all(
    migrationPaths.map(async (file) => {
      logger.debug({ file });
      const { default: Module } = (await import(`${migrationDir}/${file}`)) as {
        default: { new (path: string): Migration };
      };

      if (typeof Module !== 'function') {
        throw new Error(`${file} does not export a valid module`);
      }

      const migration = new Module(file);

      if (!isMigration(migration)) {
        throw new Error(`${file} does not contain a valid migration`);
      }

      return migration;
    }),
  );

  return migrations;
};

const filterUnexecutedMigrations = (migrationPaths: string[]) =>
  filterMigrations(migrationPaths);
const filterExecutedMigrations = (migrationPaths: string[]) =>
  filterMigrations(migrationPaths, false);

const filterMigrations = (migrationPaths: string[], unexecuted = true) => {
  const asyncFilter = async <T>(
    arr: T[],
    predicate: (elem: T) => Promise<boolean>,
  ): Promise<T[]> => {
    const results = await Promise.all(arr.map(predicate));

    return arr.filter((_v, index) => results[index]);
  };

  return asyncFilter(migrationPaths, async (migration) => {
    try {
      await squidexClient.fetchOne({
        filter: { path: 'data/name/iv', op: 'eq', value: migration },
      });

      return !unexecuted;
    } catch (error) {
      if (isBoom(error, 404)) {
        return unexecuted;
      }

      throw error;
    }
  });
};

const saveExecutedMigrations = async (migrations: string[]): Promise<void> => {
  for (const migration of migrations) {
    await squidexClient.create({
      name: {
        iv: migration,
      },
    });
  }
};

const removeExecutedMigration = async (migration: string): Promise<void> => {
  const migrationRecord = await squidexClient.fetchOne({
    filter: { path: 'data/name/iv', op: 'eq', value: migration },
  });
  await squidexClient.delete(migrationRecord.id);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isMigration = (instance: any): instance is Migration =>
  typeof instance.up === 'function' &&
  typeof instance.down === 'function' &&
  typeof instance.getPath === 'function';

export abstract class Migration {
  path: string;

  constructor(path: string) {
    this.path = path;
  }
  abstract up: () => Promise<void>;
  abstract down: () => Promise<void>;
  getPath(): string {
    return this.path;
  }
}
