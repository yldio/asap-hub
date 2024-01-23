/* istanbul ignore file */
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { exportEntity } from './export-entity';
import { updateUserTags} from './update-tags';

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
          choices: [
            'user',
            'research-output',
            'external-author',
            'event',
            'team',
            'working-group',
            'tutorial',
            'news',
          ],
          demandOption: true,
        })
        .option('filename', {
          alias: 'f',
          type: 'string',
          description: 'The output file name',
        }),
    handler: async ({ entity, filename }) =>
      exportEntity(
        entity as
          | 'user'
          | 'research-output'
          | 'external-author'
          | 'event'
          | 'team'
          | 'working-group'
          | 'tutorial'
          | 'news',
        filename,
      ),
  })
  .command<{entity: string}>({
    command: 'tags <entity>',
    describe: 'update tags for an entity',
    builder: (cli) =>
    cli.positional('entity', {
      describe: 'specify an entity to update tags for',
      type: 'string',
      choices: [
        'user'
      ]
    }),
    handler: async({entity}) => {
      console.log(entity)
      switch (entity) {
        case 'user':
        await updateUserTags();
          break;
          default:
            console.error('no matching entity');
      }
    }
  })
  .demandCommand(1)
  .help('h')
  .alias('h', 'help')
  .completion()
  .strict().argv;
