#!/usr/bin/env node
'use strict'

import yargs from "yargs/yargs";
import { parseAndCreateEntities } from "./import"
import { inviteUsers } from "./invite";

yargs(process.argv.slice(2))
    .command({
        command: 'import <path>',
        describe: 'import data to squidex from csv',
        builder: (yargs) => {
            return yargs.positional('path', {
                describe: 'specific path to csv file',
                type: 'string'
            })
        },
        handler: async ({ path }) => {
            return parseAndCreateEntities(path as string).catch(console.error);
        }
    })
    .command({
        command: 'invite <role>',
        describe: 'invite people to the ASAP Hub',
        builder: (yargs) => {
            return yargs.positional('role', {
                describe: 'specific a role to invite',
                type: 'string',
                choices: ["Staff", "Grantee", "Guest"]
            });
        },
        handler: async ({ role }) => {
            return inviteUsers(role as string)
        }
    })
    .demandCommand(1)
    .help('h')
    .alias('h', 'help')
    .completion()
    .strict()
    .argv
