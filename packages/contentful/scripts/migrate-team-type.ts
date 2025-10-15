import * as contentful from 'contentful-management';
import type { Environment, QueryOptions } from 'contentful-management';

const spaceId = process.env.CONTENTFUL_SPACE_ID!;
const contentfulManagementAccessToken =
  process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!;
const environmentId = process.env.CONTENTFUL_ENV_ID!;

const client = contentful.createClient({
  accessToken: contentfulManagementAccessToken,
});

const RESOURCE_TEAMS = [
  'ASAP',
  'CRN Cloud',
  'Microbiome Analytics Core (MAC)',
  'GP2',
  'iNDI-PD',
  'PPMI',
  'PFF Support & Characterization',
];

const LIMIT = 1000;
const queryOptions: QueryOptions = {
  content_type: 'teams',
  select: 'fields.displayName',
  limit: LIMIT,
};

const fetchTeams = async (environment: Environment) => {
  const entries = await environment.getEntries(queryOptions);
  return entries.items;
};

const migrateTeamType = async () => {
  const space = await client.getSpace(spaceId);
  const environment = await space.getEnvironment(environmentId);

  const teamEntries = await fetchTeams(environment);

  const totalEntries = teamEntries.length;
  let currentEntry = 0;

  for (const teamEntry of teamEntries) {
    currentEntry++;

    const teamName = teamEntry.fields?.['displayName']?.['en-US'];

    if (teamName) {
      const teamIdentification = `${teamName} (${teamEntry.sys.id})`;

      console.log(
        `Updating team ${teamIdentification}: ${currentEntry} of ${totalEntries}`,
      );

      try {
        const teamType = RESOURCE_TEAMS.includes(teamName)
          ? 'Resource'
          : 'Discovery';
        console.log(`Team ${teamName} has type ${teamType}`);
        const updatedTeam = await teamEntry.patch([
          {
            op: 'add',
            path: '/fields/type',
            value: { 'en-US': teamType },
          },
        ]);
        await updatedTeam.publish();
        console.log(`Updated team ${teamIdentification}`);
      } catch (err) {
        console.log(`Error updating team ${teamIdentification}: ${err}`);
      }
    }
  }
};

migrateTeamType().catch(console.error);
