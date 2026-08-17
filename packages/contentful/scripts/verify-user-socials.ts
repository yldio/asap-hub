import * as contentful from 'contentful-management';
import type { Environment, Entry, QueryOptions } from 'contentful-management';

const spaceId = process.env.CONTENTFUL_SPACE_ID!;
const contentfulManagementAccessToken =
  process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!;
const environmentId = process.env.CONTENTFUL_ENV_ID!;

const client = contentful.createClient({
  accessToken: contentfulManagementAccessToken,
});

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

const fetchAll = async (environment: Environment, query: QueryOptions) => {
  const entries: Entry[] = [];
  const first = await environment.getEntries({ ...query, limit: LIMIT });
  entries.push(...first.items);

  while (entries.length < first.total) {
    const next = await environment.getEntries({
      ...query,
      limit: LIMIT,
      skip: entries.length,
    });
    entries.push(...next.items);
  }

  return entries;
};

const getSocialValues = (entry: Entry) =>
  SOCIAL_FIELDS.reduce<Record<string, string>>((acc, field) => {
    const value = entry.fields?.[field]?.[LOCALE];
    return value === undefined || value === null || value === ''
      ? acc
      : { ...acc, [field]: value };
  }, {});

const verifyUserSocials = async () => {
  const space = await client.getSpace(spaceId);
  const environment = await space.getEnvironment(environmentId);

  const users = await fetchAll(environment, {
    content_type: 'users',
    'sys.archivedAt[exists]': false,
    select: ['sys.id', ...SOCIAL_FIELDS.map((f) => `fields.${f}`)].join(','),
  });

  const socials = await fetchAll(environment, { content_type: 'socials' });

  const socialsByUser = new Map<string, Entry>();
  const unlinked: string[] = [];
  const duplicates: string[] = [];

  socials.forEach((entry) => {
    const userId = entry.fields?.user?.[LOCALE]?.sys?.id;

    if (!userId) {
      unlinked.push(entry.sys.id);
      return;
    }

    if (socialsByUser.has(userId)) {
      duplicates.push(userId);
      return;
    }

    socialsByUser.set(userId, entry);
  });

  const missing: string[] = [];
  const mismatched: string[] = [];
  const unexpected: string[] = [];
  const unpublished: string[] = [];
  let expected = 0;

  users.forEach((user) => {
    const values = getSocialValues(user);

    if (!Object.keys(values).length) {
      return;
    }

    expected += 1;
    const entry = socialsByUser.get(user.sys.id);

    if (!entry) {
      missing.push(user.sys.id);
      return;
    }

    if (!entry.sys.publishedVersion) {
      unpublished.push(user.sys.id);
    }

    const migrated = getSocialValues(entry);

    SOCIAL_FIELDS.forEach((field) => {
      if (values[field] !== migrated[field]) {
        mismatched.push(
          `${user.sys.id} ${field}: expected ${JSON.stringify(
            values[field],
          )}, got ${JSON.stringify(migrated[field])}`,
        );
      }
    });

    Object.keys(migrated).forEach((field) => {
      if (values[field] === undefined) {
        unexpected.push(`${user.sys.id} ${field}=${migrated[field]}`);
      }
    });
  });

  const report = (label: string, entries: string[]) => {
    console.log(`${label}: ${entries.length}`);
    entries.slice(0, 20).forEach((entry) => console.log(`  ${entry}`));
    if (entries.length > 20) {
      console.log(`  ...and ${entries.length - 20} more`);
    }
  };

  console.log(`environment: ${environmentId}`);
  console.log(`users (not archived): ${users.length}`);
  console.log(`users with social values: ${expected}`);
  console.log(`socials entries: ${socials.length}\n`);

  report('missing socials entries', missing);
  report('users with duplicate socials entries', duplicates);
  report('socials entries with no user link', unlinked);
  report('value mismatches', mismatched);
  report('values not present on the user', unexpected);
  report('unpublished socials entries', unpublished);

  const failures =
    missing.length +
    duplicates.length +
    unlinked.length +
    mismatched.length +
    unexpected.length;

  if (failures) {
    console.log('\nVerification failed');
    process.exitCode = 1;
    return;
  }

  console.log(
    unpublished.length
      ? '\nAll values migrated correctly, but some entries are unpublished'
      : '\nAll values migrated correctly',
  );
};

verifyUserSocials().catch((error) => {
  console.error(error);
  process.exit(1);
});
