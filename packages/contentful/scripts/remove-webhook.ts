import * as contentful from 'contentful-management';
import { getWebhook } from './helpers';

const spaceId = process.env.CONTENTFUL_SPACE_ID!;
const contentfulManagementAccessToken =
  process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!;
const client = contentful.createClient({
  accessToken: contentfulManagementAccessToken,
});

const app = async () => {
  const space = await client.getSpace(spaceId);
  const webhook = await getWebhook(space);

  if (webhook) {
    await webhook.delete();
  }
};

app().catch((err) => {
  console.error(err);
  process.exit(1);
});
