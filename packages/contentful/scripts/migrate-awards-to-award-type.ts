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

  let alreadyLinked = 0;
  let linked = 0;
  const unmapped: string[] = [];
  const failed: string[] = [];

  for (const award of awards.items) {
    const typeName = award.fields?.type?.['en-US'];
    const awardTypeId = typeName && awardTypesByName.get(typeName);

    if (award.fields?.awardType?.['en-US']) {
      alreadyLinked += 1;
      continue;
    }
    if (!awardTypeId) {
      unmapped.push(`${award.sys.id} (type: "${typeName ?? 'none'}")`);
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
      linked += 1;
      console.log(`Linked award ${award.sys.id} to awardType "${typeName}"`);
    } catch (err) {
      failed.push(`${award.sys.id}: ${err}`);
    }
  }

  console.log('\n--- Awards backfill summary ---');
  console.log(`Total awards:    ${awards.total}`);
  console.log(`Newly linked:    ${linked}`);
  console.log(`Already linked:  ${alreadyLinked}`);
  console.log(`Unmapped:        ${unmapped.length}`);
  unmapped.forEach((u) => console.log(`  - unmapped: ${u}`));
  console.log(`Failed:          ${failed.length}`);
  failed.forEach((f) => console.log(`  - failed: ${f}`));

  if (unmapped.length || failed.length) {
    console.log(
      '\nDo NOT run the remove-awards-type-field migration until every ' +
        'award is linked (unmapped and failed must both be 0).',
    );
  } else {
    console.log('\nAll awards linked — safe to drop the legacy `type` field.');
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
