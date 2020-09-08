#!/usr/bin/env node
/* eslint-disable no-console */

import { program } from 'commander';
import { parseAndCreateEntities } from '.';

program
  .version('0.0.1')
  .name('import-data')
  .usage('[global options] path')
  .arguments('<filepath>')
  .action((path) => {
    return parseAndCreateEntities(path).catch(console.error);
  })
  .parse();
