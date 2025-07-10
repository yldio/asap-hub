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
  content_type: 'interestGroups',
  'sys.archivedAt[exists]': false,
  select: 'fields.teams_old,fields.name',
  limit: LIMIT,
};

const fetchInterestGroups = async (environment: Environment) => {
  let interestGroupEntries: Entry[] = [];
  const entries = await environment.getEntries(queryOptions);
  interestGroupEntries.push(...entries.items);

  const totalInterestGroups = entries.total;
  while (interestGroupEntries.length < totalInterestGroups) {
    let newEntries = await environment.getEntries({
      ...queryOptions,
      skip: interestGroupEntries.length,
    });
    interestGroupEntries.push(...newEntries.items);
  }

  return interestGroupEntries;
};

const migrateInterestGroupTeams = async () => {
  const space = await client.getSpace(spaceId);
  const environment = await space.getEnvironment(environmentId);

  const interestGroupEntries = await fetchInterestGroups(environment);

  const totalEntries = interestGroupEntries.length;
  let currentEntry = 0;

  for (const interestGroupEntry of interestGroupEntries) {
    currentEntry++;

    const interestGroupIdentification = `${interestGroupEntry.fields['name']['en-US']} (${interestGroupEntry.sys.id})`;

    console.log(
      `Verifying interest group ${interestGroupIdentification}: ${currentEntry} of ${totalEntries}`,
    );

    if (
      !interestGroupEntry ||
      !interestGroupEntry.fields ||
      !interestGroupEntry.fields['teams'] ||
      !interestGroupEntry.fields['teams']?.['en-US'].length
    ) {
      console.log('No teams, skipping');
      continue;
    }

    try {
      const oldTeams: Link<string>[] =
        interestGroupEntry.fields['teams']['en-US'];

      const currentTeams: Link<string>[] = interestGroupEntry.fields['teams'];

      if (
        currentTeams &&
        oldTeams.length === currentTeams.length &&
        oldTeams.every((team) =>
          currentTeams.some(
            (currentTeam) => currentTeam.sys.id === team.sys.id,
          ),
        )
      ) {
        console.log('No changes needed');
        continue;
      }

      // Deleting old teams attached to the interest group
      // to be sure we don't have duplicates
      for (const staleTeam of currentTeams || []) {
        const entry = await environment.getEntry(staleTeam.sys.id);
        await entry.unpublish();
        await entry.delete();
      }

      const teamIds: string[] = [];

      for (const team of oldTeams) {
        const teamEntry = await environment.createEntry('interestGroupsTeams', {
          fields: {
            team: {
              'en-US': {
                sys: {
                  type: 'Link',
                  linkType: 'Entry',
                  id: team.sys.id,
                },
              },
            },
            startDate: {
              'en-US': new Date(),
            },
          },
        });

        await teamEntry.publish();
        teamIds.push(teamEntry.sys.id);
      }

      try {
        const updatedInterestGroup = await interestGroupEntry.patch([
          {
            op: 'add',
            path: '/fields/teams_new',
            value: {
              'en-US': teamIds.map((id) => ({
                sys: {
                  type: 'Link',
                  linkType: 'Entry',
                  id,
                },
              })),
            },
          },
        ]);
        await updatedInterestGroup.publish();
        console.log(`Updated interest group ${interestGroupIdentification}`);
      } catch (err) {
        console.log(
          `Error updating interest group ${interestGroupIdentification}: ${err}`,
        );
      }
    } catch (err) {
      console.log(
        `Error migrating interest group ${interestGroupIdentification}: ${err}`,
      );
    }
  }
};

migrateInterestGroupTeams().catch(console.error);
