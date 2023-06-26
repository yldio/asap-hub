import * as contentful from 'contentful-management';
import { getWebhook, getWebhookId } from './helpers';

const spaceId = process.env.CONTENTFUL_SPACE_ID!;
const contentfulManagementAccessToken =
  process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!;
const contentfulEnvironment = process.env.CONTENTFUL_ENVIRONMENT!;
const apiUrl = process.env.API_URL!;
const contentfulWebhookAuthenticationToken =
  process.env.CONTENTFUL_WEBHOOK_AUTHENTICATION_TOKEN!;
const environmentName = process.env.ENVIRONMENT_NAME!;
const prEnvironmentName = process.env.PR_CONTENTFUL_ENV_ID!;

const client = contentful.createClient({
  accessToken: contentfulManagementAccessToken,
});

const app = async () => {
  const environmentId =
    environmentName === 'Branch' ? prEnvironmentName : contentfulEnvironment;
  const space = await client.getSpace(spaceId);
  const webhook = await getWebhook(environmentId, space);

  const name = `${environmentId} Webhook`;
  const url = `${apiUrl}/webhook/contentful`;
  const topics = ['Entry.publish', 'Entry.unpublish'];
  const filters: contentful.WebhookFilter[] = [
    {
      in: [{ doc: 'sys.environment.sys.id' }, ['Production', 'master']],
    },
  ];
  const headers = [
    {
      key: 'Authorization',
      value: contentfulWebhookAuthenticationToken,
      secret: true,
    },
  ];

  if (webhook) {
    webhook.url = url;
    webhook.topics = topics;
    webhook.filters = filters;
    webhook.headers = headers;

    await webhook.update();
  } else {
    const webhookId = getWebhookId(environmentId);
    space.createWebhookWithId(webhookId, {
      name,
      url,
      topics,
      filters,
      headers,
    });
  }
};

app().catch((err) => {
  console.error(err);
  process.exit(1);
});
