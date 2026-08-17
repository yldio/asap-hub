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

const verifyUserSocialsLink = async () => {
  const space = await client.getSpace(spaceId);
  const environment = await space.getEnvironment(environmentId);

  const socials = await fetchAll(environment, { content_type: 'socials' });
  const users = await fetchAll(environment, {
    content_type: 'users',
    'sys.archivedAt[exists]': false,
    select: 'sys,fields.userSocials',
  });

  const usersById = new Map(users.map((user) => [user.sys.id, user]));

  const unlinked: string[] = [];
  const missingUser: string[] = [];
  const notLinked: string[] = [];
  const wrongLink: string[] = [];
  const unpublishedLink: string[] = [];
  const sharedSocials: string[] = [];
  const seenSocials = new Map<string, string>();

  socials.forEach((entry) => {
    const userId = entry.fields?.user?.[LOCALE]?.sys?.id;

    if (!userId) {
      unlinked.push(entry.sys.id);
      return;
    }

    const user = usersById.get(userId);

    if (!user) {
      missingUser.push(`${entry.sys.id} -> ${userId}`);
      return;
    }

    const linkedId = user.fields?.userSocials?.[LOCALE]?.sys?.id;

    if (!linkedId) {
      notLinked.push(userId);
      return;
    }

    if (linkedId !== entry.sys.id) {
      wrongLink.push(`${userId}: expected ${entry.sys.id}, got ${linkedId}`);
      return;
    }

    // the link only counts once it is published; a published user with
    // pending changes means a previous run saved the link but failed to
    // publish it (drafts are deliberately left as drafts)
    if (
      user.sys.publishedVersion &&
      user.sys.version >= user.sys.publishedVersion + 2
    ) {
      unpublishedLink.push(userId);
      return;
    }

    const previous = seenSocials.get(linkedId);
    if (previous) {
      sharedSocials.push(`${linkedId} shared by ${previous} and ${userId}`);
    }
    seenSocials.set(linkedId, userId);
  });

  const usersLinked = users.filter(
    (user) => user.fields?.userSocials?.[LOCALE]?.sys?.id,
  ).length;

  const report = (label: string, entries: string[]) => {
    console.log(`${label}: ${entries.length}`);
    entries.slice(0, 20).forEach((entry) => console.log(`  ${entry}`));
    if (entries.length > 20) {
      console.log(`  ...and ${entries.length - 20} more`);
    }
  };

  console.log(`environment: ${environmentId}`);
  console.log(`socials entries: ${socials.length}`);
  console.log(`users with userSocials set: ${usersLinked}\n`);

  report('socials entries with no user link', unlinked);
  report('socials entries whose user is missing', missingUser);
  report('users missing the userSocials link', notLinked);
  report('users linked to the wrong socials entry', wrongLink);
  report('users whose link is saved but not published', unpublishedLink);
  report('socials entries shared by several users', sharedSocials);

  const failures =
    unlinked.length +
    missingUser.length +
    notLinked.length +
    wrongLink.length +
    unpublishedLink.length +
    sharedSocials.length;

  if (failures) {
    console.log('\nVerification failed');
    process.exitCode = 1;
    return;
  }

  console.log('\nEvery socials entry is linked from its user');
};

verifyUserSocialsLink().catch((error) => {
  console.error(error);
  process.exit(1);
});
