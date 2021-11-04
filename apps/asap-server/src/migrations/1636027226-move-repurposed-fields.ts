/* istanbul ignore file */
import { RestTeam, RestUser } from '@asap-hub/squidex';
import { Migration } from '../handlers/webhooks/webhook-run-migrations';
import { applyToAllItemsInCollection } from '../utils/migrations';

export default class MoveRepurposedFields extends Migration {
  up = async (): Promise<void> => {
    await migrateUserFields();
    await migrateTeamFields();
  };
  down = async (): Promise<void> => {
    /* Ignore  */
  };
}
async function migrateUserFields() {
  await applyToAllItemsInCollection<RestUser>(
    'users',
    async (
      {
        id,
        data: {
          skills,
          skillsDescription,
          teams: { iv: teams },
        },
      },
      squidexClient,
    ) => {
      await squidexClient.patch(id, {
        expertiseAndResourceTags: { iv: skills.iv ?? [] },
        expertiseAndResourceDescription: skillsDescription,
        ...(teams && {
          teams: {
            iv: teams.map((team) => ({
              ...team,
              mainResearchInterests: team.approach,
            })),
          },
        }),
      });
    },
  );
}

async function migrateTeamFields() {
  await applyToAllItemsInCollection<RestTeam>(
    'teams',
    async ({ id, data: { skills } }, squidexClient) => {
      await squidexClient.patch(id, {
        expertiseAndResourceTags: { iv: skills.iv ?? [] },
      });
    },
  );
}
