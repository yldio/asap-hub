import { type Entry, type Environment, type Link } from '@asap-hub/contentful';
import {
  cell,
  col,
  createEntryLink,
  findProjectByProjectId,
  getContentfulEnvironment,
  getErrorMessage,
  isArchivedResource,
  isEmptyRow,
  loc,
  NON_ARCHIVED_ENTRY_QUERY,
  readCsv,
  type LocalizedFields,
  validateRequiredColumns,
} from './import-utils';

/**
 * Imports teams into Contentful from a CSV with columns:
 * Team Name, Team Type, Team Description, Research Theme, Project ID
 *
 * Creates researchTheme entries and publishes them immediately if they don't exist.
 * Creates teams entries as DRAFT.
 * Creates projectMembership entries (DRAFT) linking each team to its project.
 * Updates draft project entries to include the new projectMembership in their members array.
 *
 * Usage (env vars loaded from .env file):
 *     yarn import:teams <csv-path>
 */

const RESEARCH_THEMES_TO_CREATE = ['Tool Generation', 'PD Heterogeneity'];

const REQUIRED_TEAM_COLUMNS = [
  'Team Name',
  'Team Type',
  'Team Description',
  'Research Theme',
  'Project ID',
];

const ensureResearchThemes = async (
  env: Environment,
): Promise<Map<string, string>> => {
  const themeMap = new Map<string, string>();
  const themeEntries = new Map<string, Entry>();

  const existing = await env.getEntries({
    ...NON_ARCHIVED_ENTRY_QUERY,
    content_type: 'researchTheme',
    limit: 50,
  });
  for (const entry of existing.items) {
    const name = entry.fields?.name?.['en-US'] as string;
    if (name) {
      themeMap.set(name, entry.sys.id);
      themeEntries.set(name, entry);
    }
  }

  for (const themeName of RESEARCH_THEMES_TO_CREATE) {
    const existingTheme = themeEntries.get(themeName);

    if (!existingTheme) {
      console.log(`Creating research theme: "${themeName}"`);
      const entry = await env.createEntry('researchTheme', {
        fields: { name: loc(themeName) },
      });

      const publishedEntry = await entry.publish();
      themeMap.set(themeName, publishedEntry.sys.id);
      themeEntries.set(themeName, publishedEntry);
      console.log(
        `  Created and published theme "${themeName}" (${publishedEntry.sys.id})`,
      );
    } else if (existingTheme.isDraft()) {
      const publishedEntry = await existingTheme.publish();

      themeMap.set(themeName, publishedEntry.sys.id);
      themeEntries.set(themeName, publishedEntry);
      console.log(
        `Published existing draft research theme "${themeName}" (${publishedEntry.sys.id})`,
      );
    } else {
      console.log(`Research theme "${themeName}" already exists`);
    }
  }

  return themeMap;
};

const linkTeamToProject = async (
  env: Environment,
  teamId: string,
  projectId: string,
): Promise<'linked' | 'already_linked' | 'project_not_found'> => {
  const project = await findProjectByProjectId(env, projectId);
  if (!project) {
    console.error(`  ERROR: Project "${projectId}" not found in Contentful`);
    return 'project_not_found';
  }

  // Check the target project's members for an existing membership to this team
  const projectEntry = await env.getEntry(project.id);
  const members = (projectEntry.fields?.members?.['en-US'] || []) as Array<
    Link<'Entry'>
  >;

  for (const memberLink of members) {
    try {
      const membership = await env.getEntry(memberLink.sys.id);
      if (isArchivedResource(membership.sys)) {
        continue;
      }
      const linkedId = membership.fields?.projectMember?.['en-US']?.sys?.id;
      if (linkedId === teamId) {
        console.log(`  Project link already complete, skipping`);
        return 'already_linked';
      }
    } catch {
      // Membership entry might not exist
    }
  }

  // Create new projectMembership (draft) for this specific project
  const membership = await env.createEntry('projectMembership', {
    fields: {
      projectMember: loc(createEntryLink(teamId)),
    },
  });

  // Add to project's members array
  projectEntry.fields = projectEntry.fields || {};
  projectEntry.fields.members = {
    'en-US': [...members, createEntryLink(membership.sys.id)],
  };
  await projectEntry.update();

  console.log(
    `  Linked to project ${projectId} via membership ${membership.sys.id}`,
  );
  return 'linked';
};

