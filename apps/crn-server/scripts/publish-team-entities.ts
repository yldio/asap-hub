import { Environment } from 'contentful-management';
import { getContentfulEnvironment, getErrorMessage } from './import-utils';

/**
 * Publishes all draft entities related to one or more teams.
 *
 * Given team entry IDs, traverses the entity graph to find and publish:
 *   Phase 1: Research tags, avatar assets (leaf nodes)
 *   Phase 2: Teams
 *   Phase 3: TeamMemberships, projectMemberships
 *   Phase 4: Users, projects
 *
 * Designed to be called from a GitHub Action for incremental rollout.
 *
 * Usage:
 *   CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=*** CONTENTFUL_SPACE_ID=*** CONTENTFUL_ENV_ID=*** \
 *     yarn publish:team-entities <teamId1> <teamId2> ...
 */

// Collected entities by type, deduplicated across all teams
type PublishQueue = {
  researchTags: Set<string>;
  assets: Set<string>;
  teams: Set<string>;
  teamMemberships: Set<string>;
  projectMemberships: Set<string>;
  users: Set<string>;
  projects: Set<string>;
};

const createQueue = (): PublishQueue => ({
  researchTags: new Set(),
  assets: new Set(),
  teams: new Set(),
  teamMemberships: new Set(),
  projectMemberships: new Set(),
  users: new Set(),
  projects: new Set(),
});

const collectRelatedEntities = async (
  env: Environment,
  teamId: string,
  queue: PublishQueue,
): Promise<void> => {
  console.log(`\nCollecting entities for team ${teamId}...`);

  // Add the team itself
  queue.teams.add(teamId);

  // Find teamMemberships that link to this team
  const memberships = await env.getEntries({
    content_type: 'teamMembership',
    links_to_entry: teamId,
    limit: 200,
  });

  for (const membership of memberships.items) {
    queue.teamMemberships.add(membership.sys.id);

    // Find users that reference this teamMembership
    const users = await env.getEntries({
      content_type: 'users',
      links_to_entry: membership.sys.id,
      limit: 10,
    });

    for (const user of users.items) {
      queue.users.add(user.sys.id);

      // Collect avatar asset
      const avatarLink = user.fields?.avatar?.['en-US'];
      if (avatarLink?.sys?.id) {
        queue.assets.add(avatarLink.sys.id);
      }

      // Collect research tags
      const tagLinks = user.fields?.researchTags?.['en-US'] || [];
      for (const tagLink of tagLinks) {
        if (tagLink?.sys?.id) {
          queue.researchTags.add(tagLink.sys.id);
        }
      }
    }
  }

  // Find projectMemberships that link to this team
  const projectMemberships = await env.getEntries({
    content_type: 'projectMembership',
    links_to_entry: teamId,
    limit: 10,
  });

  for (const pm of projectMemberships.items) {
    queue.projectMemberships.add(pm.sys.id);

    // Find projects that reference this projectMembership
    const projects = await env.getEntries({
      content_type: 'projects',
      links_to_entry: pm.sys.id,
      limit: 5,
    });

    for (const project of projects.items) {
      queue.projects.add(project.sys.id);
    }
  }

  console.log(
    `  Found: ${memberships.items.length} memberships, ` +
      `${queue.users.size} users (cumulative), ` +
      `${projectMemberships.items.length} project memberships`,
  );
};

const publishEntry = async (
  env: Environment,
  entryId: string,
  label: string,
): Promise<'published' | 'already_published' | 'failed'> => {
  try {
    const entry = await env.getEntry(entryId);
    if (entry.isPublished()) {
      return 'already_published';
    }
    await entry.publish();
    console.log(`  Published ${label}: ${entryId}`);
    return 'published';
  } catch (error: unknown) {
    console.error(`  FAILED ${label}: ${entryId} - ${getErrorMessage(error)}`);
    return 'failed';
  }
};

const publishAsset = async (
  env: Environment,
  assetId: string,
): Promise<'published' | 'already_published' | 'failed'> => {
  try {
    const asset = await env.getAsset(assetId);
    if (asset.isPublished()) {
      return 'already_published';
    }
    await asset.publish();
    console.log(`  Published asset: ${assetId}`);
    return 'published';
  } catch (error: unknown) {
    console.error(`  FAILED asset: ${assetId} - ${getErrorMessage(error)}`);
    return 'failed';
  }
};

const app = async () => {
  const teamIds = process.argv.slice(2);
  if (teamIds.length === 0) {
    throw new Error(
      'Usage: yarn publish:team-entities <teamId1> <teamId2> ...',
    );
  }

  const env = await getContentfulEnvironment();
  const queue = createQueue();

  // Collect all related entities across all teams
  for (const teamId of teamIds) {
    await collectRelatedEntities(env, teamId, queue);
  }

  console.log(`\n--- Publish Queue ---`);
  console.log(`Research tags: ${queue.researchTags.size}`);
  console.log(`Assets (avatars): ${queue.assets.size}`);
  console.log(`Teams: ${queue.teams.size}`);
  console.log(`Team memberships: ${queue.teamMemberships.size}`);
  console.log(`Project memberships: ${queue.projectMemberships.size}`);
  console.log(`Users: ${queue.users.size}`);
  console.log(`Projects: ${queue.projects.size}`);

  let published = 0;
  let alreadyPublished = 0;
  let failed = 0;

  const track = (result: 'published' | 'already_published' | 'failed') => {
    if (result === 'published') {
      published += 1;
    } else if (result === 'already_published') {
      alreadyPublished += 1;
    } else {
      failed += 1;
    }
  };

  // Phase 1: Leaf nodes (no dependencies)
  console.log(`\n--- Phase 1: Leaf nodes ---`);

  for (const id of queue.researchTags) {
    track(await publishEntry(env, id, 'researchTag'));
  }
  for (const id of queue.assets) {
    track(await publishAsset(env, id));
  }

  // Phase 2: Teams
  console.log(`\n--- Phase 2: Teams ---`);

  for (const id of queue.teams) {
    track(await publishEntry(env, id, 'team'));
  }

  // Phase 3: Memberships
  console.log(`\n--- Phase 3: Memberships ---`);

  for (const id of queue.teamMemberships) {
    track(await publishEntry(env, id, 'teamMembership'));
  }
  for (const id of queue.projectMemberships) {
    track(await publishEntry(env, id, 'projectMembership'));
  }

  // Phase 4: Users and Projects
  console.log(`\n--- Phase 4: Users and Projects ---`);

  for (const id of queue.users) {
    track(await publishEntry(env, id, 'user'));
  }
  for (const id of queue.projects) {
    track(await publishEntry(env, id, 'project'));
  }

  console.log(`\n--- Summary ---`);
  console.log(
    `Published: ${published}, Already published: ${alreadyPublished}, Failed: ${failed}`,
  );
};

app().catch((err) => {
  console.error(err);
  process.exit(1);
});
