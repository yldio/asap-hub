import { type Environment, type Link } from '@asap-hub/contentful';
import {
  cleanupAsset,
  cleanupEntries,
  createAssetLink,
  createEntryLink,
  createTeamMembership,
  findTeamByName,
  findUserByEmail,
  findUserByOrcid,
  getContentfulEnvironment,
  getErrorMessage,
  isEmptyRow,
  loadTagCache,
  loc,
  normalizeTagNames,
  parseImportArgs,
  parseUserRow,
  readCsv,
  resolveTagIds,
  runPrepareSteps,
  shouldSkipRow,
  type ContentfulEntryLookup,
  type LocalizedFields,
  type ParsedUserData,
  uploadAvatar,
  userHasTeamMembership,
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

/**
 * Builds the update payload for an existing user without overwriting populated
 * Contentful fields with empty CSV values.
 */
const buildUpdateFields = (
  data: ParsedUserData,
  newMembershipIds: string[],
  tagIds: string[],
  avatarId: string | null,
  existingTeamLinks: Array<Link<'Entry'>>,
): LocalizedFields => {
  const fields: LocalizedFields = {};

  fields.lastUpdated = loc(new Date().toISOString());

  // Identity fields (CSV is considered more current)
  if (data.firstName) {
    fields.firstName = loc(data.firstName);
  }
  if (data.lastName) {
    fields.lastName = loc(data.lastName);
  }
  if (data.nickname) {
    fields.nickname = loc(data.nickname);
  }
  if (data.role) {
    fields.role = loc(data.role);
  }

  // Profile fields
  if (data.orcid) {
    fields.orcid = loc(data.orcid);
  }
  if (data.degree) {
    fields.degree = loc(data.degree);
  }
  if (data.city) {
    fields.city = loc(data.city);
  }
  if (data.stateOrProvince) {
    fields.stateOrProvince = loc(data.stateOrProvince);
  }
  if (data.country) {
    fields.country = loc(data.country);
  }
  if (data.jobTitle) {
    fields.jobTitle = loc(data.jobTitle);
  }
  if (data.institution) {
    fields.institution = loc(data.institution);
  }

  // Social links
  if (data.website1) {
    fields.website1 = loc(data.website1);
  }
  if (data.website2) {
    fields.website2 = loc(data.website2);
  }
  if (data.linkedIn) {
    fields.linkedIn = loc(data.linkedIn);
  }
  if (data.researcherId) {
    fields.researcherId = loc(data.researcherId);
  }
  if (data.twitter) {
    fields.twitter = loc(data.twitter);
  }
  if (data.github) {
    fields.github = loc(data.github);
  }
  if (data.googleScholar) {
    fields.googleScholar = loc(data.googleScholar);
  }
  if (data.researchGate) {
    fields.researchGate = loc(data.researchGate);
  }
  if (data.blueSky) {
    fields.blueSky = loc(data.blueSky);
  }

  // Text fields
  if (data.responsibilities) {
    fields.responsibilities = loc(data.responsibilities);
  }
  if (data.researchInterests) {
    fields.researchInterests = loc(data.researchInterests);
  }
  if (data.expertiseAndResourceDescription) {
    fields.expertiseAndResourceDescription = loc(
      data.expertiseAndResourceDescription,
    );
  }
  if (data.biography) {
    fields.biography = loc(data.biography);
  }

  // Questions
  if (data.questions.length > 0) {
    fields.questions = loc(data.questions);
  }

  // Tags (replaces existing, CSV is authoritative)
  if (tagIds.length > 0) {
    fields.researchTags = loc(tagIds.map(createEntryLink));
  }

  // Avatar
  if (avatarId) {
    fields.avatar = loc(createAssetLink(avatarId));
  }

  // Teams: merge existing + new memberships
  const newLinks = newMembershipIds.map(createEntryLink);
  fields.teams = loc([...existingTeamLinks, ...newLinks]);

  return fields;
};

const app = async () => {
  const args = parseImportArgs();
  const { headers, rows } = await readCsv(args.csvPath);

  console.log(`Read ${rows.length} rows from ${args.csvPath}`);

  // Only connects to Contentful if --prepare-tags or full import
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

              const updateFields = buildUpdateFields(
                data,
                createdMembershipIds,
                tagIds,
                createdAvatarId,
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
