import { createClient } from 'contentful-management';

const spaceId = process.env.CONTENTFUL_SPACE_ID!;
const contentfulEnvId = process.env.CONTENTFUL_ENV_ID!;
const contentfulAccessToken = process.env.CONTENTFUL_ACCESS_TOKEN!;
const contentfulManagementAccessToken =
  process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!;

const client = createClient({
  accessToken: contentfulManagementAccessToken,
});

const app = async () => {
  const space = await client.getSpace(spaceId);

  const keys = await space.getApiKeys();
  const apiKey = keys.items.find(
    (key) => key.accessToken === contentfulAccessToken,
  );

  if (!apiKey) {
    console.log('Could not find API key');
    process.exit(0);
  }

  apiKey.environments = apiKey.environments.filter(
    (env) => env.sys.id !== contentfulEnvId,
  );

  await apiKey.update();

  console.log(`API Key no longer has access to Environment ${contentfulEnvId}`);
};

app().catch((err) => {
  console.error(err);
  process.exit(1);
});
