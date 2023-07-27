#!/usr/bin/env node

/* istanbul ignore file */
/* eslint-disable strict */

'use strict';

import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';
import * as importers from './import';
import {
  clearAlgoliaIndex,
  deleteAlgoliaIndex,
  getAlgoliaSettings,
  moveAlgoliaIndex,
  removeAlgoliaRecords,
  setAlgoliaSettings,
} from './scripts/algolia';

// eslint-disable-next-line no-unused-expressions
yargs(hideBin(process.argv))
  .command({
    command: 'algolia:delete-index',
    describe: 'deletes the index',
    builder: (cli) =>
      cli
        .option('appid', {
          alias: 'a',
          type: 'string',
          description: 'The App ID',
          demandOption: true,
        })
        .option('apikey', {
          alias: 'k',
          type: 'string',
          description: 'The API key',
          demandOption: true,
        })
        .option('index', {
          alias: 'n',
          type: 'string',
          description: 'Name of the index to remove',
          demandOption: true,
        }),
    handler: async ({
      index,
      appid,
      apikey,
    }: {
      index: string;
      appid: string;
      apikey: string;
    }) =>
      deleteAlgoliaIndex({
        algoliaAppId: appid,
        algoliaCiApiKey: apikey,
        indexName: index,
      }),
  })
  .command({
    command: 'algolia:clear-index',
    describe: 'clears the index',
    builder: (cli) =>
      cli
        .option('appid', {
          alias: 'a',
          type: 'string',
          description: 'The App ID',
          demandOption: true,
        })
        .option('apikey', {
          alias: 'k',
          type: 'string',
          description: 'The API key',
          demandOption: true,
        })
        .option('index', {
          alias: 'n',
          type: 'string',
          description: 'Name of the index to remove',
          demandOption: true,
        }),
    handler: async ({
      index,
      appid,
      apikey,
    }: {
      index: string;
      appid: string;
      apikey: string;
    }) =>
      clearAlgoliaIndex({
        algoliaAppId: appid,
        algoliaCiApiKey: apikey,
        indexName: index,
      }),
  })
  .command({
    command: 'algolia:move-index',
    describe: 'move the index',
    builder: (cli) =>
      cli
        .option('appid', {
          alias: 'a',
          type: 'string',
          description: 'The App ID',
          demandOption: true,
        })
        .option('apikey', {
          alias: 'k',
          type: 'string',
          description: 'The API key',
          demandOption: true,
        })
        .option('indexfrom', {
          alias: 'n',
          type: 'string',
          description: 'Name of the index to move from',
          demandOption: true,
        })
        .option('indexto', {
          alias: 'i',
          type: 'string',
          description: 'Name of the index to move to',
          demandOption: true,
        }),
    handler: async ({
      indexfrom,
      indexto,
      appid,
      apikey,
    }: {
      indexfrom: string;
      indexto: string;
      appid: string;
      apikey: string;
    }) =>
      moveAlgoliaIndex({
        algoliaAppId: appid,
        algoliaCiApiKey: apikey,
        indexNameFrom: indexfrom,
        indexNameTo: indexto,
      }),
  })
  .command({
    command: 'import <entity> <path>',
    describe: 'import entities data to squidex from csv',
    builder: (cli) =>
      cli
        .positional('entity', {
          describe: 'specific an entity to import',
          type: 'string',
          choices: ['users', 'protocols'],
        })
        .positional('path', {
          describe: 'path to csv file',
          type: 'string',
        }),
    handler: async ({ path, entity }) =>
      importers[entity as 'users'](path as string),
  })
  .command({
    command: 'algolia:remove-records',
    describe: 'removes all the records by the entity type',
    builder: (cli) =>
      cli
        .option('appid', {
          alias: 'a',
          type: 'string',
          description: 'The App ID',
          demandOption: true,
        })
        .option('apikey', {
          alias: 'k',
          type: 'string',
          description: 'The API key',
          demandOption: true,
        })
        .option('index', {
          alias: 'n',
          type: 'string',
          description: 'Name of the index to remove',
          demandOption: true,
        })
        .option('entityType', {
          alias: 'e',
          type: 'string',
          description: 'Entity meta type',
          demandOption: true,
        }),
    handler: async ({
      index,
      appid,
      apikey,
      entityType,
    }: {
      index: string;
      appid: string;
      apikey: string;
      entityType: string;
    }) =>
      removeAlgoliaRecords({
        algoliaAppId: appid,
        algoliaCiApiKey: apikey,
        indexName: index,
        entityType,
      }),
  })
  .command({
    command: 'algolia:get-settings',
    describe: 'gets the settings for an Algolia index',
    builder: (cli) =>
      cli
        .option('appid', {
          alias: 'a',
          type: 'string',
          description: 'The App ID',
          demandOption: true,
        })
        .option('apikey', {
          alias: 'k',
          type: 'string',
          description: 'The API key',
          demandOption: true,
        })
        .option('index', {
          alias: 'n',
          type: 'string',
          description: 'Name of the index',
          demandOption: true,
        })
        .option('appName', {
          alias: 'p',
          description: 'Name of App - crn or gp2',
          type: 'string',
          choices: ['crn', 'gp2'],
          demandOption: true,
        }),
    handler: async ({
      index,
      appid,
      apikey,
      appName,
    }: {
      index: string;
      appid: string;
      apikey: string;
      appName: string;
    }) =>
      getAlgoliaSettings({
        algoliaAppId: appid,
        algoliaCiApiKey: apikey,
        indexName: index,
        appName,
      }),
  })
  .command({
    command: 'algolia:set-settings',
    describe: 'sets the settings for an Algolia index',
    builder: (cli) =>
      cli
        .option('appid', {
          alias: 'a',
          type: 'string',
          description: 'The App ID',
          demandOption: true,
        })
        .option('apikey', {
          alias: 'k',
          type: 'string',
          description: 'The API key',
          demandOption: true,
        })
        .option('index', {
          alias: 'n',
          type: 'string',
          description: 'Name of the index',
          demandOption: true,
        })
        .option('appName', {
          alias: 'p',
          description: 'Name of App - crn or gp2',
          type: 'string',
          choices: ['crn', 'gp2'],
          demandOption: true,
        }),
    handler: async ({
      index,
      appid,
      apikey,
      appName,
    }: {
      index: string;
      appid: string;
      apikey: string;
      appName: string;
    }) =>
      setAlgoliaSettings({
        algoliaAppId: appid,
        algoliaCiApiKey: apikey,
        indexName: index,
        appName,
      }),
  })
  .demandCommand(1)
  .help('h')
  .alias('h', 'help')
  .completion()
  .strict().argv;
