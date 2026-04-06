import { type Asset, type Entry, type Environment } from '@asap-hub/contentful';
import {
  getContentfulEnvironment,
  getErrorMessage,
  isArchivedResource,
  NON_ARCHIVED_ENTRY_QUERY,
} from './import-utils';

/**
 * Publishes all draft entities related to one or more teams.
 *
 * Given team entry IDs, traverses the entity graph to find and publish:
 *   Phase 1: Research tags, avatar assets, research output versions (leaf nodes)
 *   Phase 2: Teams
 *   Phase 3: TeamMemberships, projectMemberships
 *   Phase 4: Users, projects
 *   Phase 5: Research outputs
 *
 * Designed to be called from a GitHub Action for incremental rollout.
 *
 * Usage (env vars loaded from .env file):
 *   yarn publish:team-entities <teamIdOrName1> <teamIdOrName2> ...
 */

// Collected entities by type, deduplicated across all teams
type PublishQueue = {
  researchTags: Set<string>;
  assets: Set<string>;
  researchOutputVersions: Set<string>;
  teams: Set<string>;
  teamMemberships: Set<string>;
  projectMemberships: Set<string>;
  users: Set<string>;
  projects: Set<string>;
  researchOutputs: Set<string>;
};

type ResolvedTeamReference = {
  id: string;
  name: string;
  reference: string;
  url: string;
};

// exported for testing
export const createQueue = (): PublishQueue => ({
  researchTags: new Set(),
  assets: new Set(),
  researchOutputVersions: new Set(),
  teams: new Set(),
  teamMemberships: new Set(),
  projectMemberships: new Set(),
  users: new Set(),
  projects: new Set(),
  researchOutputs: new Set(),
});

type PublishOutcome =
  | 'published'
  | 'already_published'
  | 'skipped_archived'
  | 'failed';
type PublishState = 'draft' | 'changed' | 'published';

type VersionedSys = {
  id: string;
  version?: number;
  publishedVersion?: number;
  archivedAt?: string;
  archivedVersion?: number;
};

type PublishableResource = {
  sys: VersionedSys;
  fields: unknown;
  publish: () => Promise<unknown>;
};

type PublishResourceOptions<T extends PublishableResource> = {
  id: string;
  label: string;
  fetchResource: (id: string) => Promise<T>;
  describeResource: (resource: T) => string;
  buildUrl: (id: string) => string;
};

type LocalizedFieldMap = Record<string, { 'en-US'?: unknown } | undefined>;

type LinkedEntryQuery = {
  content_type: string;
  links_to_entry: string;
  limit: number;
  skip?: number;
};

type LinkLike = {
  sys?: {
    id?: string;
  };
};

const getRequiredEnvValue = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing env var: ${name}`);
  }

  return value;
};

const RESEARCH_OUTPUT_RESEARCH_TAG_FIELDS = [
  'methods',
  'organisms',
  'environments',
  'keywords',
  'subtype',
] as const;

// exported for testing
export const getPublishState = ({
  version,
  publishedVersion,
}: VersionedSys): PublishState => {
  if (typeof publishedVersion !== 'number') {
    return 'draft';
  }

  if (typeof version === 'number' && version > publishedVersion + 1) {
    return 'changed';
  }

  return 'published';
};

// exported for testing
export const getContentfulAppBaseUrl = (): string => {
  const spaceId = getRequiredEnvValue('CONTENTFUL_SPACE_ID');
  const environmentId = getRequiredEnvValue('CONTENTFUL_ENV_ID');

  return `https://app.contentful.com/spaces/${spaceId}/environments/${environmentId}`;
};

// exported for testing
export const buildEntryUrl = (baseUrl: string, id: string): string =>
  `${baseUrl}/entries/${id}`;

// exported for testing
export const buildAssetUrl = (baseUrl: string, id: string): string =>
  `${baseUrl}/assets/${id}`;

