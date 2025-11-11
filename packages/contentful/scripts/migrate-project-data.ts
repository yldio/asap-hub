import * as contentful from 'contentful-management';
import type { Environment, QueryOptions } from 'contentful-management';
import { RateLimiter } from 'limiter';
import { addLocaleToFields, createLink } from '../src/utils/parse-fields';

const spaceId = process.env.CONTENTFUL_SPACE_ID!;
const contentfulManagementAccessToken =
  process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!;
const environmentId = process.env.CONTENTFUL_ENV_ID!;

const client = contentful.createClient({
  accessToken: contentfulManagementAccessToken,
});

const RESOURCE_PROJECT_RESOURCE_TYPE_MAPPING: Record<string, string> = {
  ASAP: 'Infrastructure',
  'CRN Cloud': 'Data',
  'Microbiome Analytics Core (MAC)': 'Data',
  GP2: 'Infrastructure',
  'iNDI-PD': 'Preclinical',
  PPMI: 'Infrastructure',
  'PFF Support & Characterization': 'Preclinical',
  'Training & Development': 'Infrastructure',
};

const rateLimiter = new RateLimiter({
  tokensPerInterval: 5,
  interval: 5000,
});

const fetchTeams = async (environment: Environment) => {
  const queryOptions: QueryOptions = {
    content_type: 'teams',
    'sys.archivedAt[exists]': false,
    'sys.publishedAt[exists]': true,
  };
  await rateLimiter.removeTokens(1);
  const teamEntries = (await environment.getEntries(queryOptions)).items;
  return teamEntries;
};

const fetchActivePmEmailForTeam = async (
  environment: Environment,
  teamId: string,
) => {
  await rateLimiter.removeTokens(1);
  const membershipsResponse = await environment.getEntries({
    content_type: 'teamMembership',
    'fields.team.sys.id': teamId,
    'fields.role': 'Project Manager',
    limit: 10,
  });
  const memberships = membershipsResponse.items.filter(
    (membership) =>
      !membership.fields.inactiveSinceDate?.['en-US'] ||
      membership.fields.inactiveSinceDate['en-US'] > new Date().toISOString(),
  );
  if (!memberships.length) {
    console.log(`No PM memberships found for team ${teamId}`);
    return 'deborah.attuah@yld.com'; // to test
  }

  for (const membership of memberships) {
    await rateLimiter.removeTokens(1);
    const usersResponse = await environment.getEntries({
      content_type: 'users',
      links_to_entry: membership.sys.id,
      'fields.onboarded': true,
      'fields.alumniSinceDate[exists]': false,
      limit: 1,
    });

    const user = usersResponse.items[0];
    const email = user?.fields.email?.['en-US'];
    if (email) {
      console.log(`✅ Found PM user ${email} for team ${teamId}`);
      return email;
    }
  }

  console.log(`No active onboarded PM users found for team ${teamId}`);
  return 'deborah.attuah@yld.com'; // to test
};

const fetchResourceTypes = async (environment: Environment) => {
  const queryOptions: QueryOptions = {
    content_type: 'resourceType',
    'sys.archivedAt[exists]': false,
  };
  await rateLimiter.removeTokens(1);
  const resourceTypes = (await environment.getEntries(queryOptions)).items;
  return resourceTypes;
};

const createProjectMembership = async (
  environment: Environment,
  teamId: string,
) => {
  const projectMembershipEntry = await environment.createEntry(
    'projectMembership',
    {
      fields: addLocaleToFields({
        projectMember: createLink(teamId),
      }),
    },
  );
  await projectMembershipEntry.publish();
  return projectMembershipEntry.sys.id;
};

const migrateProjectData = async () => {
  const space = await client.getSpace(spaceId);
  const environment = await space.getEnvironment(environmentId);

  const teamEntries = await fetchTeams(environment);
  const resourceTypes = await fetchResourceTypes(environment);

  const getResourceType = (resourceTypeName: string) =>
    resourceTypes.find(
      (resourceType) => resourceType.fields.name['en-US'] === resourceTypeName,
    );

  for (const team of teamEntries) {
    const teamName = team.fields.displayName?.['en-US'];
    const teamId = team.sys.id;
    console.log(
      `Migrating project data from team ${teamName} with id ${teamId}.`,
    );

    const projectType = Object.keys(
      RESOURCE_PROJECT_RESOURCE_TYPE_MAPPING,
    ).includes(team.fields.teamType?.['en-US'])
      ? 'Resource Project'
      : 'Discovery Project';

    const projectMembershipId = await createProjectMembership(
      environment,
      teamId,
    );

    try {
      const contactEmail = await fetchActivePmEmailForTeam(environment, teamId);
      const projectDetails = {
        title: team.fields.projectTitle?.['en-US'] ?? teamName,
        projectId: team.fields.teamId?.['en-US'] ?? '',
        grantId: team.fields.grantId?.['en-US'] ?? '',
        projectType,
        resourceType:
          projectType === 'Resource Project'
            ? getResourceType(RESOURCE_PROJECT_RESOURCE_TYPE_MAPPING[teamName])
            : undefined,
        originalGrant: team.fields.projectSummary?.['en-US'] ?? '',
        proposal: team.fields.proposal?.['en-US'] ?? undefined,
        supplementGrant: team.fields.supplementGrant?.['en-US'] ?? undefined,
        researchTags: team.fields.researchTags?.['en-US'] ?? [],
        applicationNumber:
          team.fields.applicationNumber?.['en-US'] ?? undefined,
        startDate: new Date().toISOString(),
        contactEmail: contactEmail ?? undefined,
        members: [createLink(projectMembershipId)],
      };

      await rateLimiter.removeTokens(1);
      const projectEntry = await environment.createEntry('projects', {
        fields: addLocaleToFields(projectDetails),
      });
      console.log(`Project created for ${teamName}`);
      await projectEntry.publish();
    } catch (err) {
      console.log(`Error migrating project from team ${teamName}: ${err}`);
    }
  }
};

migrateProjectData().catch(console.error);
