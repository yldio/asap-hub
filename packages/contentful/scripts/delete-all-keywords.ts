import * as contentful from 'contentful-management';

const spaceId = process.env.CONTENTFUL_SPACE_ID!;
const contentfulManagementAccessToken =
  process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!;
const environmentId = process.env.CONTENTFUL_ENV_ID!;

const client = contentful.createClient({
  accessToken: contentfulManagementAccessToken,
});

const fetchEntries = async () => {
  const space = await client.getSpace(spaceId);
  const environment = await space.getEnvironment(environmentId);
  const entries = await environment.getEntries({
    content_type: 'keywords',
  });
  return entries.items;
};

const deleteEntries = async () => {
  const entries = await fetchEntries();
  const space = await client.getSpace(spaceId);

  const environment = await space.getEnvironment(environmentId);

  for (const entry of entries) {
    if (entry.isPublished()) {
      await entry.unpublish();
    }
    await environment.deleteEntry(entry.sys.id);
    console.log(`Deleted entry: ${entry.sys.id}`);
  }
};

deleteEntries().catch(console.error);
