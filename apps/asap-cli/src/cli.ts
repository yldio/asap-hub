#!/usr/bin/env node

/* istanbul ignore file */
/* eslint-disable strict */

'use strict';

import yargs from 'yargs/yargs';
import { importUsers } from './import';
import { inviteUsers } from './invite';

// eslint-disable-next-line no-unused-expressions
yargs(process.argv.slice(2))
  .command({
    command: 'import <path>',
    describe: 'import data to squidex from csv',
    builder: (cli) =>
      cli.positional('path', {
        describe: 'path to csv file',
        type: 'string',
      }),
    handler: async ({ path }) => importUsers(path as string),
  })
  .command({
    command: 'invite <role>',
    describe: 'invite people to the ASAP Hub',
    builder: (cli) =>
      cli.positional('role', {
        describe: 'specific a role to invite',
        type: 'string',
        choices: ['Staff', 'Grantee', 'Guest'],
      }),
    handler: async ({ role }) => inviteUsers(role as string),
  })
  .demandCommand(1)
  .help('h')
  .alias('h', 'help')
  .completion()
  .strict().argv;
