/* istanbul ignore file */
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { exportEntity } from './export-entity';
import { exportAnalyticsData } from './export-analytics';
import type { Metric } from './export-analytics';
import * as updateTags from './update-tags';

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
            'event',
            'external-author',
            'interest-group',
            'news',
            'research-output',
            'team',
            'tutorial',
            'user',
            'working-group',
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
          | 'event'
          | 'external-author'
          | 'interest-group'
          | 'news'
          | 'research-output'
          | 'team'
          | 'tutorial'
          | 'user'
          | 'working-group',
        filename,
      ),
  })
  .command<{ metric: string; filename?: string }>({
    command: 'export-analytics <metric>',
    describe: 'export analytics data to JSON',
    builder: (cli) =>
      cli
        .positional('metric', {
          describe: 'choose a metric to export data',
          type: 'string',
          choices: ['team-leadership'],
          demandOption: true,
        })
        .option('filename', {
          alias: 'f',
          type: 'string',
          description: 'The output file name',
        }),
    handler: async ({ metric, filename }) =>
      exportAnalyticsData(metric as Metric, filename),
  })
  .command<{ entity: string }>({
    command: 'tags <entity>',
    describe: 'update tags for an entity',
    builder: (cli) =>
      cli.positional('entity', {
        describe: 'specify an entity to update tags for',
        type: 'string',
        choices: ['user', 'event', 'team', 'group'],
        demandOption: true,
      }),
    handler: async ({ entity }: { entity: string }) => {
      switch (entity) {
        case 'user':
          await updateTags.updateUsersTags();
          break;
        default:
          console.error('no matching entity');
      }
    },
  })
  .demandCommand(1)
  .help('h')
  .alias('h', 'help')
  .completion()
  .strict().argv;
