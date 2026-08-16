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

// Contentful's CMA allows 10 requests/second; each user costs up to 3
// (get, update, publish), so a token here represents one request.
const rateLimiter = new RateLimiter({ tokensPerInterval: 7, interval: 1000 });
const REQUESTS_PER_USER = 3;
const BATCH_SIZE = 5;

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

const migrateUserSocialsLink = async () => {
  const space = await client.getSpace(spaceId);
  const environment = await space.getEnvironment(environmentId);

  const socials = await fetchAll(environment, { content_type: 'socials' });

  const links = socials.reduce<{ userId: string; socialsId: string }[]>(
    (acc, entry) => {
      const userId = entry.fields?.user?.[LOCALE]?.sys?.id;
      return userId ? [...acc, { userId, socialsId: entry.sys.id }] : acc;
    },
    [],
  );

  const unlinked = socials.length - links.length;
  let updated = 0;
  let alreadyLinked = 0;
  let processed = 0;
  const failed: string[] = [];

  const linkUser = async ({ userId, socialsId }: (typeof links)[number]) => {
    try {
      await rateLimiter.removeTokens(REQUESTS_PER_USER);

      const user = await environment.getEntry(userId);
      const wasPublished = Boolean(user.sys.publishedVersion);

      if (user.fields.userSocials?.[LOCALE]?.sys?.id === socialsId) {
        alreadyLinked += 1;
      } else {
        user.fields.userSocials = {
          [LOCALE]: {
            sys: { type: 'Link', linkType: 'Entry', id: socialsId },
          },
        };

        const saved = await user.update();

        // Only republish users that were already published, so drafts stay
        // drafts.
        if (wasPublished) {
          await saved.publish();
        }

        updated += 1;
      }
    } catch (error) {
      failed.push(userId);
      console.log(`Error linking user ${userId}: ${error}`);
    }

    processed += 1;
    console.log(`[${processed}/${links.length}] linked user ${userId}`);
  };

  for (let index = 0; index < links.length; index += BATCH_SIZE) {
    await Promise.all(links.slice(index, index + BATCH_SIZE).map(linkUser));
  }

  console.log(
    `\nsocials: ${socials.length} | updated: ${updated} | already linked: ${alreadyLinked} | no user link: ${unlinked} | failed: ${failed.length}`,
  );

  if (failed.length) {
    console.log(`Failed users: ${failed.join(', ')}`);
    process.exitCode = 1;
  }
};

migrateUserSocialsLink().catch((error) => {
  console.error(error);
  process.exit(1);
});
