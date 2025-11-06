/* istanbul ignore file */
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { exportEntity } from './export-entity';
import { exportAnalyticsData } from './export-analytics';
import { exportComplianceData } from './export-compliance-data';
import type { Metric } from '@asap-hub/model';

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
            'manuscript',
            'manuscript-version',
            'news',
            'project',
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
          | 'manuscript'
          | 'manuscript-version'
          | 'news'
          | 'project'
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
          choices: [
            'team-leadership',
            'team-productivity',
            'user-productivity',
            'team-collaboration',
            'user-collaboration',
            'engagement',
          ],
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
  .command<{
    contentfulBackupFileName: string;
    complianceDataFileName?: string;
  }>({
    command: 'export-compliance-data <contentfulBackupFileName>',
    describe: 'exports compliance data in csv format',
    builder: (cli) =>
      cli
        .positional('contentfulBackupFileName', {
          describe: 'path to contentful backup file',
          type: 'string',
          demandOption: true,
        })
        .option('complianceDataFileName', {
          alias: 'f',
          type: 'string',
          description: 'The output file name',
        }),
    handler: async ({ contentfulBackupFileName, complianceDataFileName }) =>
      exportComplianceData(contentfulBackupFileName, complianceDataFileName),
  })
  .demandCommand(1)
  .help('h')
  .alias('h', 'help')
  .completion()
  .strict().argv;
