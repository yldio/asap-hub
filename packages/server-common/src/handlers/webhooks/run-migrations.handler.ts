/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { NotFoundError } from '@asap-hub/errors';
import { Query, RestMigration, SquidexRestClient } from '@asap-hub/squidex';
import { Handler } from 'aws-lambda';
import path from 'path';
import { Logger } from '../../utils';

export type GetMigrationFromPaths = (paths: string[]) => Promise<Migration[]>;
export type GetMigrationPaths = () => Promise<string[]>;
export const runMigrationFactory =
  (
    logger: Logger,
    client: SquidexRestClient<RestMigration>,
    getMigrationPaths: GetMigrationPaths,
    importModuleFromPath: ImportModuleFromPath,
  ): Handler =>
  async () => {
    const filterUnexecutedMigrations =
      filterUnexecutedMigrationsFactory(client);
    const saveExecutedMigration = saveExecutedMigrationFactory(client);
    const migrationPaths = await getMigrationPaths();
    const migrationPathsInOrder = migrationPaths
      .map((filePath) => path.basename(filePath, '.ts'))
      .sort();
    const unexecutedMigrationPaths = await filterUnexecutedMigrations(
      migrationPathsInOrder,
    );

    logger.debug(
      { migrations: unexecutedMigrationPaths },
      'Outstanding migrations',
    );

    const getMigrationsFromPaths = getMigrationsFromPathsFactory(
      importModuleFromPath,
      logger,
    );
    const migrations = await getMigrationsFromPaths(unexecutedMigrationPaths);

    const executedMigrations: string[] = [];
    let executionError: unknown | null = null;
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
        executionError = error;

        break;
      }
    }

    logger.info(`Executed and saved ${executedMigrations.length} migrations`);

    if (executionError !== null) {
      throw executionError;
    }
  };

export const rollbackMigrationFactory =
  (
    logger: Logger,
    client: SquidexRestClient<RestMigration>,
    importModuleFromPath: ImportModuleFromPath,
  ): Handler =>
  async () => {
    const getLatestMigrationPathFromDb =
      getLatestMigrationPathFromDbFactory(client);
    const removeExecutedMigration = removeExecutedMigrationFactory(client);

    const getMigrationsFromPaths = getMigrationsFromPathsFactory(
      importModuleFromPath,
      logger,
    );
    const migrationPath = await getLatestMigrationPathFromDb();

    logger.debug({ migrations: migrationPath }, 'Latest migrations');

    if (migrationPath !== null) {
      let migration;
      try {
        [migration] = await getMigrationsFromPaths([migrationPath]);
      } catch (error) {
        logger.error(
          error,
          `Could not load the migration from file ${migrationPath}`,
        );

        throw error;
      }

      logger.debug(`Executing rollback of migration '${migration!.getPath()}`);

      try {
        await migration!.down();
      } catch (error) {
        logger.error(
          error,
          `Error executing the rollback of migration ${migration!.getPath()}`,
        );

        throw error;
      }

      logger.debug('Finished executing rollback, saving progress...');

      try {
        await removeExecutedMigration(migrationPath);

        logger.info(
          `Rolled back and removed migration '${migration!.getPath()}'`,
        );
      } catch (error) {
        logger.error(
          `Rolled back the migration '${migration!.getPath()}' but failed to save the rollback progress`,
        );

        throw error;
      }
    }
  };

type Module = {
  default?: { new (filePath: string): Migration | unknown };
};
export type ImportModuleFromPath = (filePath: string) => Promise<Module>;

const getMigrationsFromPathsFactory =
  (importModule: ImportModuleFromPath, logger: Logger) =>
  async (migrationPaths: string[]): Promise<Migration[]> => {
    const migrations = Promise.all(
      migrationPaths.map(async (file) => {
        logger.debug({ file });
        const { default: ImportedModule } = await importModule(`${file}`);

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

const getLatestMigrationPathFromDbFactory =
  (client: SquidexRestClient<RestMigration>) =>
  async (): Promise<string | null> => {
    const query: Query = {
      take: 1,
      skip: 0,
      sort: [{ path: 'data.name.iv', order: 'descending' }],
    };

    const { items: migrations } = await client.fetch(query);

    if (!migrations[0]) {
      return null;
    }

    return migrations[0].data.name.iv;
  };

const filterUnexecutedMigrationsFactory = (
  client: SquidexRestClient<RestMigration>,
) => filterMigrationsFactory(client);

const filterMigrationsFactory =
  (client: SquidexRestClient<RestMigration>) => (migrationPaths: string[]) => {
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
        if (error instanceof NotFoundError) {
          return true;
        }

        throw error;
      }
    });
  };

const saveExecutedMigrationFactory =
  (client: SquidexRestClient<RestMigration>) =>
  async (migration: string): Promise<void> => {
    await client.create({
      name: {
        iv: migration,
      },
    });
  };

const removeExecutedMigrationFactory =
  (client: SquidexRestClient<RestMigration>) =>
  async (migration: string): Promise<void> => {
    const migrationRecord = await client.fetchOne({
      filter: { path: 'data/name/iv', op: 'eq', value: migration },
    });
    await client.delete(migrationRecord.id);
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isMigration = (instance: any): instance is Migration =>
  typeof instance.up === 'function' &&
  typeof instance.down === 'function' &&
  typeof instance.getPath === 'function';

export abstract class Migration {
  path: string;
  abstract up: () => Promise<void>;
  abstract down: () => Promise<void>;

  constructor(filePath: string) {
    this.path = filePath;
  }
  getPath(): string {
    return this.path;
  }
}
