/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createClient, WebHooks } from 'contentful-management';
import { migrateEvents } from './events/events.data-migration';
import { migrateExternalAuthors } from './external-authors/external-authors.data-migration';
import { migrateTeams } from './teams/teams.data-migration';
import { migrateCalendars } from './calendars/calendars.data-migration';
import { migrateLabs } from './labs/labs.data-migration';
import { migrateUsers } from './users/users.data-migration';
import { migrateInterestGroups } from './interest-groups/interest-groups.data-migration';
import { logger } from './utils';
import { contentfulRateLimiter } from './contentful-rate-limiter';

export const runMigrations = async () => {
  const {
    CONTENTFUL_MANAGEMENT_ACCESS_TOKEN,
    CONTENTFUL_SPACE_ID,
    CONTENTFUL_ENV_ID,
  } = process.env;

  const contentfulClient = createClient({
    accessToken: CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!,
  });

  const contentfulSpace = await contentfulClient.getSpace(CONTENTFUL_SPACE_ID!);

  const disabledWebhooks: WebHooks[] = [];
  try {
    await contentfulRateLimiter.removeTokens(1);
    const webhooks = await contentfulSpace.getWebhooks();
    const currentEnvironmentWebhooks = webhooks.items.filter((webhook) =>
      webhook.filters?.some(
        (filter) =>
          'equals' in filter &&
          filter.equals[0].doc === 'sys.environment.sys.id' &&
          filter.equals[1] === CONTENTFUL_ENV_ID,
      ),
    );

    for (const webhook of currentEnvironmentWebhooks) {
      webhook.active = false;
      await contentfulRateLimiter.removeTokens(1);
      await webhook.update();
      disabledWebhooks.push(webhook);
    }
    logger('Webhooks deactivated');
  } catch (error) {
    if (error instanceof Error) {
      const errorParsed = JSON.parse(error?.message);
      if (errorParsed.status !== 404) {
        throw error;
      }
    } else {
      throw new Error(`Unknown error: ${error}`);
    }
  }

  let error;
  try {
    await migrateTeams();
    await migrateExternalAuthors();
    await migrateCalendars();
    await migrateLabs();
    await migrateUsers();
    // The events migration needs to be done after
    // migrating teams, users, external authors
    // and calendars
    await migrateEvents();
    await migrateInterestGroups();
  } catch (err) {
    error = err;
    logger('Error migrating data', 'ERROR');
  } finally {
    if (disabledWebhooks.length > 0) {
      for (const disabledWebhook of disabledWebhooks) {
        disabledWebhook.active = true;
        try {
          await contentfulRateLimiter.removeTokens(1);
          await disabledWebhook.update();
        } catch (err) {
          logger(`Error reactivating webhook ${disabledWebhook.name}`, 'ERROR');
        }
      }
      logger('Webhooks activated');
    }

    if (error) {
      // eslint-disable-next-line no-unsafe-finally
      throw error;
    }
  }
};