// exported for testing
export const getLocalizedFieldValue = (
  resource: { fields: unknown },
  fieldName: string,
): unknown => {
  const fields = resource.fields as LocalizedFieldMap | undefined;

  return fields?.[fieldName]?.['en-US'];
};

// exported for testing
export const getLocalizedString = (
  resource: { fields: unknown },
  fieldName: string,
): string | undefined => {
  const value = getLocalizedFieldValue(resource, fieldName);

  return typeof value === 'string' && value ? value : undefined;
};

// exported for testing
export const getLinkedEntryIds = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.flatMap((item) => getLinkedEntryIds(item));
  }

  const id = (value as LinkLike | undefined)?.sys?.id;
  return typeof id === 'string' ? [id] : [];
};

// exported for testing
export const describeEntry = (entry: Entry, label: string): string => {
  if (label === 'team') {
    return getLocalizedString(entry, 'displayName') || 'Unnamed team';
  }

  if (label === 'user') {
    const firstName = getLocalizedString(entry, 'firstName') || '';
    const lastName = getLocalizedString(entry, 'lastName') || '';
    const fullName = `${firstName} ${lastName}`.trim();

    return fullName || getLocalizedString(entry, 'email') || 'Unnamed user';
  }

  if (label === 'project') {
    return (
      getLocalizedString(entry, 'projectId') ||
      getLocalizedString(entry, 'title') ||
      'Unnamed project'
    );
  }

  if (label === 'researchTag') {
    return getLocalizedString(entry, 'name') || 'Unnamed research tag';
  }

  if (label === 'researchOutput') {
    return getLocalizedString(entry, 'title') || 'Unnamed research output';
  }

  if (label === 'researchOutputVersion') {
    return (
      getLocalizedString(entry, 'title') || 'Unnamed research output version'
    );
  }

  if (label === 'teamMembership') {
    return getLocalizedString(entry, 'role') || 'Unnamed team membership';
  }

  if (label === 'projectMembership') {
    return getLocalizedString(entry, 'role') || 'Unnamed project membership';
  }

  return label;
};

// exported for testing
export const describeAsset = (asset: Asset): string => {
  const title = getLocalizedString(asset, 'title');
  if (title) {
    return title;
  }

  const file = getLocalizedFieldValue(asset, 'file') as
    | { fileName?: string }
    | undefined;

  return file?.fileName || 'Unnamed asset';
};

// exported for testing
export const isNotFoundError = (error: unknown): boolean => {
  if (!(error instanceof Error)) {
    return false;
  }

  try {
    const parsed = JSON.parse(error.message) as { status?: number };

    return parsed.status === 404;
  } catch {
    return error.message.includes('404') || /not found/i.test(error.message);
  }
};

// exported for testing
export const isTeamEntry = (entry: Entry): boolean =>
  entry.sys.contentType?.sys?.id === 'teams';

// exported for testing
export const buildResolvedTeam = (
  entry: Entry,
  reference: string,
  appBaseUrl: string,
): ResolvedTeamReference => ({
  id: entry.sys.id,
  name: getLocalizedString(entry, 'displayName') || entry.sys.id,
  reference,
  url: buildEntryUrl(appBaseUrl, entry.sys.id),
});

const resolveTeamById = async (
  env: Environment,
  reference: string,
  appBaseUrl: string,
): Promise<ResolvedTeamReference | null> => {
  try {
    const entry = await env.getEntry(reference);

    if (!isTeamEntry(entry)) {
      throw new Error(
        `Reference "${reference}" resolved to Contentful entry "${reference}", but it is not a team entry.`,
      );
    }

    if (isArchivedResource(entry.sys)) {
      throw new Error(
        `Reference "${reference}" resolved to archived team entry "${reference}". Archived teams cannot be published.`,
      );
    }

    return buildResolvedTeam(entry, reference, appBaseUrl);
  } catch (error: unknown) {
    if (isNotFoundError(error)) {
      return null;
    }

    throw error;
  }
};

