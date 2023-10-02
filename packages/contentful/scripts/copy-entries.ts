import * as contentful from 'contentful-management';

const spaceId = process.env.CONTENTFUL_SPACE_ID!;
const contentfulManagementAccessToken =
  process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!;
const environmentId = process.env.CONTENTFUL_ENV_ID!;
const sourceContentTypeId = process.env.SOURCE_CONTENT_TYPE_ID!;
const destinationContentTypeId = process.env.DESTINATION_CONTENT_TYPE_ID!;

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
    const destinationEntry = await environment.createEntry(
      destinationContentTypeId,
      {
        fields: entry.fields,
      },
    );
    if (destinationEntry.isPublished()) {
      await destinationEntry.publish();
    }
    console.log(`Copied entry: ${destinationEntry.sys.id}`);
  }
};

copyEntries().catch(console.error);
