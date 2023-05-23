/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createClient } from 'contentful-management';
import { migrateEvents } from './events/events.data-migration';
import { migrateExternalAuthors } from './external-authors/external-authors.data-migration';
import { migrateTeams } from './teams/teams.data-migration';
import { migrateCalendars } from './calendars/calendars.data-migration';
import { migrateLabs } from './labs/labs.data-migration';
import { migrateUsers } from './users/users.data-migration';
import { logger } from './utils';

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

  let webhook;
  let disabledWebhook;
  try {
    webhook = await contentfulSpace.getWebhook(
      `${CONTENTFUL_ENV_ID!.toLowerCase()}-webhook`,
    );

    webhook.active = false;
    disabledWebhook = await webhook.update();

    logger('Webhook deactivated');
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
  } catch (err) {
    error = err;
    logger('Error migrating data', 'ERROR');
  } finally {
    if (disabledWebhook) {
      disabledWebhook.active = true;
      await disabledWebhook.update();
      logger('Webhook activated');
    }

    if (error) {
      // eslint-disable-next-line no-unsafe-finally
      throw error;
    }
  }
};
