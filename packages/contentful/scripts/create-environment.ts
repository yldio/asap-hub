import { createClient } from 'contentful-management';
import minimist from 'minimist';
import retry from 'async-retry';

const spaceId = process.env.CONTENTFUL_SPACE_ID!;
const contentfulEnvId = process.env.CONTENTFUL_ENV_ID!;
const contentfulSourceEnv = process.env.CONTENTFUL_SOURCE_ENV!;
const contentfulAccessToken = process.env.CONTENTFUL_ACCESS_TOKEN!;
const contentfulManagementAccessToken =
  process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!;

const client = createClient({
  accessToken: contentfulManagementAccessToken,
});

const args = minimist(process.argv.slice(2));
const interval = 10000;

const retryCreateEnvironment = async () =>
  retry(
    async (bail) => {
      try {
        await createEnvironment();
      } catch (e: any) {
        if (e.name === 'QuotaReached') {
          throw e;
        }
        bail(e);
      }
    },
    {
      retries: Math.round(args.timeout / interval),
      minTimeout: interval,
      maxTimeout: interval,
      factor: 1,
      randomize: false,
      onRetry: () =>
        console.log('No available environments. Retrying in 10s...'),
    },
  );

const createEnvironment = async (): Promise<void> => {
  const space = await client.getSpace(spaceId);
  await space.createEnvironmentWithId(
    contentfulEnvId,
    {
      name: contentfulEnvId,
    },
    contentfulSourceEnv,
  );
};

const app = async () => {
  const space = await client.getSpace(spaceId);

  if (args.timeout) {
    await retryCreateEnvironment();
  } else {
    await createEnvironment();
  }

  console.log(`Environment ${contentfulEnvId} created`);

  retry(
    async () => {
      const environment = await space.getEnvironment(contentfulEnvId);
      if (environment.sys.status.sys.id !== 'ready') {
        throw new Error('Not ready');
      }
    },
    {
      retries: 60,
      minTimeout: 1000,
      maxTimeout: 1000,
      factor: 1,
      randomize: false,
    },
  );

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
