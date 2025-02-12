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

    const users = await environment.getEntries({
      content_type: 'users',
      'fields.oldLabs.sys.id[exists]': true, // Ensures oldLabs is not empty
      include: 2, // Attempts to resolve references
    } as QueryOptions);

    const labMembershipIds = users.items.flatMap(
      (user) =>
        user.fields.oldLabs?.['en-US'].map(
          (membershipRef: any) => membershipRef.sys.id,
        ) || [],
    );

    const labMemberships = await environment.getEntries({
      content_type: 'labMembership',
      'sys.id[in]': labMembershipIds.join(','),
      include: 2, // Fetches referenced `lab` entries too
    } as QueryOptions);

    const membershipsById = Object.fromEntries(
      labMemberships.items.map((m) => [m.sys.id, m]),
    );

    for (const membership of labMemberships.items) {
      if (!membership.fields.lab || !membership.fields.lab['en-US']) {
        console.log('No lab found, skipping');
        continue;
      }

      const labId = membership.fields.lab['en-US'].sys.id;

      const leadPiUsers = users.items.filter((user) => {
        return user.fields.oldLabs?.['en-US'].some((membershipRef: any) => {
          const membership = membershipsById[membershipRef.sys.id]; // Get full LabMembership entry
          return (
            membership &&
            membership.fields.lab?.['en-US'].sys.id === labId &&
            membership.fields.role?.['en-US'] === 'Lead PI'
          );
        });
      });
      if (!leadPiUsers.length) {
        console.log('No lead PI users found, skipping');
        continue;
      }

      const leadPi = leadPiUsers.length ? leadPiUsers[0] : users.items[0];

      // Fetch the existing lab entry to update it
      const labEntry: Entry = await environment.getEntry(labId);

      // Update the labPI field
      labEntry.fields.labPI = labEntry.fields.labPI || {};
      labEntry.fields.labPI['en-US'] = {
        sys: {
          type: 'Link',
          linkType: 'Entry',
          id: leadPi.sys.id,
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
