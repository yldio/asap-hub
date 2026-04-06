import {
  buildUserFields,
  cleanupAsset,
  cleanupEntries,
  createTeamMembership,
  loadTagCache,
  findTeamByName,
  findUserByEmail,
  getContentfulEnvironment,
  getErrorMessage,
  isEmptyRow,
  loc,
  normalizeTagNames,
  parseImportArgs,
  parseUserRow,
  readCsv,
  resolveTagIds,
  runPrepareSteps,
  shouldSkipRow,
  uploadAvatar,
} from './import-utils';

/**
 * Imports new users into Contentful from a CSV file.
 * All entries are created as DRAFT (not published).
 *
 * Skips rows where Team Role = "UNKNOWN" or ASAP Hub Role is empty.
 * Aborts a row if any referenced team is missing.
 * On failure, cleans up any entries/assets created for that row.
 *
 * Supports preprocessing flags:
 *   --prepare-avatars    Download Google Drive images to /tmp/asap-import/
 *   --prepare-locations  Parse locations via OpenAI into city|country or city|state|country
 *   --prepare-tags       Normalize tags and create approved missing ones, publishing them immediately
 *
 * Running without flags executes all preprocessing inline then imports.
 *
 * Usage (env vars loaded from .env file):
 *   yarn import:new-users [flags] <csv-path>
 */

const app = async () => {
  const args = parseImportArgs();
  const { headers, rows } = await readCsv(args.csvPath);

  console.log(`Read ${rows.length} rows from ${args.csvPath}`);

  const prepResult = await runPrepareSteps(args, rows, headers);
  if (prepResult.shouldExit) {
    return;
  }

  const env = prepResult.env || (await getContentfulEnvironment());
  await loadTagCache(env);

  let imported = 0;
  let skipped = 0;
  let skippedRole = 0;
  let failed = 0;
  const warnings: string[] = [];

  console.log(`\nImporting new users...\n`);

  for (const [index, row] of rows.entries()) {
    if (!isEmptyRow(row)) {
      const rowNum = index + 2;

      // Track created entries for cleanup on failure
      const createdMembershipIds: string[] = [];
      let createdAvatarId: string | null = null;
      let createdUserId: string | null = null;

      try {
        const skipReason = shouldSkipRow(row, headers);
        if (skipReason) {
          const name = `${(row[headers.indexOf('First name')] || '').trim()} ${(
            row[headers.indexOf('Last name')] || ''
          ).trim()}`.trim();
          console.log(`Skipped row ${rowNum} (${skipReason}): ${name}`);
          skippedRole += 1;
        } else {
          const rawName = `${(
            row[headers.indexOf('First name')] || ''
          ).trim()} ${(row[headers.indexOf('Last name')] || '').trim()}`.trim();
          const rawEmail = (row[headers.indexOf('Email address')] || '')
            .trim()
            .toLowerCase();
          const rawLabel = `${rawName || 'Unnamed user'}${
            rawEmail ? ` (${rawEmail})` : ''
          }`;

          console.log(`Processing row ${rowNum}: ${rawLabel}`);

          const data = parseUserRow(row, headers);

          if (!data.firstName && !data.lastName) {
            skipped += 1;
          } else {
            const label = `${data.firstName} ${data.lastName} (${
              data.email || 'no email'
            })`;
            let existingUser = null;

            if (data.email) {
              existingUser = await findUserByEmail(env, data.email);
            }

            if (existingUser) {
              console.log(`  Skipped (exists): ${label}`);
              skipped += 1;
            } else {
              const resolvedTeams: Array<{ teamId: string; role: string }> = [];
              for (const team of data.teams) {
                const teamEntry = await findTeamByName(env, team.name);
                if (!teamEntry) {
                  throw new Error(
                    `Team "${team.name}" not found. Aborting row to avoid partial import.`,
                  );
                }
                resolvedTeams.push({ teamId: teamEntry.id, role: team.role });
              }

              const normalizedTags = normalizeTagNames(data.tagNames);
              const tagIds = resolveTagIds(normalizedTags);

              if (data.avatarSource && data.avatarSource.startsWith('/')) {
                try {
                  createdAvatarId = await uploadAvatar(
                    env,
                    data.avatarSource,
                    `${data.firstName} ${data.lastName}`,
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

              for (const team of resolvedTeams) {
                const membershipId = await createTeamMembership(
                  env,
                  team.teamId,
                  team.role,
                );
                createdMembershipIds.push(membershipId);
                console.log(`  Created team membership: ${membershipId}`);
              }

              const fields = buildUserFields(
                data,
                createdMembershipIds,
                tagIds,
                createdAvatarId,
              );
              fields.onboarded = loc(true);

              const userEntry = await env.createEntry('users', { fields });
              createdUserId = userEntry.sys.id;
              imported += 1;
              console.log(`  Created user (draft): ${createdUserId}`);
            }
          }
        }
      } catch (error: unknown) {
        failed += 1;
        console.error(`Failed row ${rowNum}: ${getErrorMessage(error)}`);

        if (createdUserId) {
          await cleanupEntries(env, [createdUserId], 'user');
        }
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
    `Imported: ${imported}, Skipped (exists): ${skipped}, Skipped (role): ${skippedRole}, Failed: ${failed}`,
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
