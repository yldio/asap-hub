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

      const labMemberships: Entry[] = user.fields.oldLabs?.['en-US'] || [];

      if (!labMemberships.length) {
        console.log('No labs, skipping - 2');
        continue;
      }

      // Fetch labs referenced in `oldLabs`
      const labs = await environment.getEntries({
        content_type: 'labMembership',
        'sys.id[in]': labMemberships
          .map((labMembership) => labMembership.sys.id)
          .join(','),
      });

      if (!labs.items.length) {
        console.log(`No labs found for user: ${user.fields.email['en-US']}`);
        continue;
      }

      const labIds = labs.items
        .map((lab) => lab.fields.lab?.['en-US'].sys.id)
        .filter(Boolean);

      const isPublished = user.isPublished();

      const userEntry = await environment.getEntry(user.sys.id);

      // Update the labs field
      userEntry.fields.labs = userEntry.fields.labs || {};
      userEntry.fields.labs['en-US'] = labIds.map((labId) => ({
        sys: {
          type: 'Link',
          linkType: 'Entry',
          id: labId,
        },
      })) as Link<'Entry'>[];

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

    // Fetch all labs
    const labs = await environment.getEntries({
      content_type: 'labMembership',
    });

    for (const lab of labs.items) {
      if (!lab.fields.lab || !lab.fields.lab['en-US']) {
        console.log('No lab found, skipping');
        continue;
      }

      const labId = lab.fields.lab['en-US'].sys.id;

      // Fetch users who reference this lab in `oldLabs`
      const users = await environment.getEntries({
        content_type: 'users',
        'fields.oldLabs.sys.id': lab.sys.id,
      } as QueryOptions);

      if (!users.items.length) {
        console.log(`No users found for lab: ${labId}`);
        continue;
      }

      const firstUser = users.items[0]; // Pick the first user - maybe the last user would be better? - also maybe checking if the user is published would be a good idea?

      // Fetch the existing lab entry to update it
      const labEntry: Entry = await environment.getEntry(labId);

      // Update the labPI field
      labEntry.fields.labPI = labEntry.fields.labPI || {};
      labEntry.fields.labPI['en-US'] = {
        sys: {
          type: 'Link',
          linkType: 'Entry',
          id: firstUser.sys.id,
        },
      } as Link<'Entry'>;

      try {
        // // Save and publish the updated entry
        const updatedLab = await labEntry.update();
        await updatedLab.publish();
        console.log(`Updated user ${labEntry.sys.id}`);
      } catch (err) {
        console.log(`Error updating user ${labEntry.sys.id}: ${err}`);
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
