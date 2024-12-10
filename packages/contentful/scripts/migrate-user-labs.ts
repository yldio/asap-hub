import * as contentful from 'contentful-management';
import type {
  Environment,
  Entry,
  Link,
  QueryOptions,
} from 'contentful-management';

const spaceId = process.env.CONTENTFUL_SPACE_ID!;
const contentfulManagementAccessToken =
  process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!;
const environmentId = process.env.CONTENTFUL_ENV_ID!;

const client = contentful.createClient({
  accessToken: contentfulManagementAccessToken,
});

const LIMIT = 1000;
const queryOptions: QueryOptions = {
  content_type: 'users',
  'sys.archivedAt[exists]': false,
  select: 'fields.labs_old,fields.labs',
  limit: LIMIT,
};

const fetchUsers = async (environment: Environment) => {
  let userEntries: Entry[] = [];
  const entries = await environment.getEntries(queryOptions);
  userEntries.push(...entries.items);

  const totalUsers = entries.total;
  while (userEntries.length < totalUsers) {
    let newEntries = await environment.getEntries({
      ...queryOptions,
      skip: userEntries.length,
    });
    userEntries.push(...newEntries.items);
  }

  return userEntries;
};

const migrateUserLabs = async () => {
  const space = await client.getSpace(spaceId);
  const environment = await space.getEnvironment(environmentId);

  const userEntries = await fetchUsers(environment);

  const totalEntries = userEntries.length;
  let currentEntry = 0;

  for (const user of userEntries) {
    currentEntry++;
    console.log(`Verifying user ${currentEntry} of ${totalEntries}`);

    if (
      !user ||
      !user.fields ||
      !user.fields['labs_old'] ||
      !user.fields['labs_old']?.['en-US'].length
    ) {
      console.log('No labs, skipping');
      continue;
    }

    try {
      const oldLabs: Link<string>[] = user.fields['labs_old']['en-US'];
      const currentLabMemberships: Link<string>[] =
        user.fields['labs']['en-US'];

      if (oldLabs.length === currentLabMemberships.length) {
        console.log('No changes needed');
        continue;
      }

      // Deleting lab memberships attached to the user
      // to be sure we don't have duplicates
      for (const staleLabMembership of currentLabMemberships) {
        const entry = await environment.getEntry(staleLabMembership.sys.id);
        await entry.unpublish();
        await entry.delete();
      }

      const labMembershipIds: string[] = [];

      for (const lab of oldLabs) {
        const labMembershipEntry = await environment.createEntry(
          'labMembership',
          {
            fields: {
              lab: {
                'en-US': {
                  sys: {
                    type: 'Link',
                    linkType: 'Entry',
                    id: lab.sys.id,
                  },
                },
              },
            },
          },
        );

        await labMembershipEntry.publish();
        labMembershipIds.push(labMembershipEntry.sys.id);
      }

      const userEntry = await environment.getEntry(user.sys.id);
      userEntry.fields['labs'] = {
        'en-US': labMembershipIds.map((id) => ({
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id,
          },
        })),
      };

      try {
        const updatedUser = await userEntry.update();
        await updatedUser.publish();
        console.log(`Updated user ${user.sys.id}`);
      } catch (err) {
        console.log(`Error updating user ${user.sys.id}: ${err}`);
      }
    } catch (err) {
      console.log(`Error migrating user ${user.sys.id}: ${err}`);
    }
  }
};

migrateUserLabs().catch(console.error);
