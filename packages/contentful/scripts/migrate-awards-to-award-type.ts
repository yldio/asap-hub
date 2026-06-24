import * as contentful from 'contentful-management';
import { Entry, Environment } from 'contentful-management';
import { RateLimiter } from 'limiter';
import { createLink, updateEntryFields } from '../src/utils/parse-fields';

const spaceId = process.env.CONTENTFUL_SPACE_ID!;
const contentfulManagementAccessToken =
  process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!;
const environmentId = process.env.CONTENTFUL_ENV_ID!;

const client = contentful.createClient({
  accessToken: contentfulManagementAccessToken,
});
const rateLimiter = new RateLimiter({ tokensPerInterval: 10, interval: 5000 });

// existing `awards.type` values that map onto a reusable awardType definition
const AWARD_TYPE_NAMES = ['Open Science Champion'];

const getOrCreateAwardType = async (
  environment: Environment,
  name: string,
): Promise<Entry> => {
  const existing = await environment.getEntries({
    content_type: 'awardType',
    'fields.name': name,
  });
  if (existing.items[0]) {
    console.log(`awardType "${name}" already exists`);
    return existing.items[0];
  }

  await rateLimiter.removeTokens(1);
  const created = await environment.createEntry('awardType', {
    fields: { name: { 'en-US': name } },
  });
  await created.publish();
  console.log(
    `Created awardType "${name}" — upload its badge image to the "icon" field in CMS`,
  );
  return created;
};

const backfillAwards = async (
  environment: Environment,
  awardTypesByName: Map<string, string>,
) => {
  const awards = await environment.getEntries({
    content_type: 'awards',
    limit: 1000,
  });

  for (const award of awards.items) {
    const typeName = award.fields?.type?.['en-US'];
    const awardTypeId = typeName && awardTypesByName.get(typeName);

    if (award.fields?.awardType?.['en-US']) {
      console.log(`Award ${award.sys.id} already linked, skipping`);
      continue;
    }
    if (!awardTypeId) {
      console.log(
        `Award ${award.sys.id} has unmapped type "${typeName}", skipping`,
      );
      continue;
    }

    try {
      await rateLimiter.removeTokens(1);
      const isPublishedEntry = award.isPublished();
      const updated = await updateEntryFields(award, {
        awardType: createLink(awardTypeId),
      }).update();
      if (isPublishedEntry) {
        await updated.publish();
      }
      console.log(`Linked award ${award.sys.id} to awardType "${typeName}"`);
    } catch (err) {
      console.log(`Failed to update award ${award.sys.id}: ${err}`);
    }
  }
};

const migrate = async () => {
  const space = await client.getSpace(spaceId);
  const environment = await space.getEnvironment(environmentId);

  const awardTypesByName = new Map<string, string>();
  for (const name of AWARD_TYPE_NAMES) {
    const awardType = await getOrCreateAwardType(environment, name);
    awardTypesByName.set(name, awardType.sys.id);
  }

  await backfillAwards(environment, awardTypesByName);
  console.log('Awards backfill complete');
};

migrate().catch(console.error);
