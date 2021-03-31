import { Handler } from 'aws-lambda';
import { promises } from 'fs';
import logger from '../../utils/logger';

export const run: Handler = async () => {
  const migrations = await getMigrations();

  for (const migration of migrations) {
    await migration.up();
  }
};

export const rollback: Handler = async () => {
  const migrations = await getMigrations();

  for (const migration of migrations) {
    await migration.down();
  }
};

const migrationDir = `${__dirname}/../../migrations`;

const getMigrations = async (): Promise<Migration[]> => {
  const files = (await promises.readdir(migrationDir)).sort();

  const migrations = Promise.all(
    files.map(async (file) => {
      logger.debug({ file });
      const { default: Module } = await import(`${migrationDir}/${file}`);

      if (typeof Module !== 'function') {
        throw new Error(`${file} does not export a valid module`);
      }

      const migration = new Module();

      if (!isMigration(migration)) {
        throw new Error(`${file} does not contain a valid migration`);
      }

      return migration;
    }),
  );

  return migrations;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isMigration = (instance: any): instance is Migration =>
  typeof instance.up === 'function' && typeof instance.down === 'function';

export interface Migration {
  up: () => Promise<void>;
  down: () => Promise<void>;
}
