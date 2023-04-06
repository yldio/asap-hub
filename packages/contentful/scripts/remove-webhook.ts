import * as contentful from 'contentful-management';

const spaceId = process.env.CONTENTFUL_SPACE_ID!;
const contentfulManagementAccessToken =
  process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!;
const contentfulEnvironment = process.env.CONTENTFUL_ENVIRONMENT!;
const client = contentful.createClient({
  accessToken: contentfulManagementAccessToken,
});

const app = async () => {
  const space = await client.getSpace(spaceId);
  const webhook = await space.getWebhook(
    `${contentfulEnvironment.toLowerCase()}-webhook`,
  );

  await webhook.delete();
};

app().catch((err) => {
  console.error(err);
  process.exit(1);
});
