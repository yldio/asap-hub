import * as contentful from 'contentful-management';
import { SysLink } from 'contentful-management';

const spaceId = process.env.CONTENTFUL_SPACE_ID!;
const contentfulManagementAccessToken =
  process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!;
const environmentId = process.env.CONTENTFUL_ENV_ID!;

const client = contentful.createClient({
  accessToken: contentfulManagementAccessToken,
});

const fetchSourceEntries = async (contentType: string, fieldName: string) => {
  const space = await client.getSpace(spaceId);
  const environment = await space.getEnvironment(environmentId);
  const sourceEntries = await environment.getEntries({
    content_type: contentType,
    [`fields.${fieldName}[exists]`]: true,
  });
  return sourceEntries.items;
};

const copyLinkedEntries = async (contentType: string) => {
  console.log(`Copying linked entries for ${contentType}`);

  const publishEntryIds: string[] = [];

  const fieldName = contentType === 'events' ? 'keywords' : 'tags';

  const sourceEntries = await fetchSourceEntries(contentType, fieldName);
  const space = await client.getSpace(spaceId);
  const environment = await space.getEnvironment(environmentId);

  for (const entry of sourceEntries) {
    if (entry.isPublished()) {
      publishEntryIds.push(entry.sys.id);
    }

    const value = entry.fields[fieldName]['en-US'].map((keyword: SysLink) => ({
      sys: {
        type: 'Link',
        linkType: 'Entry',
        id: `${keyword.sys.id}-tag`,
      },
    }));

    entry.fields.tags = {
      'en-US': value,
    };

    await entry.update();

    console.log(`Copied linked tags for entry: ${entry.sys.id}`);
  }

  for (const entryId of publishEntryIds) {
    try {
      const entry = await environment.getEntry(entryId);
      await entry.publish();
      console.log(`Published entry: ${entryId}`);
    } catch (e) {
      console.log(`Could not publish entry: ${entryId}, ${e}`);
    }
  }
};

const contentTypesWithTags = [
  'outputs',
  'projects',
  'users',
  'workingGroups',
  'events',
];

for (const contentType of contentTypesWithTags) {
  copyLinkedEntries(contentType).catch(console.error);
}
