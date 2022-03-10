/* istanbul ignore file */
import { RestTeam, RestUser, User } from '@asap-hub/squidex';
import { Rest } from '@asap-hub/squidex/src/entities/common';
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
  type OldTeamFields = {
    approach: string;
  };
  interface OldUserFields extends User {
    skills: string[];
    skillsDescription: string;
  }
  await applyToAllItemsInCollection<RestUser>(
    'users',
    async (user, squidexClient) => {
      const { skills, skillsDescription, teams } = (
        user as unknown as Rest<OldUserFields>
      ).data;
      await squidexClient.patch(user.id, {
        expertiseAndResourceTags: { iv: skills.iv ?? [] },
        expertiseAndResourceDescription: skillsDescription,
        ...(teams && {
          teams: {
            iv:
              teams.iv?.map((team) => ({
                ...team,
                mainResearchInterests: (team as unknown as OldTeamFields)
                  .approach,
              })) ?? [],
          },
        }),
      });
    },
  );
}

async function migrateTeamFields() {
  await applyToAllItemsInCollection<RestTeam>(
    'teams',
    async (team, squidexClient) => {
      await squidexClient.patch(team.id, {
        expertiseAndResourceTags: {
          iv:
            (team as unknown as Rest<{ skills: string[] }>).data.skills.iv ??
            [],
        },
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
