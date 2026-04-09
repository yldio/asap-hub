/* istanbul ignore file */
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { exportEntity } from './export-entity';
import { exportComplianceData } from './export-compliance-data';
import { exportTagsUtilisation } from './export-tags-utilisation';

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
  .command<{ filename?: string }>({
    command: 'export-tags-utilisation',
    describe: 'export tags utilisation with frequency counts across entities',
    builder: (cli) =>
      cli.option('filename', {
        alias: 'f',
        type: 'string',
        description: 'The output file name (without extension)',
      }),
    handler: async ({ filename }) => exportTagsUtilisation(filename),
  })
  .demandCommand(1)
  .help('h')
  .alias('h', 'help')
  .completion()
  .strict().argv;
