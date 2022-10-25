import {
  ImportModuleFromPath,
  rollbackMigrationFactory as rollbackFactory,
  runMigrationFactory as runFactory,
} from '@asap-hub/server-common';
import { RestMigration, SquidexRest } from '@asap-hub/squidex';
import { promises as fsPromise } from 'fs';
import { appName, baseUrl } from '../../config';
import { getAuthToken } from '../../utils/auth';
import pinoLogger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

const squidexClient = new SquidexRest<RestMigration>(
  getAuthToken,
  'migrations',
  { appName, baseUrl },
);

const importModuleFromPath: ImportModuleFromPath = (filePath: string) =>
  import(`../../migrations/${filePath}`);

const getMigrationPaths = async () => await fsPromise.readdir(`./migrations`);

export const runHandler = runFactory(
  pinoLogger,
  squidexClient,
  getMigrationPaths,
  importModuleFromPath,
);
export const rollbackHandler = rollbackFactory(
  pinoLogger,
  squidexClient,
  importModuleFromPath,
);

/* istanbul ignore next */
export const run = sentryWrapper(runHandler);

/* istanbul ignore next */
export const rollback = sentryWrapper(rollbackHandler);
