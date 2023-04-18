import * as contentful from 'contentful-management';
import { getWebhook } from './helpers';

const spaceId = process.env.CONTENTFUL_SPACE_ID!;
const contentfulManagementAccessToken =
  process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!;
const contentfulEnvironment = process.env.CONTENTFUL_ENVIRONMENT!;
const apiUrl = process.env.API_URL!;
const contentfulWebhookAuthenticationToken =
  process.env.CONTENTFUL_WEBHOOK_AUTHENTICATION_TOKEN!;
const client = contentful.createClient({
  accessToken: contentfulManagementAccessToken,
});

const app = async () => {
  const space = await client.getSpace(spaceId);
  const webhook = await getWebhook(space);

  const webhookName = `${contentfulEnvironment} Webhook`;
  const webhookUrl = `${apiUrl}/webhook/contentful`;
  const webhookTopics = [
    'Entry.save',
    'Entry.publish',
    'Entry.unpublish',
    'Entry.delete',
  ];
  const webhookFilters: contentful.WebhookFilter[] = [
    {
      equals: [{ doc: 'sys.environment.sys.id' }, contentfulEnvironment],
    },
  ];
  const webhookHeaders = [
    {
      key: 'Authorization',
      value: contentfulWebhookAuthenticationToken,
      secret: true,
    },
  ];

  if (webhook) {
    webhook.url = webhookUrl;
    webhook.topics = webhookTopics;
    webhook.filters = webhookFilters;
    webhook.headers = webhookHeaders;

    await webhook.update();
  } else {
    space.createWebhookWithId(
      `${contentfulEnvironment.toLowerCase()}-webhook`,
      {
        name: webhookName,
        url: webhookUrl,
        topics: webhookTopics,
        filters: webhookFilters,
        headers: webhookHeaders,
      },
    );
  }
};

app().catch((err) => {
  console.error(err);
  process.exit(1);
});
