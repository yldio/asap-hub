/* istanbul ignore file */
import { migrateExternalAuthors } from './external-authors/external-authors.data-migration';
import { migrateTeams } from './teams/teams.data-migration';

(async () => {
  await migrateTeams();
  await migrateExternalAuthors();
})();
