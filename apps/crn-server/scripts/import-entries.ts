import { createClient } from 'contentful-management';
import { parse } from '@asap-hub/server-common';
import pThrottle from 'p-throttle';
import fs from 'fs';

const spaceId = process.env.CONTENTFUL_SPACE_ID!;
const contentfulEnvId = process.env.CONTENTFUL_ENV_ID!;
const contentfulManagementAccessToken =
  process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!;

const client = createClient({
  accessToken: contentfulManagementAccessToken,
});

type CreateEntryDataObject = {
  name: string;
};

/**
 * This script imports entries into Contentful with the only field being "name", which is a string.
 *
 * To run this script, use the following command from @asap-hub/crn-server folder:
 *
 * CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=*** CONTENTFUL_SPACE_ID=*** CONTENTFUL_ENV_ID=*** yarn import:entries --type=impact --path=path_to_csv
 *
 * Replace `***` with your actual Contentful Management Access Token, Space ID, and Environment ID.
 * Replace `type` with the content type you want to import the entries into.
 * Replace `path_to_csv` with the path to your CSV file containing the entries to import.
 *
 * Note: The CSV file should contain a header row.
 */

const app = async () => {
  const space = await client.getSpace(spaceId);
  console.log(`\n\nEnvironment ${contentfulEnvId}`);
  const environment = await space.getEnvironment(contentfulEnvId);

  const args = process.argv.slice(2);
  const typeArg = args.find((arg) => arg.startsWith('--type='));
  const contentType = typeArg ? typeArg.split('=')[1] : null;

  if (!contentType) {
    throw new Error('Please provide a content type using --type=');
  }

  const pathArg = args.find((arg) => arg.startsWith('--path='));
  const filePath = pathArg ? pathArg.split('=')[1] : null;

  if (!filePath) {
    throw new Error('Please provide a path to the CSV file using --path=');
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(`ERROR: CSV file not found at ${filePath}`);
  }

  console.log(
    `\nImporting data from ${filePath} to content type ${contentType}\n\n`,
  );

  const throttle = pThrottle({
    limit: 2,
    interval: 1000,
  });

  const throttledCreateEntry = throttle(
    async (input: CreateEntryDataObject) => {
      const existingEntries = await environment.getEntries({
        content_type: contentType,
        'fields.name.en-US': input.name,
      });

      if (existingEntries.items.length > 0 && existingEntries.items[0]) {
        const existingEntry = existingEntries.items[0];
        if (existingEntry.isPublished()) {
          console.log(`Entry ${input.name} already exists and is published`);
          return;
        }

        console.log(`Publishing entry ${input.name}`);
        await existingEntry.publish();
        console.log(`Entry ${input.name} is published now`);
        return;
      }

      console.log(`Creating entry ${input.name}`);
      const newEntry = await environment.createEntry(contentType, {
        fields: {
          name: {
            'en-US': input.name,
          },
        },
      });
      await newEntry.publish();
      console.log(`Entry ${input.name} created and published`);
    },
  );

  const csvImport = parse(
    (input): CreateEntryDataObject => {
      const data = input.map((s) => s.trim());
      return {
        name: data[0]!,
      };
    },
    async (input) => {
      try {
        await throttledCreateEntry(input);
      } catch (e) {
        console.log(JSON.stringify(e, null, 2));
      }
    },
  );

  await csvImport(filePath);
};

app().catch((err) => {
  console.error(err);
  process.exit(1);
});