const resolveTeamByName = async (
  env: Environment,
  reference: string,
  appBaseUrl: string,
): Promise<ResolvedTeamReference> => {
  const matches = await env.getEntries({
    ...NON_ARCHIVED_ENTRY_QUERY,
    content_type: 'teams',
    'fields.displayName': reference,
    limit: 10,
  });

  if (matches.items.length === 0) {
    throw new Error(
      `Could not resolve team reference "${reference}" as either a team entry ID or an exact team displayName.`,
    );
  }

  if (matches.items.length > 1) {
    const candidates = matches.items
      .map((entry) => {
        const resolvedTeam = buildResolvedTeam(entry, reference, appBaseUrl);

        return `  - ${resolvedTeam.name} (${resolvedTeam.id}) ${resolvedTeam.url}`;
      })
      .join('\n');

    throw new Error(
      `Team name "${reference}" is ambiguous. Matching teams:\n${candidates}`,
    );
  }

  const [entry] = matches.items;

  if (!entry) {
    throw new Error(`Could not resolve team reference "${reference}".`);
  }

  return buildResolvedTeam(entry, reference, appBaseUrl);
};

const resolveTeamReference = async (
  env: Environment,
  reference: string,
  appBaseUrl: string,
): Promise<ResolvedTeamReference> => {
  const resolvedById = await resolveTeamById(env, reference, appBaseUrl);

  if (resolvedById) {
    return resolvedById;
  }

  return resolveTeamByName(env, reference, appBaseUrl);
};

const resolveTeamReferences = async (
  env: Environment,
  references: string[],
  appBaseUrl: string,
): Promise<ResolvedTeamReference[]> => {
  const resolvedTeams = new Map<string, ResolvedTeamReference>();

  for (const reference of references) {
    const resolvedTeam = await resolveTeamReference(env, reference, appBaseUrl);

    if (!resolvedTeams.has(resolvedTeam.id)) {
      resolvedTeams.set(resolvedTeam.id, resolvedTeam);
    }
  }

  return Array.from(resolvedTeams.values());
};

/**
 * Use a pagination strategy to fetch all related entities and fails if we can't bring all
 */
const getAllLinkedEntries = async (
  env: Environment,
  query: LinkedEntryQuery,
  label: string,
): Promise<Entry[]> => {
  const entries: Entry[] = [];
  let skip = 0;
  let total = 0;

  while (total === 0 || entries.length < total) {
    const response = await env.getEntries({
      ...NON_ARCHIVED_ENTRY_QUERY,
      ...query,
      skip,
    });

    if (skip === 0) {
      total = response.total;

      if (response.total > response.items.length) {
        console.log(`  Paginating ${label}: ${response.total} total entries`);
      }
    }

    if (response.items.length === 0) {
      if (entries.length < total) {
        throw new Error(
          `Pagination stalled while collecting ${label}: expected ${total} entries, got ${entries.length}`,
        );
      }
      break;
    }

    entries.push(...response.items);
    skip += response.items.length;
  }

  return entries;
};

const publishResource = async <T extends PublishableResource>({
  id,
  label,
  fetchResource,
  describeResource,
  buildUrl,
}: PublishResourceOptions<T>): Promise<PublishOutcome> => {
  try {
    const resource = await fetchResource(id);
    const description = describeResource(resource);
    const details = `${description} (${id}) ${buildUrl(id)}`;

    if (isArchivedResource(resource.sys)) {
      console.log(`  Skipped archived ${label}: ${details}`);
      return 'skipped_archived';
    }

    const publishState = getPublishState(resource.sys);

    if (publishState === 'published') {
      console.log(`  Already published ${label}: ${details}`);
      return 'already_published';
    }

    await resource.publish();
    console.log(`  Published ${label}: ${details}`);
    return 'published';
  } catch (error: unknown) {
    console.error(
      `  FAILED ${label}: ${id} ${buildUrl(id)} - ${getErrorMessage(error)}`,
    );
    return 'failed';
  }
};

