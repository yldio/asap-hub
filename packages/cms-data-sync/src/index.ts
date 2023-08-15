/* istanbul ignore file */
import { runMigrations, models, Flag } from './run-migrations';

const flags = process.argv.slice(2);

const allowedFlags = [
  '--upsert',
  ...models.map((model: string) => `--${model}`),
];

flags.forEach((flag: string) => {
  if (!allowedFlags.includes(flag)) {
    // eslint-disable-next-line no-console
    console.error(`Unrecognised flag: ${flag}`);
    process.exit(1);
  }
});

runMigrations(flags as Flag[]);
