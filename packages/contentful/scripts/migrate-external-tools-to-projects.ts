/**
 * Script: migrate-external-tools-to-projects.ts
 *
 * Migration script to copy `tools` (External Tools) links from Teams
 * entries to their corresponding Projects entries in Contentful.
 *
 * Prerequisites:
 *   1. Run the Contentful migration to add the `tools` field to Projects:
 *      packages/contentful/migrations/crn/project/20260219-add-tools-field-to-projects.js
 *
 * Usage:
 *   CONTENTFUL_SPACE_ID=<spaceId> \
 *   CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=<token> \
 *   CONTENTFUL_ENV_ID=<environmentId> \
 *   ts-node packages/contentful/scripts/migrate-external-tools-to-projects.ts
 *
 * Safety:
 *   - The script only adds tools to Projects; it does NOT remove tools from Teams.
 *   - Skips projects that already have tools to avoid duplication.
 *   - Rate-limited to avoid hitting Contentful API limits.
 */

import * as contentful from 'contentful-management';
import type { Environment } from 'contentful-management';
import { RateLimiter } from 'limiter';

const spaceId = process.env.CONTENTFUL_SPACE_ID!;
const contentfulManagementAccessToken =
  process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!;
const environmentId = process.env.CONTENTFUL_ENV_ID!;

const client = contentful.createClient({
  accessToken: contentfulManagementAccessToken,
});

const rateLimiter = new RateLimiter({
  tokensPerInterval: 4,
  interval: 1000,
});

const throttle = () => rateLimiter.removeTokens(1);

/**
 * Fetch all Teams entries that have at least one tool linked.
 */
const fetchTeamsWithTools = async (environment: Environment) => {
  await throttle();
  const response = await environment.getEntries({
    content_type: 'teams',
    'fields.tools[exists]': true,
    'sys.archivedAt[exists]': false,
    limit: 1000,
  });
  return response.items;
};

/**
 * Given a team entry, find the corresponding Projects entry via the
 * projectMembership reverse-link relationship:
 *   Teams ← ProjectMembership ← Projects
 */
const findLinkedProject = async (
  environment: Environment,
  teamId: string,
): Promise<contentful.Entry | null> => {
  // Find all projectMembership entries that link to this team
  await throttle();
  const memberships = await environment.getEntries({
    content_type: 'projectMembership',
    'fields.projectMember.sys.id': teamId,
    'sys.archivedAt[exists]': false,
    limit: 10,
  });

  if (!memberships.items.length) {
    return null;
  }

  // For each membership, find the project that links to it
  for (const membership of memberships.items) {
    await throttle();
    const projects = await environment.getEntries({
      content_type: 'projects',
      links_to_entry: membership.sys.id,
      'sys.archivedAt[exists]': false,
      limit: 1,
    });

    if (projects.items.length) {
      return projects.items[0];
    }
  }

  return null;
};

const migrateExternalToolsToProjects = async () => {
  console.log(
    'Starting migration of External Tools from Teams to Projects...\n',
  );

  const space = await client.getSpace(spaceId);
  const environment = await space.getEnvironment(environmentId);

  const teamsWithTools = await fetchTeamsWithTools(environment);
  console.log(
    `Found ${teamsWithTools.length} Teams with External Tools to migrate.\n`,
  );

  let migrated = 0;
  let skipped = 0;
  let errors = 0;

  for (const team of teamsWithTools) {
    const teamName = team.fields.displayName?.['en-US'] ?? team.sys.id;
    const teamTools: Array<{ sys: { id: string } }> =
      team.fields.tools?.['en-US'] ?? [];

    if (!teamTools.length) {
      console.log(`  Team "${teamName}" has empty tools array, skipping.`);
      skipped++;
      continue;
    }

    console.log(
      `Processing team "${teamName}" (id: ${team.sys.id}) with ${teamTools.length} tool(s)...`,
    );

    try {
      const project = await findLinkedProject(environment, team.sys.id);

      if (!project) {
        console.log(
          `  No linked project found for team "${teamName}", skipping.`,
        );
        skipped++;
        continue;
      }

      const projectTitle = project.fields.title?.['en-US'] ?? project.sys.id;

      // Check if project already has tools (avoid overwriting)
      const existingProjectTools: unknown[] =
        project.fields.tools?.['en-US'] ?? [];
      if (existingProjectTools.length > 0) {
        console.log(
          `  Project "${projectTitle}" already has ${existingProjectTools.length} tool(s). Skipping to avoid duplication.`,
        );
        skipped++;
        continue;
      }

      console.log(
        `  Copying ${teamTools.length} tool(s) to project "${projectTitle}" (id: ${project.sys.id})`,
      );

      await throttle();

      // Patch the project entry with tools links from the team
      project.fields.tools = { 'en-US': teamTools };

      const updatedProject = await project.update();
      await updatedProject.publish();
      console.log(`     Published.`);

      migrated++;
    } catch (err) {
      console.error(
        `  Error processing team "${teamName}": ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
      errors++;
    }
  }

  console.log('\n--- Migration Summary ---');
  console.log(`  Migrated : ${migrated}`);
  console.log(`  Skipped  : ${skipped}`);
  console.log(`  Errors   : ${errors}`);
  console.log('\nMigration completed successfully!');
};

migrateExternalToolsToProjects().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