const collectRelatedEntities = async (
  env: Environment,
  team: ResolvedTeamReference,
  queue: PublishQueue,
): Promise<void> => {
  console.log(
    `\nCollecting entities for team ${team.name} (${team.id}) ${team.url}...`,
  );

  // Add the team itself
  queue.teams.add(team.id);

  // Find teamMemberships that link to this team
  const memberships = await getAllLinkedEntries(
    env,
    {
      content_type: 'teamMembership',
      links_to_entry: team.id,
      limit: 200,
    },
    `team memberships for ${team.name}`,
  );

  for (const membership of memberships) {
    queue.teamMemberships.add(membership.sys.id);

    // Find users that reference this teamMembership
    const users = await getAllLinkedEntries(
      env,
      {
        content_type: 'users',
        links_to_entry: membership.sys.id,
        limit: 10,
      },
      `users for team membership ${membership.sys.id}`,
    );

    for (const user of users) {
      queue.users.add(user.sys.id);

      // Collect avatar asset
      for (const avatarId of getLinkedEntryIds(
        getLocalizedFieldValue(user, 'avatar'),
      )) {
        queue.assets.add(avatarId);
      }

      // Collect research tags
      for (const tagId of getLinkedEntryIds(
        getLocalizedFieldValue(user, 'researchTags'),
      )) {
        queue.researchTags.add(tagId);
      }
    }
  }

  // Find projectMemberships that link to this team
  const projectMemberships = await getAllLinkedEntries(
    env,
    {
      content_type: 'projectMembership',
      links_to_entry: team.id,
      limit: 10,
    },
    `project memberships for ${team.name}`,
  );

  for (const pm of projectMemberships) {
    queue.projectMemberships.add(pm.sys.id);

    // Find projects that reference this projectMembership
    const projects = await getAllLinkedEntries(
      env,
      {
        content_type: 'projects',
        links_to_entry: pm.sys.id,
        limit: 5,
      },
      `projects for project membership ${pm.sys.id}`,
    );

    for (const project of projects) {
      queue.projects.add(project.sys.id);
    }
  }

  const researchOutputs = await getAllLinkedEntries(
    env,
    {
      content_type: 'researchOutputs',
      links_to_entry: team.id,
      limit: 500,
    },
    `research outputs for ${team.name}`,
  );

  for (const researchOutput of researchOutputs) {
    queue.researchOutputs.add(researchOutput.sys.id);

    for (const fieldName of RESEARCH_OUTPUT_RESEARCH_TAG_FIELDS) {
      for (const tagId of getLinkedEntryIds(
        getLocalizedFieldValue(researchOutput, fieldName),
      )) {
        queue.researchTags.add(tagId);
      }
    }

    for (const versionId of getLinkedEntryIds(
      getLocalizedFieldValue(researchOutput, 'versions'),
    )) {
      queue.researchOutputVersions.add(versionId);
    }
  }

  console.log(
    `  Found: ${memberships.length} memberships, ` +
      `${queue.users.size} users (cumulative), ` +
      `${projectMemberships.length} project memberships, ` +
      `${researchOutputs.length} research outputs`,
  );
};

const publishEntry = async (
  env: Environment,
  appBaseUrl: string,
  entryId: string,
  label: string,
): Promise<PublishOutcome> =>
  publishResource<Entry>({
    id: entryId,
    label,
    fetchResource: (id) => env.getEntry(id),
    describeResource: (entry) => describeEntry(entry, label),
    buildUrl: (id) => buildEntryUrl(appBaseUrl, id),
  });

const publishAsset = async (
  env: Environment,
  appBaseUrl: string,
  assetId: string,
): Promise<PublishOutcome> =>
  publishResource<Asset>({
    id: assetId,
    label: 'asset',
    fetchResource: (id) => env.getAsset(id),
    describeResource: describeAsset,
    buildUrl: (id) => buildAssetUrl(appBaseUrl, id),
  });

