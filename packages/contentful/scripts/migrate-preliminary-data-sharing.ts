import * as contentful from 'contentful-management';
import fs from 'fs/promises';
import csvParse from 'csv-parse';
import { resolve } from 'path';
import { RateLimiter } from 'limiter';
import { addLocaleToFields } from '../src/utils/parse-fields';

const spaceId = process.env.CONTENTFUL_SPACE_ID!;
const contentfulManagementAccessToken =
  process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!;
const environmentId = process.env.CONTENTFUL_ENV_ID!;

const client = contentful.createClient({
  accessToken: contentfulManagementAccessToken,
});

const rateLimiter = new RateLimiter({
  tokensPerInterval: 10,
  interval: 5000,
});

interface ErrorLog {
  eventId: string;
  teamId: string;
  preliminaryDataShared: string;
  error: string;
  timestamp: string;
}

const errors: ErrorLog[] = [];

const updateEvents = async (input: string[]) => {
  const data = input.map((s) => s.trim());
  const eventId = data[0]!;
  const teamId = data[1]!;
  const preliminaryDataShared = data[2]!;
  const space = await client.getSpace(spaceId);
  const environment = await space.getEnvironment(environmentId);

  try {
    await rateLimiter.removeTokens(1);
    const preliminaryDataSharedEntry = await environment.createEntry(
      'preliminaryDataSharing',
      {
        fields: addLocaleToFields({
          team: {
            sys: {
              type: 'Link',
              linkType: 'Entry',
              id: teamId,
            },
          },
          preliminaryDataShared: preliminaryDataShared === 'Y',
        }),
      },
    );

    await rateLimiter.removeTokens(1);
    const publishedPreliminaryDataSharedEntry =
      await preliminaryDataSharedEntry.publish();

    await rateLimiter.removeTokens(1);
    const eventEntry = await environment.getEntry(eventId);

    const eventFields = eventEntry.fields;
    const currentPreliminaryDataShared =
      eventFields.preliminaryDataShared?.['en-US'] || [];

    await rateLimiter.removeTokens(1);
    const existingTeamLinks = await environment.getEntries({
      content_type: 'preliminaryDataSharing',
      'fields.team.sys.id': teamId,
    });

    const existingTeamLinkIds = existingTeamLinks.items.map(
      (item) => item.sys.id,
    );
    const hasAnyTeamLink = currentPreliminaryDataShared.some(
      (item: { sys: { id: string } }) =>
        existingTeamLinkIds.includes(item.sys.id),
    );

    if (hasAnyTeamLink) {
      console.log(
        `Event ${eventId} already has a preliminary data sharing link for team ${teamId}`,
      );
    } else {
      const newPreliminaryDataShared = [
        ...currentPreliminaryDataShared,
        {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: publishedPreliminaryDataSharedEntry.sys.id,
          },
        },
      ];

      eventFields.preliminaryDataShared = {
        'en-US': newPreliminaryDataShared,
      };

      await rateLimiter.removeTokens(1);
      const updatedEventEntry = await eventEntry.update();

      await rateLimiter.removeTokens(1);
      await updatedEventEntry.publish();

      console.log(
        `Added preliminary data sharing link to event ${eventId} for team ${teamId} with preliminaryDataShared=${preliminaryDataShared}`,
      );
    }
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error(
      `Error for event ${eventId} and team ${teamId}: ${errorMessage}`,
    );

    errors.push({
      eventId,
      teamId,
      preliminaryDataShared,
      error: errorMessage,
      timestamp: new Date().toISOString(),
    });
  }
};

const saveErrorsToFile = async () => {
  if (errors.length > 0) {
    const errorOutputPath = resolve(__dirname, './migration-errors.json');
    const errorReport = {
      totalErrors: errors.length,
      timestamp: new Date().toISOString(),
      errors,
    };

    await fs.writeFile(errorOutputPath, JSON.stringify(errorReport, null, 2));
    console.log(`\n${errors.length} errors saved to: ${errorOutputPath}`);
  } else {
    console.log('\nNo errors occurred during migration.');
  }
};

const migratePreliminaryDataSharing = async () => {
  const path = resolve(__dirname, './preliminary_data_sharing.csv');
  const content = await fs.readFile(path, 'utf8');

  const parser = csvParse(content, {
    delimiter: ',',
    from_line: 2,
  });

  parser.on('readable', async function () {
    let record: string[];
    while ((record = parser.read()) !== null) {
      await updateEvents(record);
    }
  });

  parser.on('end', async () => {
    await saveErrorsToFile();
  });
};

migratePreliminaryDataSharing().catch(async (error) => {
  console.error('Fatal error:', error);
  await saveErrorsToFile();
});
