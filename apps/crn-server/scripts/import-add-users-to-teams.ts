import { type Environment, type Link } from '@asap-hub/contentful';
import {
  buildUserFields,
  cell,
  col,
  cleanupAsset,
  cleanupEntries,
  createTeamMembership,
  findTeamByName,
  findUserByEmail,
  findUserByOrcid,
  getContentfulEnvironment,
  getErrorMessage,
  isEmptyRow,
  loadTagCache,
  normalizeTagNames,
  parseImportArgs,
  parseUserRow,
  readCsv,
  resolveTagIds,
  runPrepareSteps,
  shouldSkipRow,
  type ContentfulEntryLookup,
  type ParsedUserData,
  UPDATE_USER_FIELDS_OPTIONS,
  uploadAvatar,
  userHasTeamMembership,
  validateRequiredColumns,
} from './import-utils';

/**
 * Adds existing users to new teams and updates their profile data.
 * All entries stay in draft / "changed" state (not published).
 *
 * Looks up users by ORCID (primary), then email.
 * Skips rows where Team Role = "UNKNOWN" or ASAP Hub Role is empty.
 *
 * Supports the same --prepare-* flags as import-new-users.ts.
 *
 * Usage (env vars loaded from .env file):
 *     yarn import:add-users-to-teams [flags] <csv-path>
 */

const REQUIRED_EXISTING_USER_COLUMNS = [
  'First name',
  'Preferred name',
  'Last name',
  'Email address',
  'ORCID',
  'Degree',
  'Location',
  'Position title',
  'Institution',
  'Please upload a profile photo.',
  'Website 1',
  'Website 2',
  'LinkedIn',
  'ResearcherID',
  'X',
  'Bluesky',
  'GitHub',
  'Google Scholar',
  'ResearchGate',
  'Responsibilities',
  'Research Interests',
  'Expertise and resources description',
  'Tags',
  'Open question 1',
  'Open question 2',
  'Open question 3',
  'Open question 4',
  'Biography',
  'ASAP Hub Role',
  'Team 1',
  'Team 1 Role',
  'Team 2',
  'Team 2 Role',
  'Team 3',
  'Team 3 Role',
];

const findExistingUser = async (
  env: Environment,
  data: ParsedUserData,
): Promise<ContentfulEntryLookup | null> => {
  if (data.orcid) {
    const found = await findUserByOrcid(env, data.orcid);
    if (found) {
      return found;
    }
  }

  if (data.email) {
    const found = await findUserByEmail(env, data.email);
    if (found) {
      return found;
    }
  }

  return null;
};

