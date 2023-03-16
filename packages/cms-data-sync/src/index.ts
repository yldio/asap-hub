/* istanbul ignore file */
import { migrateTeams } from './teams/teams.data-migration';

(async () => {
  await migrateTeams();
})();
