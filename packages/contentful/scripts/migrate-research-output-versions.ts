import * as contentful from 'contentful-management';
import fs from 'fs/promises';
import csvParse from 'csv-parse';
import { resolve } from 'path';
import { addLocaleToFields, createLink } from '../src/utils/parse-fields';
import { Entry, Environment } from 'contentful-management';

const spaceId = process.env.CONTENTFUL_SPACE_ID!;
const contentfulManagementAccessToken =
  process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!;
const environmentId = process.env.CONTENTFUL_ENV_ID!;

const client = contentful.createClient({
  accessToken: contentfulManagementAccessToken,
});

const hasExistingPreprint = async (
  environment: Environment,
  versions: Entry[],
  firstVersionTitle: string,
  firstVersionLink: string,
) => {
  const versionIds = versions.map((version: any) => version.sys.id);

  const versionEntities = await environment.getEntries({
    content_type: 'researchOutputVersions',
    'sys.id[in]': versionIds.join(','),
  });

  return versionEntities.items.some(
    (version: Entry) =>
      version.fields.title['en-US'] === firstVersionTitle &&
      version.fields.link['en-US'] === firstVersionLink,
  );
};

const updateResearchOutput = async (input: string[]) => {
  const data = input.map((s) => s.trim());
  const id = data[1]!,
    firstVersionTitle = data[4]!,
    firstVersionLink = data[8]!;

  try {
    const space = await client.getSpace(spaceId);
    const environment = await space.getEnvironment(environmentId);

    const researchOutputEntry = await environment.getEntry(id);
    if (researchOutputEntry) {
      const existingVersions =
        researchOutputEntry.fields.versions?.['en-US'] ?? [];

      if (
        existingVersions.length === 0 ||
        !hasExistingPreprint(
          environment,
          existingVersions,
          firstVersionTitle,
          firstVersionLink,
        )
      ) {
        const versionEntry = await environment.createEntry(
          'researchOutputVersions',
          {
            fields: addLocaleToFields({
              title: firstVersionTitle,
              documentType: 'Article',
              type: 'Preprint',
              link: firstVersionLink,
            }),
          },
        );

        await versionEntry.publish();

        const newVersion = createLink(versionEntry.sys.id);

        researchOutputEntry.fields['versions'] = {
          'en-US': [newVersion, ...existingVersions],
        };

        try {
          const updatedResearchOutput = await researchOutputEntry.update();
          await updatedResearchOutput.publish();
          console.log(`Updated research output ${id}`);
        } catch (err) {
          console.log(`Error updating research output ${id}: ${err}`);
        }
      }
    }
  } catch (e) {
    console.log(`Error fetching research output ${id}: ${e}`);
  }
};

const migrateResearchOutputVersions = async () => {
  const path = resolve(__dirname, './preprint_data.csv');
  const content = await fs.readFile(path, 'utf8');

  const parser = csvParse(content, {
    delimiter: ',',
    from_line: 2,
  });

  parser.on('readable', async function () {
    let record: string[];
    while ((record = parser.read()) !== null) {
      await updateResearchOutput(record);
    }
  });
};

migrateResearchOutputVersions().catch(console.error);
