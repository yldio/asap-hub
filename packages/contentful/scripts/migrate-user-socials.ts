import * as contentful from 'contentful-management';
import type { Environment, Entry, QueryOptions } from 'contentful-management';
import { RateLimiter } from 'limiter';

const spaceId = process.env.CONTENTFUL_SPACE_ID!;
const contentfulManagementAccessToken =
  process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!;
const environmentId = process.env.CONTENTFUL_ENV_ID!;

const client = contentful.createClient({
  accessToken: contentfulManagementAccessToken,
});
// Each user costs up to 3 calls (get, create/update, publish) against
// Contentful's 10 requests/second CMA limit.
const rateLimiter = new RateLimiter({ tokensPerInterval: 3, interval: 1000 });
const BATCH_SIZE = 10;

const LOCALE = 'en-US';
const LIMIT = 1000;

const SOCIAL_FIELDS = [
  'website1',
  'website2',
  'linkedIn',
  'researcherId',
  'twitter',
  'github',
  'googleScholar',
  'researchGate',
  'blueSky',
] as const;

const socialsEntryId = (userId: string) => `socials-${userId}`;

const queryOptions: QueryOptions = {
  content_type: 'users',
  'sys.archivedAt[exists]': false,
  select: ['sys.id', ...SOCIAL_FIELDS.map((field) => `fields.${field}`)].join(
    ',',
  ),
  limit: LIMIT,
};

const fetchUsers = async (environment: Environment) => {
  const userEntries: Entry[] = [];
  const entries = await environment.getEntries(queryOptions);
  userEntries.push(...entries.items);

  while (userEntries.length < entries.total) {
    const nextEntries = await environment.getEntries({
      ...queryOptions,
      skip: userEntries.length,
    });
    userEntries.push(...nextEntries.items);
  }

  return userEntries;
};

const getSocialFields = (user: Entry) =>
  SOCIAL_FIELDS.reduce<Record<string, Record<string, string>>>((acc, field) => {
    const value = user.fields?.[field]?.[LOCALE];
    return value === undefined || value === null || value === ''
      ? acc
      : { ...acc, [field]: { [LOCALE]: value } };
  }, {});

const migrateUserSocials = async () => {
  const space = await client.getSpace(spaceId);
  const environment = await space.getEnvironment(environmentId);

  const users = await fetchUsers(environment);

  const usersToMigrate = users
    .map((user) => ({ user, socialFields: getSocialFields(user) }))
    .filter(({ socialFields }) => Object.keys(socialFields).length > 0);

  const skipped = users.length - usersToMigrate.length;
  let created = 0;
  let updated = 0;
  let processed = 0;
  const failed: string[] = [];

  const migrateUser = async ({
    user,
    socialFields,
  }: (typeof usersToMigrate)[number]) => {
    const entryId = socialsEntryId(user.sys.id);
    const fields = {
      ...socialFields,
      user: {
        [LOCALE]: {
          sys: { type: 'Link', linkType: 'Entry', id: user.sys.id },
        },
      },
    };

    try {
      await rateLimiter.removeTokens(1);

      let socialsEntry: Entry;
      try {
        const existing = await environment.getEntry(entryId);
        existing.fields = fields;
        socialsEntry = await existing.update();
        updated += 1;
      } catch {
        socialsEntry = await environment.createEntryWithId('socials', entryId, {
          fields,
        });
        created += 1;
      }

      await socialsEntry.publish();
    } catch (error) {
      failed.push(user.sys.id);
      console.log(`Error migrating user ${user.sys.id}: ${error}`);
    }

    processed += 1;
    console.log(
      `[${processed}/${usersToMigrate.length}] socials for user ${user.sys.id}`,
    );
  };

  for (let index = 0; index < usersToMigrate.length; index += BATCH_SIZE) {
    await Promise.all(
      usersToMigrate.slice(index, index + BATCH_SIZE).map(migrateUser),
    );
  }

  console.log(
    `\nusers: ${users.length} | created: ${created} | updated: ${updated} | skipped: ${skipped} | failed: ${failed.length}`,
  );

  if (failed.length) {
    console.log(`Failed users: ${failed.join(', ')}`);
    process.exitCode = 1;
  }
};

migrateUserSocials().catch((error) => {
  console.error(error);
  process.exit(1);
});
