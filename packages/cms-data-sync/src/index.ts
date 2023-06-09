/* istanbul ignore file */
import { runMigrations } from './run-migrations';

const flags = process.argv.slice(2);

runMigrations(flags);
