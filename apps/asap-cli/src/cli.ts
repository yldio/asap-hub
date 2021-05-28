#!/usr/bin/env node

/* istanbul ignore file */
/* eslint-disable strict */

'use strict';

import yargs from 'yargs/yargs';
import {importers, inviteUsersFactory} from '@asap-hub/management-scripts'

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
  .command({
    command: 'invite [Options]',
    describe: 'invite people to the ASAP Hub',
    builder: (cli) =>
      cli
        .positional('role', {
          describe: 'specify a role to invite (optional)',
          type: 'string',
          default: undefined,
          choices: ['Staff', 'Grantee', 'Guest'],
        })
        .option('reinvite', {
          alias: 'r',
          type: 'boolean',
          description:
            "flag to reinvite users that didn't complete the registration process",
        }),

    handler: async ({ role, reinvite }) => {
      const inviteUsers = inviteUsersFactory();
      inviteUsers(role as string | undefined, Boolean(reinvite));
    },
  })
  .demandCommand(1)
  .help('h')
  .alias('h', 'help')
  .completion()
  .strict().argv;