const app = async () => {
  const args = parseImportArgs();
  const { headers, rows } = await readCsv(args.csvPath);

  validateRequiredColumns(headers, REQUIRED_EXISTING_USER_COLUMNS);

  const columns = {
    firstName: col(headers, 'First name'),
    lastName: col(headers, 'Last name'),
    email: col(headers, 'Email address'),
  };

  console.log(`Read ${rows.length} rows from ${args.csvPath}`);

  const prepResult = await runPrepareSteps(args, rows, headers);
  if (prepResult.shouldExit) {
    return;
  }

  const env = prepResult.env || (await getContentfulEnvironment());
  await loadTagCache(env);

  let updated = 0;
  let skipped = 0;
  let skippedRole = 0;
  let notFound = 0;
  let failed = 0;
  const warnings: string[] = [];

  console.log(`\nUpdating existing users...\n`);

  for (const [index, row] of rows.entries()) {
    if (!isEmptyRow(row)) {
      const rowNum = index + 2;

      // Track entries created this row for cleanup on failure
      const createdMembershipIds: string[] = [];
      let createdAvatarId: string | null = null;

      try {
        const skipReason = shouldSkipRow(row, headers);
        if (skipReason) {
          const name = `${cell(row, columns.firstName)} ${cell(
            row,
            columns.lastName,
          )}`.trim();
          console.log(`Skipped row ${rowNum} (${skipReason}): ${name}`);
          skippedRole += 1;
        } else {
          const rawName = `${cell(row, columns.firstName)} ${cell(
            row,
            columns.lastName,
          )}`.trim();
          const rawEmail = cell(row, columns.email).toLowerCase();
          const rawLabel = `${rawName || 'Unnamed user'}${
            rawEmail ? ` (${rawEmail})` : ''
          }`;

          console.log(`Processing row ${rowNum}: ${rawLabel}`);

          const data = parseUserRow(row, headers);

          if (!data.firstName && !data.lastName) {
            skipped += 1;
          } else {
            const label = `${data.firstName} ${data.lastName}`;
            const user = await findExistingUser(env, data);

            if (!user) {
              notFound += 1;
              console.error(
                `  NOT FOUND row ${rowNum}: ${label} (ORCID: ${
                  data.orcid || 'none'
                }, email: ${data.email || 'none'})`,
              );
            } else {
              console.log(`  Matched existing user: ${label} (${user.id})`);

              const userEntry = await env.getEntry(user.id);
              const existingTeamLinks = (userEntry.fields?.teams?.['en-US'] ||
                []) as Array<Link<'Entry'>>;

              for (const team of data.teams) {
                const teamEntry = await findTeamByName(env, team.name);
                if (!teamEntry) {
                  warnings.push(`Row ${rowNum}: Team "${team.name}" not found`);
                  console.warn(
                    `  Warning: Team "${team.name}" not found, skipping`,
                  );
                } else {
                  const alreadyMember = await userHasTeamMembership(
                    env,
                    userEntry,
                    teamEntry.id,
                  );
                  if (alreadyMember) {
                    console.log(`  Already member of ${team.name}, skipping`);
                  } else {
                    const membershipId = await createTeamMembership(
                      env,
                      teamEntry.id,
                      team.role,
                    );
                    createdMembershipIds.push(membershipId);
                    console.log(
                      `  Created team membership: ${team.name} (${team.role})`,
                    );
                  }
                }
              }

              const normalizedTags = normalizeTagNames(data.tagNames);
              const tagIds = resolveTagIds(normalizedTags);

              if (data.avatarSource && data.avatarSource.startsWith('/')) {
                try {
                  createdAvatarId = await uploadAvatar(
                    env,
                    data.avatarSource,
                    label,
                  );
                  console.log(`  Uploaded avatar: ${createdAvatarId}`);
                } catch (error: unknown) {
                  const errorMessage = getErrorMessage(error);
                  warnings.push(
                    `Row ${rowNum}: Avatar upload failed - ${errorMessage}`,
                  );
                  console.warn(
                    `  Warning: Avatar upload failed - ${errorMessage}`,
                  );
                }
              }

              const updateFields = buildUserFields(
                data,
                createdMembershipIds,
                tagIds,
                createdAvatarId,
                UPDATE_USER_FIELDS_OPTIONS,
                existingTeamLinks,
              );

              for (const [key, value] of Object.entries(updateFields)) {
                userEntry.fields[key] = value;
              }

              await userEntry.update();
              updated += 1;
              console.log(`  Updated user (changed state): ${user.id}`);
            }
          }
        }
      } catch (error: unknown) {
        failed += 1;
        console.error(`Failed row ${rowNum}: ${getErrorMessage(error)}`);

        if (createdMembershipIds.length > 0) {
          await cleanupEntries(env, createdMembershipIds, 'teamMembership');
        }
        if (createdAvatarId) {
          await cleanupAsset(env, createdAvatarId);
        }
      }
    }
  }

  console.log(`\n--- Summary ---`);
  console.log(
    `Updated: ${updated}, Skipped (exists): ${skipped}, Skipped (role): ${skippedRole}, Not found: ${notFound}, Failed: ${failed}`,
  );
  if (warnings.length > 0) {
    console.log(`\nWarnings (${warnings.length}):`);
    for (const w of warnings) {
      console.log(`  - ${w}`);
    }
  }
};

app().catch((err) => {
  console.error(err);
  process.exit(1);
});
