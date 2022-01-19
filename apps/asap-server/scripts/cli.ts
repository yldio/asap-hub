/* istanbul ignore file */
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { exportEntity } from './export-entity';

// eslint-disable-next-line no-unused-expressions
yargs(hideBin(process.argv))
  .command<{ entity: string }>({
    command: 'export <entity>',
    describe: 'export entity data to JSON',
    builder: (cli) =>
      cli.positional('entity', {
        describe: 'specific an entity to import',
        type: 'string',
        choices: ['users', 'research-outputs'],
        demandOption: true,
      }),
    handler: async ({ entity }) =>
      exportEntity(entity as 'users' | 'research-outputs'),
  })
  .demandCommand(1)
  .help('h')
  .alias('h', 'help')
  .completion()
  .strict().argv;