const app = async () => {
  const teamReferences = process.argv.slice(2);
  if (teamReferences.length === 0) {
    throw new Error(
      'Usage: yarn publish:team-entities <teamIdOrName1> <teamIdOrName2> ...',
    );
  }

  const appBaseUrl = getContentfulAppBaseUrl();
  const env = await getContentfulEnvironment();
  const queue = createQueue();
  const resolvedTeams = await resolveTeamReferences(
    env,
    teamReferences,
    appBaseUrl,
  );

  console.log(`\n--- Resolved Teams ---`);
  for (const team of resolvedTeams) {
    console.log(`${team.reference} -> ${team.name} (${team.id}) ${team.url}`);
  }

  // Collect all related entities across all teams
  for (const team of resolvedTeams) {
    await collectRelatedEntities(env, team, queue);
  }

  console.log(`\n--- Publish Queue ---`);
  console.log(`Research tags: ${queue.researchTags.size}`);
  console.log(`Assets (avatars): ${queue.assets.size}`);
  console.log(`Research output versions: ${queue.researchOutputVersions.size}`);
  console.log(`Teams: ${queue.teams.size}`);
  console.log(`Team memberships: ${queue.teamMemberships.size}`);
  console.log(`Project memberships: ${queue.projectMemberships.size}`);
  console.log(`Users: ${queue.users.size}`);
  console.log(`Projects: ${queue.projects.size}`);
  console.log(`Research outputs: ${queue.researchOutputs.size}`);

  let published = 0;
  let alreadyPublished = 0;
  let skippedArchived = 0;
  let failed = 0;

  const track = (result: PublishOutcome) => {
    if (result === 'published') {
      published += 1;
    } else if (result === 'already_published') {
      alreadyPublished += 1;
    } else if (result === 'skipped_archived') {
      skippedArchived += 1;
    } else {
      failed += 1;
    }
  };

  // Phase 1: Leaf nodes (no dependencies)
  console.log(`\n--- Phase 1: Leaf nodes ---`);

  for (const id of queue.researchTags) {
    track(await publishEntry(env, appBaseUrl, id, 'researchTag'));
  }
  for (const id of queue.assets) {
    track(await publishAsset(env, appBaseUrl, id));
  }
  for (const id of queue.researchOutputVersions) {
    track(await publishEntry(env, appBaseUrl, id, 'researchOutputVersion'));
  }

  // Phase 2: Teams
  console.log(`\n--- Phase 2: Teams ---`);

  for (const id of queue.teams) {
    track(await publishEntry(env, appBaseUrl, id, 'team'));
  }

  // Phase 3: Memberships
  console.log(`\n--- Phase 3: Memberships ---`);

  for (const id of queue.teamMemberships) {
    track(await publishEntry(env, appBaseUrl, id, 'teamMembership'));
  }
  for (const id of queue.projectMemberships) {
    track(await publishEntry(env, appBaseUrl, id, 'projectMembership'));
  }

  // Phase 4: Users and Projects
  console.log(`\n--- Phase 4: Users and Projects ---`);

  for (const id of queue.users) {
    track(await publishEntry(env, appBaseUrl, id, 'user'));
  }
  for (const id of queue.projects) {
    track(await publishEntry(env, appBaseUrl, id, 'project'));
  }

  // Phase 5: Research outputs
  console.log(`\n--- Phase 5: Research outputs ---`);

  for (const id of queue.researchOutputs) {
    track(await publishEntry(env, appBaseUrl, id, 'researchOutput'));
  }

  console.log(`\n--- Summary ---`);
  console.log(
    `Published: ${published}, Already published: ${alreadyPublished}, Skipped archived: ${skippedArchived}, Failed: ${failed}`,
  );

  if (failed > 0) {
    throw new Error(`${failed} entities failed to publish.`);
  }
};

if (require.main === module) {
  app().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
