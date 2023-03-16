import * as contentful from 'contentful-management';

const spaceId = process.env.CONTENTFUL_SPACE_ID!;
const contentfulManagementAccessToken =
  process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!;
const contentfulEnvironment = process.env.CONTENTFUL_ENVIRONMENT!;
const apiUrl = process.env.API_URL!;

const client = contentful.createClient({
  accessToken: contentfulManagementAccessToken,
});

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
  });
};

app().catch((err) => {
  console.error(err);
  process.exit(1);
});
