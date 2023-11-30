import { Collection } from '@asap-hub/contentful';
import {
  createClient,
  Entry,
  EntryProps,
  KeyValueMap,
} from 'contentful-management';

const spaceId = process.env.CONTENTFUL_SPACE_ID!;
const contentfulEnvId = process.env.CONTENTFUL_ENV_ID!;
const contentfulManagementAccessToken =
  process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!;

const client = createClient({
  accessToken: contentfulManagementAccessToken,
});

async function waitHalfSecond() {
  await new Promise((resolve) => setTimeout(resolve, 150));
}

const app = async () => {
  const space = await client.getSpace(spaceId);
  console.log(`Environment ${contentfulEnvId}`);
  const environment = await space.getEnvironment(contentfulEnvId);
  let entries: Collection<Entry, EntryProps<KeyValueMap>>;
  let skip = 0;
  do {
    entries = await environment.getEntries({
      limit: 100,
      skip,
    });

    for (const entry of entries.items) {
      waitHalfSecond();
      console.log(
        'deleting entry',
        entry.sys.id,
        entry.fields['title']?.['en-US'],
      );
      if (entry.isPublished()) {
        await entry.unpublish();
      }
      await environment.deleteEntry(entry.sys.id);
    }

    // skip += 100;
  } while (entries.items.length > 0);
};

app().catch((err) => {
  console.error(err);
  process.exit(1);
});
