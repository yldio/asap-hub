#!/usr/bin/env node

/* istanbul ignore file */
/* eslint-disable strict */

'use strict';

import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';
import {
  clearAlgoliaIndex,
  deleteAlgoliaIndex,
  getAlgoliaSettings,
  moveAlgoliaIndex,
  removeAlgoliaRecords,
  setAlgoliaAnalyticsSettings,
  setAlgoliaSettings,
  processProductivityPerformance,
} from './scripts/algolia';

const stringType = 'string' as const;
const trueType = true as const;

const appIdOption = {
  alias: 'a',
  type: stringType,
  description: 'The App ID',
  demandOption: trueType,
};

const apikeyOption = {
  alias: 'k',
  type: stringType,
  description: 'The API key',
  demandOption: trueType,
};

const indexOption = {
  alias: 'n',
  type: stringType,
  description: 'Name of the index to remove',
  demandOption: trueType,
};

const appNameOption = {
  alias: 'p',
  description: 'Name of App - crn or gp2',
  type: stringType,
  choices: ['crn', 'gp2'],
  demandOption: trueType,
};

enum ProductivityMetricOption {
  all = 'all',
  'team-productivity' = 'team-productivity',
  'user-productivity' = 'user-productivity',
}

const productivityMetricOption = {
  alias: 'm',
  description: 'Productivity Metric',
  choices: Object.values(ProductivityMetricOption),
  default: ProductivityMetricOption.all,
};

type BaseArguments = {
  appid: string;
  apikey: string;
};

interface ProcessProductivityPerformanceArguments extends BaseArguments {
  index: string;
  metric: 'all' | 'user-productivity' | 'team-productivity';
}

interface DeleteIndexArguments extends BaseArguments {
  index: string;
}

interface ClearIndexArguments extends BaseArguments {
  index: string;
}

interface MoveIndexArguments extends BaseArguments {
  indexfrom: string;
  indexto: string;
}

interface RemoveRecordsArguments extends BaseArguments {
  index: string;
  entityType: string;
}

interface GetSettingsArguments extends BaseArguments {
  index: string;
  appName: string;
}

interface SetSettingsArguments extends BaseArguments {
  index: string;
  appName: string;
}
interface SetAnalyticsSettings extends BaseArguments {
  index: string;
}

// eslint-disable-next-line no-unused-expressions, @typescript-eslint/no-floating-promises
yargs(hideBin(process.argv))
  .command<ProcessProductivityPerformanceArguments>({
    command: 'algolia:process-productivity-performance',
    describe: 'process productivity performance',
    builder: (cli) =>
      cli
        .option('appid', appIdOption)
        .option('apikey', apikeyOption)
        .option('index', indexOption)
        .option('metric', productivityMetricOption),
    handler: async ({ index, appid, apikey, metric }) =>
      processProductivityPerformance({
        algoliaAppId: appid,
        algoliaCiApiKey: apikey,
        indexName: index,
        metric,
      }),
  })
  .command<DeleteIndexArguments>({
    command: 'algolia:delete-index',
    describe: 'deletes the index',
    builder: (cli) =>
      cli
        .option('appid', appIdOption)
        .option('apikey', apikeyOption)
        .option('index', indexOption),
    handler: async ({ index, appid, apikey }) =>
      deleteAlgoliaIndex({
        algoliaAppId: appid,
        algoliaCiApiKey: apikey,
        indexName: index,
      }),
  })
  .command<ClearIndexArguments>({
    command: 'algolia:clear-index',
    describe: 'clears the index',
    builder: (cli) =>
      cli
        .option('appid', appIdOption)
        .option('apikey', apikeyOption)
        .option('index', indexOption),
    handler: async ({ index, appid, apikey }) =>
      clearAlgoliaIndex({
        algoliaAppId: appid,
        algoliaCiApiKey: apikey,
        indexName: index,
      }),
  })
  .command<MoveIndexArguments>({
    command: 'algolia:move-index',
    describe: 'move the index',
    builder: (cli) =>
      cli
        .option('appid', appIdOption)
        .option('apikey', apikeyOption)
        .option('indexfrom', {
          alias: 'n',
          type: stringType,
          description: 'Name of the index to move from',
          demandOption: trueType,
        })
        .option('indexto', {
          alias: 'i',
          type: stringType,
          description: 'Name of the index to move to',
          demandOption: trueType,
        }),
    handler: async ({ indexfrom, indexto, appid, apikey }) =>
      moveAlgoliaIndex({
        algoliaAppId: appid,
        algoliaCiApiKey: apikey,
        indexNameFrom: indexfrom,
        indexNameTo: indexto,
      }),
  })
  .command<RemoveRecordsArguments>({
    command: 'algolia:remove-records',
    describe: 'removes all the records by the entity type',
    builder: (cli) =>
      cli
        .option('appid', appIdOption)
        .option('apikey', apikeyOption)
        .option('index', indexOption)
        .option('entityType', {
          alias: 'e',
          type: stringType,
          description: 'Entity meta type',
          demandOption: trueType,
        }),
    handler: async ({ index, appid, apikey, entityType }) =>
      removeAlgoliaRecords({
        algoliaAppId: appid,
        algoliaCiApiKey: apikey,
        indexName: index,
        entityType,
      }),
  })
  .command<GetSettingsArguments>({
    command: 'algolia:get-settings',
    describe: 'gets the settings for an Algolia index',
    builder: (cli) =>
      cli
        .option('appid', appIdOption)
        .option('apikey', apikeyOption)
        .option('index', indexOption)
        .option('appName', appNameOption),
    handler: async ({ index, appid, apikey, appName }) =>
      getAlgoliaSettings({
        algoliaAppId: appid,
        algoliaCiApiKey: apikey,
        indexName: index,
        appName,
      }),
  })
  .command<SetSettingsArguments>({
    command: 'algolia:set-settings',
    describe: 'sets the settings for an Algolia index',
    builder: (cli) =>
      cli
        .option('appid', appIdOption)
        .option('apikey', apikeyOption)
        .option('index', indexOption)
        .option('appName', appNameOption),
    handler: async ({ index, appid, apikey, appName }) =>
      setAlgoliaSettings({
        algoliaAppId: appid,
        algoliaCiApiKey: apikey,
        indexName: index,
        appName,
      }),
  })
  .command<SetAnalyticsSettings>({
    command: 'algolia:set-analytics-settings',
    describe: 'sets the settings for an Algolia analytics index',
    builder: (cli) =>
      cli
        .option('appid', appIdOption)
        .option('apikey', apikeyOption)
        .option('index', indexOption),
    handler: async ({ index, appid, apikey }) =>
      setAlgoliaAnalyticsSettings({
        algoliaAppId: appid,
        algoliaCiApiKey: apikey,
        indexName: index,
      }),
  })
  .demandCommand(1)
  .help('h')
  .alias('h', 'help')
  .completion()
  .strict().argv;
