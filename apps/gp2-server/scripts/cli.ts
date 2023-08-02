/* istanbul ignore file */
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';
import { exportEntity } from './export-entity';

// eslint-disable-next-line no-unused-expressions
yargs(hideBin(process.argv))
  .command<{ entity: string; filename?: string }>({
    command: 'export <entity>',
    describe: 'export entity data to JSON',
    builder: (cli) =>
      cli
        .positional('entity', {
          describe: 'specific an entity to import',
          type: 'string',
          choices: ['output'],
          demandOption: true,
        })
        .option('filename', {
          alias: 'f',
          type: 'string',
          description: 'The output file name',
        }),
    handler: async ({ entity, filename }) =>
      exportEntity(entity as 'output', filename),
  })
  .demandCommand(1)
  .help('h')
  .alias('h', 'help')
  .completion()
  .strict().argv;
