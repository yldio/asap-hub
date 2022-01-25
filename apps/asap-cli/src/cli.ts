#!/usr/bin/env node

/* istanbul ignore file */
/* eslint-disable strict */

'use strict';

import { removeAlgoliaIndex, moveAlgoliaIndex } from '@asap-hub/algolia';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import * as importers from './import';

// eslint-disable-next-line no-unused-expressions
yargs(hideBin(process.argv))
  .command({
    command: 'algolia:remove-index',
    describe: 'remove the index',
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
      removeAlgoliaIndex({
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
  .demandCommand(1)
  .help('h')
  .alias('h', 'help')
  .completion()
  .strict().argv;
