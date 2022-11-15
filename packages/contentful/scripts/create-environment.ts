import * as contentful from 'contentful-management';

const spaceId = process.env.CONTENTFUL_SPACE_ID!;
const contentfulEnvId = process.env.CONTENTFUL_ENV_ID!;
const contentfulSourceEnv = process.env.CONTENTFUL_SOURCE_ENV!;
const contentfulAccessToken = process.env.CONTENTFUL_ACCESS_TOKEN!;
const contentfulManagementAccessToken =
  process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!;

const client = contentful.createClient({
  accessToken: contentfulManagementAccessToken,
});

const app = async () => {
  const space = await client.getSpace(spaceId);

  await space.createEnvironmentWithId(
    contentfulEnvId,
    {
      name: contentfulEnvId,
    },
    contentfulSourceEnv,
  );

  console.log(`Environment ${contentfulEnvId} created`);

  const keys = await space.getApiKeys();
  const apiKey = keys.items.find(
    (key) => key.accessToken === contentfulAccessToken,
  );

  if (!apiKey) {
    throw new Error('Could not find API key');
  }

  if (apiKey.environments.some((env) => env.sys.id === contentfulEnvId)) {
    console.log(`API key already has access to ${contentfulEnvId}`);
    return;
  }

  apiKey.environments.push({
    sys: {
      type: 'Link',
      linkType: 'Environment',
      id: contentfulEnvId,
    },
  });

  await apiKey.update();

  console.log(`API key now has access to ${contentfulEnvId}`);
};

app().catch((err) => {
  console.error(err);
  process.exit(1);
});
