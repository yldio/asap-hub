#!/usr/bin/env node

/* istanbul ignore file */
/* eslint-disable strict */

'use strict';

import yargs from 'yargs/yargs';
import * as importers from './import';

// eslint-disable-next-line no-unused-expressions
yargs(process.argv.slice(2))
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
      importers[entity as 'users' | 'protocols'](path as string),
  })
  .demandCommand(1)
  .help('h')
  .alias('h', 'help')
  .completion()
  .strict().argv;
