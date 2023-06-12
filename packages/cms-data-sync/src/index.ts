/* istanbul ignore file */
import { runMigrations, models, Flag } from './run-migrations';

const flags = process.argv.slice(2);

flags.forEach((flag: string) => {
  if (!models.some((model: string) => flag === `--${model}`)) {
    // eslint-disable-next-line no-console
    console.error(`Unrecognised flag: ${flag}`);
    process.exit(1);
  }
});

runMigrations(flags as Flag[]);
