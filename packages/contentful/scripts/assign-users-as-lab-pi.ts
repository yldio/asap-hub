import * as contentful from 'contentful-management';
import type {
  Environment,
  Entry,
  QueryOptions,
  Link,
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
  select: 'fields.oldLabs,fields.labs',
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

// Context:
// users as a content type has a field called oldLabs which is a reference to labMembership entries
// labMembership entries has a field called lab which is a reference to the lab entry
// labs is a content type that has a field called name and another one call labPI which is a reference to a user entry
// The goal is to assign the user as PI for the lab entry based on labMembership entries (which will be deprecated)
// The user entry has a field called labs which is a reference to lab entries
// write the script to update labs field with the lab entries that are referenced in oldLabs field through labMembership entries

async function rollbackLabsMembership() {
  try {
    const space = await client.getSpace(spaceId);

    const environment: Environment = await space.getEnvironment(environmentId);

    // Fetch all users
    const users = await fetchUsers(environment);

    for (const user of users) {
      if (
        !user.fields ||
        !user.fields.oldLabs ||
        !user.fields.oldLabs['en-US'].length
      ) {
        console.log('No labs, skipping');
        continue;
      }

      const labsMemberships: Entry[] = user.fields.oldLabs?.['en-US'] || [];

      if (!labsMemberships.length) {
        console.log('No labs, skipping - 2');
        continue;
      }

      const isPublished = user.isPublished();

      const userEntry = await environment.getEntry(user.sys.id);

      // Update the labs field
      userEntry.fields.labs = userEntry.fields.labs || {};
      const labLinks = await Promise.all(
        labsMemberships.map(async (lab) => {
          const referencedLabMembership = await environment.getEntry(
            lab.sys.id,
          );
          return referencedLabMembership.fields.lab
            ? {
                sys: {
                  type: 'Link',
                  linkType: 'Entry',
                  id: referencedLabMembership.fields.lab['en-US'].sys.id,
                },
              }
            : undefined;
        }),
      );

      userEntry.fields.labs['en-US'] = labLinks.filter(
        Boolean,
      ) as Link<'Entry'>[];

      // Save and publish the updated entry (if it was previously published)
      try {
        const updatedUser = await userEntry.update();
        if (isPublished) {
          await updatedUser.publish();
        }
        console.log(`Updated user ${user.sys.id}`);
      } catch (err) {
        console.log(`Error updating user ${user.sys.id}: ${err}`);
      }
    }

    console.log('Labs membership rollback completed successfully!');
  } catch (error) {
    console.error('Error rolling back Labs membership:', error);
  }
}

async function assignLabPI() {
  try {
    const space = await client.getSpace(spaceId);
    const environment: Environment = await space.getEnvironment(environmentId);

    const leadPILabMemberships = await environment.getEntries({
      content_type: 'labMembership',
      'fields.role': 'Lead PI',
    } as QueryOptions);

    const labIdsByLabMembershipId = leadPILabMemberships.items.reduce(
      (acc, labMembership) => {
        acc[labMembership.sys.id] = labMembership.fields.lab['en-US'].sys.id;
        return acc;
      },
      {} as Record<string, string>,
    );

    for (const [labMembershipId, labId] of Object.entries(
      labIdsByLabMembershipId,
    )) {
      const users = await environment.getEntries({
        content_type: 'users',
        'fields.oldLabs.sys.id[in]': labMembershipId,
        include: 2,
        select: 'fields.email,sys',
      } as QueryOptions);

      if (users.items.length === 0) {
        console.log(`No users found for lab ${labId}`);
        continue;
      }
      const userEntry = users.items[0];

      // Fetch the existing lab entry to update it
      const labEntry: Entry = await environment.getEntry(labId);

      // Update the labPI field
      labEntry.fields.labPI = labEntry.fields.labPI || {};
      labEntry.fields.labPI['en-US'] = {
        sys: {
          type: 'Link',
          linkType: 'Entry',
          id: userEntry.sys.id,
        },
      } as Link<'Entry'>;

      try {
        // // Save and publish the updated entry
        const updatedLab = await labEntry.update();
        await updatedLab.publish();
        console.log(`Updated lab ${labEntry.sys.id}`);
      } catch (err) {
        console.log(`Error updating lab ${labEntry.sys.id}: ${err}`);
      }
    }
    console.log('Lab PI assignment completed successfully!');
  } catch (error) {
    console.error('Error assigning Lab PI:', error);
  }
}

rollbackLabsMembership()
  .then(() => {
    assignLabPI()
      .then(() => {
        process.stdout.write('Flushing logs...\n');
        process.stdout.end();
      })
      .catch(console.error);
  })
  .catch(console.error);
