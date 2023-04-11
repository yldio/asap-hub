/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createClient } from 'contentful-management';
import { migrateExternalAuthors } from './external-authors/external-authors.data-migration';
import { migrateTeams } from './teams/teams.data-migration';
import { migrateCalendars } from './calendars/calendars.data-migration';
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
  const webhook = await contentfulSpace.getWebhook(
    `${CONTENTFUL_ENV_ID!.toLowerCase()}-webhook`,
  );

  webhook.active = false;
  await webhook.update();

  logger('Webhook deactivated');

  let error;
  try {
    await migrateTeams();
    await migrateExternalAuthors();
    await migrateCalendars();
  } catch (err) {
    error = err;
    logger('Error migrating data', 'ERROR');
  } finally {
    webhook.active = true;
    await webhook.update();
    logger('Webhook activated');

    if (error) {
      // eslint-disable-next-line no-unsafe-finally
      throw error;
    }
  }
};
