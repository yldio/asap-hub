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
    await resetUserFields();
    await resetTeamFields();
  };
}
async function migrateUserFields() {
  await applyToAllItemsInCollection<RestUser>(
    'users',
    async (user, squidexClient) => {
      const { skills, skillsDescription, teams } = user.data;
      await squidexClient.patch(user.id, {
        expertiseAndResourceTags: { iv: skills.iv ?? [] },
        expertiseAndResourceDescription: skillsDescription,
        ...(teams && {
          teams: {
            iv:
              teams.iv?.map((team) => ({
                ...team,
                mainResearchInterests: team.approach,
              })) ?? [],
          },
        }),
      });
    },
  );
}

async function migrateTeamFields() {
  //test  commit
  await applyToAllItemsInCollection<RestTeam>(
    'teams',
    async (team, squidexClient) => {
      await squidexClient.patch(team.id, {
        expertiseAndResourceTags: { iv: team.data.skills.iv ?? [] },
      });
    },
  );
}

async function resetUserFields() {
  await applyToAllItemsInCollection<RestUser>(
    'users',
    async (user, squidexClient) => {
      const { teams } = user.data;
      await squidexClient.patch(user.id, {
        expertiseAndResourceTags: { iv: [] },
        expertiseAndResourceDescription: { iv: '' },
        ...(teams && {
          teams: {
            iv:
              teams.iv?.map((team) => ({
                ...team,
                mainResearchInterests: undefined,
              })) ?? [],
          },
        }),
      });
    },
  );
}

async function resetTeamFields() {
  await applyToAllItemsInCollection<RestTeam>(
    'teams',
    async ({ id }, squidexClient) => {
      await squidexClient.patch(id, {
        expertiseAndResourceTags: { iv: [] },
      });
    },
  );
}