const app = async () => {
  const csvPath = process.argv[2];
  if (!csvPath) {
    throw new Error('Usage: yarn import:teams <csv-path>');
  }

  const env = await getContentfulEnvironment();
  const themeMap = await ensureResearchThemes(env);
  const { rows, headers } = await readCsv(csvPath);

  validateRequiredColumns(headers, REQUIRED_TEAM_COLUMNS);

  const columns = {
    teamName: col(headers, 'Team Name'),
    teamType: col(headers, 'Team Type'),
    teamDescription: col(headers, 'Team Description'),
    researchTheme: col(headers, 'Research Theme'),
    projectId: col(headers, 'Project ID'),
  };

  let created = 0;
  let skipped = 0;
  let failed = 0;
  let projectsLinked = 0;
  let projectsMissing = 0;

  console.log(`\nImporting ${rows.length} teams...\n`);

  for (const row of rows) {
    if (!isEmptyRow(row)) {
      const teamName = cell(row, columns.teamName);
      const teamType = cell(row, columns.teamType);
      const teamDescription = cell(row, columns.teamDescription);
      const researchTheme = cell(row, columns.researchTheme);
      const projectId = cell(row, columns.projectId);

      if (!teamName) {
        console.log('Skipping row with empty team name');
        skipped += 1;
      } else {
        try {
          // Dedup: check if team already exists
          const existing = await env.getEntries({
            ...NON_ARCHIVED_ENTRY_QUERY,
            content_type: 'teams',
            'fields.displayName': teamName,
            limit: 1,
          });

          let teamEntryId: string;
          const [existingTeam] = existing.items;

          if (existingTeam) {
            teamEntryId = existingTeam.sys.id;
            console.log(`Team exists: ${teamName} (${teamEntryId})`);
            skipped += 1;
          } else {
            const fields: LocalizedFields = {
              displayName: loc(teamName),
              teamType: loc(teamType),
            };

            if (teamDescription) {
              fields.teamDescription = loc(teamDescription);
            }

            const themeId = themeMap.get(researchTheme);
            if (themeId) {
              fields.researchTheme = loc(createEntryLink(themeId));
            } else if (researchTheme) {
              console.warn(
                `  Warning: Research theme "${researchTheme}" not found`,
              );
            }

            const entry = await env.createEntry('teams', { fields });
            teamEntryId = entry.sys.id;
            created += 1;
            console.log(
              `Created (draft): ${teamName} [${teamType}] (${teamEntryId})`,
            );
          }

          // Always attempt project link (even if team already existed)
          if (projectId) {
            const result = await linkTeamToProject(env, teamEntryId, projectId);
            if (result === 'linked') {
              projectsLinked += 1;
            } else if (result === 'project_not_found') {
              projectsMissing += 1;
            }
          }
        } catch (error: unknown) {
          failed += 1;
          console.error(`Failed: ${teamName} - ${getErrorMessage(error)}`);
        }
      }
    }
  }

  console.log(`\n--- Summary ---`);
  console.log(
    `Teams created: ${created}, Skipped: ${skipped}, Failed: ${failed}`,
  );
  console.log(
    `Projects linked: ${projectsLinked}, Projects missing: ${projectsMissing}`,
  );

  if (failed > 0 || projectsMissing > 0) {
    throw new Error(
      `Team import completed with ${failed} failed row(s) and ${projectsMissing} missing project link(s).`,
    );
  }
};

app().catch((err) => {
  console.error(err);
  process.exit(1);
});
