import * as contentful from 'contentful-management';

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

console.log(contentfulWebhookAuthenticationToken);

const app = async () => {
  const space = await client.getSpace(spaceId);

  space.createWebhookWithId(`${contentfulEnvironment.toLowerCase()}-webhook`, {
    name: `${contentfulEnvironment} Webhook`,
    url: `${apiUrl}/webhook/contentful`,
    topics: ['Entry.save', 'Entry.publish', 'Entry.unpublish', 'Entry.delete'],
    filters: [
      {
        equals: [{ doc: 'sys.environment.sys.id' }, contentfulEnvironment],
      },
    ],
    headers: [
      {
        key: 'Authorization',
        value: contentfulWebhookAuthenticationToken,
        secret: true,
      },
    ],
  });
};

app().catch((err) => {
  console.error(err);
  process.exit(1);
});
