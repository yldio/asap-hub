import * as contentful from 'contentful-management';

const spaceId = process.env.CONTENTFUL_SPACE_ID!;
const contentfulManagementAccessToken =
  process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!;
const environmentId = process.env.CONTENTFUL_ENV_ID!;

const sourceContentTypeId = 'keywords';
const destinationContentTypeId = 'tags';

const client = contentful.createClient({
  accessToken: contentfulManagementAccessToken,
});

const fetchSourceEntries = async () => {
  const space = await client.getSpace(spaceId);
  const environment = await space.getEnvironment(environmentId);
  const sourceEntries = await environment.getEntries({
    content_type: sourceContentTypeId,
  });
  return sourceEntries.items;
};

const copyEntries = async () => {
  const sourceEntries = await fetchSourceEntries();
  const space = await client.getSpace(spaceId);
  const environment = await space.getEnvironment(environmentId);

  for (const entry of sourceEntries) {
    const destinationEntry = await environment.createEntryWithId(
      destinationContentTypeId,
      `${entry.sys.id}-tag`,
      {
        fields: entry.fields,
      },
    );
    if (entry.isPublished() && !destinationEntry.isPublished()) {
      await destinationEntry.publish();
    }
    console.log(`Copied entry: ${destinationEntry.sys.id}`);
  }
};

copyEntries().catch(console.error);
