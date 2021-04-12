import { Query, RestMigration, Squidex } from '@asap-hub/squidex';
import { isBoom } from '@hapi/boom';
import { Handler } from 'aws-lambda';
import { promises as fsPromise } from 'fs';
import { Logger } from 'pino';
import { migrationDir } from '../../config';
import pinoLogger from '../../utils/logger';

const squidexClient = new Squidex<RestMigration>('migration');

export const runFactory = (
  logger: Logger,
  client: Squidex<RestMigration>,
  readDir: typeof fsPromise.readdir,
  importModule: ImportModuleFromPath,
): Handler => async () => {
  const getMigrationPaths = getMigrationPathsFromDirectoryFactory(readDir);
  const filterUnexecutedMigrations = filterUnexecutedMigrationsFactory(client);
  const saveExecutedMigration = saveExecutedMigrationFactory(client);
  const getMigrationsFromPaths = getMigrationsFromPathsFactory(
    importModule,
    logger,
  );

  const migrationPaths = await getMigrationPaths();
  const unexecutedMigrationPaths = await filterUnexecutedMigrations(
    migrationPaths,
  );

  logger.debug(
    { migrations: unexecutedMigrationPaths },
    'Outstanding migrations',
  );

  const migrations = await getMigrationsFromPaths(unexecutedMigrationPaths);

  const executedMigrations: string[] = [];

  for (const migration of migrations) {
    logger.debug(`Executing migration '${migration.getPath()}`);
    try {
      await migration.up();
      executedMigrations.push(migration.getPath());
      logger.info(`Executed migration '${migration.getPath()}`);

      await saveExecutedMigration(migration.getPath());
      logger.debug(`Saved migration progress`);
    } catch (error) {
      logger.error(
        error,
        `Error executing the migration ${migration.getPath()}`,
      );
      break;
    }
  }

  logger.info(`Executed and saved ${executedMigrations.length} migrations`);
};

export const rollbackFactory = (
  logger: Logger,
  client: Squidex<RestMigration>,
  importModule: ImportModuleFromPath,
): Handler => async () => {
  const getLatestMigrationPathFromDb = getLatestMigrationPathFromDbFactory(
    client,
  );
  const getMigrationsFromPaths = getMigrationsFromPathsFactory(
    importModule,
    logger,
  );
  const removeExecutedMigration = removeExecutedMigrationFactory(client);

  const migrationPath = await getLatestMigrationPathFromDb();

  logger.debug({ migrations: migrationPath }, 'Latest migrations');

  if (migrationPath !== null) {
    let migration: Migration;
    try {
      [migration] = await getMigrationsFromPaths([migrationPath]);
    } catch (error) {
      logger.error(
        error,
        `Could not load the migration from file ${migrationPath}`,
      );

      return;
    }

    logger.debug(`Executing rollback of migration '${migration.getPath()}`);

    try {
      await migration.down();
    } catch (error) {
      logger.error(
        error,
        `Error executing the rollback of migration ${migration.getPath()}`,
      );
      return;
    }

    logger.debug('Finished executing rollback, saving progress...');

    await removeExecutedMigration(migrationPath);

    logger.info(`Rolled back and removed migration '${migration.getPath()}'`);
  }
};

const getMigrationPathsFromDirectoryFactory = (
  readDir: typeof fsPromise.readdir,
) => async () => (await readDir(migrationDir)).sort();

const getLatestMigrationPathFromDbFactory = (
  client: Squidex<RestMigration>,
) => async (): Promise<string | null> => {
  const query: Query = {
    take: 1,
    skip: 0,
    sort: [{ path: 'data.name.iv', order: 'descending' }],
  };

  const { items: migrations } = await client.fetch(query);

  if (migrations.length === 0) {
    return null;
  }

  return migrations[0].data.name.iv;
};

const importModuleFromPath = (path: string): Promise<Module> => import(path);
export type ImportModuleFromPath = typeof importModuleFromPath;

type Module = {
  default?: { new (path: string): Migration | unknown };
};

const getMigrationsFromPathsFactory = (
  importModule: typeof importModuleFromPath,
  logger: Logger,
) => async (migrationPaths: string[]): Promise<Migration[]> => {
  const migrations = Promise.all(
    migrationPaths.map(async (file) => {
      logger.debug({ file });
      const { default: ImportedModule } = await importModule(
        `${migrationDir}/${file}`,
      );

      if (typeof ImportedModule !== 'function') {
        throw new Error(`${file} does not export a valid module`);
      }

      const migration = new ImportedModule(file);

      if (!isMigration(migration)) {
        throw new Error(`${file} does not contain a valid migration`);
      }

      return migration;
    }),
  );

  return migrations;
};

const filterUnexecutedMigrationsFactory = (client: Squidex<RestMigration>) =>
  filterMigrationsFactory(client);

const filterMigrationsFactory = (client: Squidex<RestMigration>) => (
  migrationPaths: string[],
) => {
  const asyncFilter = async <T>(
    arr: T[],
    predicate: (elem: T) => Promise<boolean>,
  ): Promise<T[]> => {
    const results = await Promise.all(arr.map(predicate));

    return arr.filter((_v, index) => results[index]);
  };

  return asyncFilter(migrationPaths, async (migration) => {
    try {
      await client.fetchOne({
        filter: { path: 'data/name/iv', op: 'eq', value: migration },
      });

      return false;
    } catch (error) {
      if (isBoom(error, 404)) {
        return true;
      }

      throw error;
    }
  });
};

const saveExecutedMigrationFactory = (client: Squidex<RestMigration>) => async (
  migration: string,
): Promise<void> => {
  await client.create({
    name: {
      iv: migration,
    },
  });
};

const removeExecutedMigrationFactory = (
  client: Squidex<RestMigration>,
) => async (migration: string): Promise<void> => {
  const migrationRecord = await client.fetchOne({
    filter: { path: 'data/name/iv', op: 'eq', value: migration },
  });
  await client.delete(migrationRecord.id);
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

export const run = runFactory(
  pinoLogger,
  squidexClient,
  fsPromise.readdir,
  importModuleFromPath,
);

export const rollback = rollbackFactory(
  pinoLogger,
  squidexClient,
  importModuleFromPath,
);
