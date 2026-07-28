import { type Entry, type Environment, type Link } from '@asap-hub/contentful';
import pThrottle from 'p-throttle';
import {
  cell,
  cleanOrcid,
  col,
  type ContentfulEntryLookup,
  createEntryLink,
  createTeamMembership,
  findLabByName,
  findTeamByName,
  findUserByEmail,
  findUserByOrcid,
  getContentfulEnvironment,
  getErrorMessage,
  isArchivedResource,
  isEmptyRow,
  loc,
  type LocalizedFields,
  mapTeamRole,
  readCsv,
  REQUIRED_TEAM_MEMBER_COLUMNS,
  validateRequiredColumns,
} from './import-utils';

/**
 * Imports users into Contentful from a team-members CSV with columns:
 * Team, Last Name, First Name, Position, Lab, Lab Role, Email, ORCID, Notes,
 * Date invited to Hub.
 *
 * This is Phase 2 of a three-phase pipeline (see import-labs.ts and
 * link-lab-pis.ts). Labs referenced by the `Lab` column must already exist
 * and be published (run import-labs.ts first) - an unresolved lab is logged
 * and skipped without failing the row.
 *
 * Each row is matched against Contentful first by ORCID, then by email if no
 * ORCID match is found (covers users created before ORCID was recorded). An
 * ORCID match is treated as authoritative even if the email on file differs -
 * the mismatch is only flagged with a warning (not written), so affected
 * users can be reviewed before deciding whether to update the CMS email. A
 * match found by email whose CMS ORCID differs from (or is missing from) the
 * sheet's is logged as a warning and the CMS ORCID is updated to match the
 * sheet - it is not treated as ambiguous or skipped.
 *
 * For a matched (existing) user, nothing else is overwritten or removed - the
 * script only adds/corrects what the sheet has that the CMS record is
 * missing or wrong:
 * - `Position` may contain multiple comma-separated roles (e.g. "Data
 *   Manager, Project Manager") for the same team; any role not already held
 *   on that team gets a new published teamMembership linked onto the user.
 * - The `Lab` column is linked if the user isn't linked to it already.
 * - The ORCID field is written whenever the user was matched by email and
 *   the sheet's ORCID differs from (including missing from) the CMS record.
 * If none of the above is needed, the row is skipped as already up to date.
 *
 * For a new person (no ORCID or email match), the `Team` must resolve to an
 * existing team or the row is skipped entirely and no user is created.
 * `Position` is split the same way, with one teamMembership created per
 * role. `Lab Role`, `Notes`, and `Date invited to Hub` are ignored - no
 * destination field exists for them.
 *
 * New users default to the "Grantee" ASAP Hub role. All entries (users and
 * teamMemberships) are created and published immediately.
 *
 * Usage (env vars loaded from .env file):
 *   yarn import:team-users <csv-path>
 */

const DEFAULT_ROLE = 'Grantee';

const parseRoles = (position: string): string[] => [
  ...new Set(
    position
      .split(',')
      .map((role) => role.trim())
      .filter(Boolean),
  ),
];

/** Returns the set of roles a user currently holds on the given team. */
const findExistingMembershipRoles = async (
  env: Environment,
  userEntry: Entry,
  targetTeamId: string,
): Promise<Set<string>> => {
  const teamsField = (userEntry.fields?.teams?.['en-US'] || []) as Array<
    Link<'Entry'>
  >;
  const existingRoles = new Set<string>();

  for (const link of teamsField) {
    try {
      const membership = await env.getEntry(link.sys.id);

      // if user's team membership is archived or is not a membership to the target team skip
      if (isArchivedResource(membership.sys)) {
        continue;
      }
      const membershipTeamId = membership.fields?.team?.['en-US']?.sys?.id as
        | string
        | undefined;

      if (membershipTeamId !== targetTeamId) {
        continue;
      }

      const role = membership.fields?.role?.['en-US'] as string | undefined;
      if (role) {
        existingRoles.add(role);
      }
    } catch {
      // Entry might not exist or be inaccessible
    }
  }

  return existingRoles;
};

type RowData = {
  firstName: string;
  lastName: string;
  team: string;
  position: string;
  lab: string;
  email: string;
  orcid: string;
  label: string;
};

const app = async () => {
  const csvPath = process.argv[2];
  if (!csvPath) {
    throw new Error('Usage: yarn import:team-users <csv-path>');
  }

  const env = await getContentfulEnvironment();
  const { rows, headers } = await readCsv(csvPath);

  validateRequiredColumns(headers, REQUIRED_TEAM_MEMBER_COLUMNS);

  const columns = {
    team: col(headers, 'Team'),
    lastName: col(headers, 'Last Name'),
    firstName: col(headers, 'First Name'),
    position: col(headers, 'Position'),
    lab: col(headers, 'Lab'),
    email: col(headers, 'Email'),
    orcid: col(headers, 'ORCID'),
  };

  let created = 0;
  let skippedExists = 0;
  let teamLinkSkippedNotFound = 0;
  let teamLinkSkippedInvalidRole = 0;
  let labLinkSkipped = 0;
  let membershipsAddedToExistingUsers = 0;
  let orcidBackfilled = 0;
  let orcidMismatchUpdated = 0;
  let labsBackfilled = 0;
  let emailMismatchFlagged = 0;
  let failed = 0;
  const warnings: string[] = [];

  /** Looks up a team by name; logs, warns and counts a miss instead of throwing. */
  const resolveTeam = async (
    teamName: string,
    notFoundMessage: string,
  ): Promise<{ id: string } | null> => {
    const teamEntry = await findTeamByName(env, teamName);
    if (teamEntry) {
      return teamEntry;
    }
    console.log(notFoundMessage);
    warnings.push(notFoundMessage);
    teamLinkSkippedNotFound += 1;
    return null;
  };

  /** Looks up a published lab by name; logs warning if not found */
  const resolveLab = async (
    labName: string,
    label: string,
  ): Promise<Entry | null> => {
    const labLookup = await findLabByName(env, labName);
    const labEntry = labLookup && (await env.getEntry(labLookup.id));
    if (labEntry && labEntry.isPublished()) {
      return labEntry;
    }
    const message = `Lab "${labName}" not found (published) - skipping lab link for ${label}. Did import-labs run first?`;
    console.log(message);
    warnings.push(message);
    labLinkSkipped += 1;
    return null;
  };

  /** Creates one published teamMembership per role, logging each. */
  const createMemberships = async (
    teamId: string,
    roles: string[],
    context: string,
  ): Promise<string[]> => {
    const ids: string[] = [];
    for (const role of roles) {
      const membershipId = await createTeamMembership(env, teamId, role, true);
      ids.push(membershipId);
      console.log(
        `  Created and published team membership${context}: ${membershipId} (${role})`,
      );
    }
    return ids;
  };

  /**
   * A person already in Contentful (matched by ORCID or by email when the
   * ORCID in csv is not present in CMS). Adds any team membership, lab link, or ORCID
   * value the sheet has that the CMS record is missing.
   */
  const updateExistingUser = async (
    foundUser: ContentfulEntryLookup,
    foundByOrcid: boolean,
    { team, position, lab, orcid, email, label }: RowData,
  ): Promise<void> => {
    const existingUserEmail = (
      (foundUser.entry.fields?.email?.['en-US'] as string | undefined) || ''
    ).toLowerCase();
    const existingUserOrcid =
      (foundUser.entry.fields?.orcid?.['en-US'] as string | undefined) || '';

    const orcidMismatch =
      !foundByOrcid &&
      Boolean(existingUserOrcid) &&
      existingUserOrcid !== orcid;

    if (orcidMismatch) {
      const message = `ORCID MISMATCH: "${label}" matched by email (${email}), but CMS has a different ORCID (CMS: ${existingUserOrcid}, CSV: ${orcid}) - updating ORCID in CMS to match sheet.`;
      console.log(message);
      warnings.push(message);
    }

    const emailMatches = existingUserEmail === email;

    // an orcid update is needed if the user was found by email and the sheet's orcid differs from (or is missing from) the CMS record
    const needsOrcidUpdate = !foundByOrcid && orcid !== existingUserOrcid;

    if (needsOrcidUpdate && !existingUserOrcid) {
      console.log(
        `Note: existing user ${label} (${foundUser.id}) matched by email; CMS record has no ORCID recorded (CSV: ${orcid}) - backfilling.`,
      );
    }

    const emailMismatch = foundByOrcid && !emailMatches;

    // if the user is found by orcid but the email doesn't match what we have in the cms for now we flag for manual review but continue to update labs / team membership if any.
    if (emailMismatch) {
      const message = `EMAIL MISMATCH: existing user ${label} (${foundUser.id}) matched by ORCID (${orcid}), but email differs (CMS: ${existingUserEmail}, CSV: ${email}) - email not updated, please review.`;
      console.log(message);
      warnings.push(message);
      emailMismatchFlagged += 1;
    }

    const teamEntry = await resolveTeam(
      team,
      `Existing user ${label} (${foundUser.id}): team "${team}" not found - cannot check/create membership.`,
    );
    if (!teamEntry) {
      return;
    }

    const existingRoles = await findExistingMembershipRoles(
      env,
      foundUser.entry,
      teamEntry.id,
    );
    const missingRoles = parseRoles(position).filter(
      (role) => !existingRoles.has(mapTeamRole(role)),
    );

    let labBackfillId: string | undefined;

    if (lab) {
      const labEntry = await resolveLab(lab, label);
      if (labEntry) {
        // a user might exist but not be linked to the lab indicated in sheet. Check if user is already linked to lab and link if not
        const existingLabLinks = (foundUser.entry.fields?.labs?.['en-US'] ||
          []) as Array<Link<'Entry'>>;
        const alreadyLinked = existingLabLinks.some(
          (link) => link.sys.id === labEntry.sys.id,
        );
        if (!alreadyLinked) {
          labBackfillId = labEntry.sys.id;
        }
      }
    }

    // if the mentioned roles are already present and no backfilling on orcid/labs is needed then the user is up to date and needs no update
    if (missingRoles.length === 0 && !needsOrcidUpdate && !labBackfillId) {
      console.log(
        `Skipped (exact match, membership up to date): ${label} (${foundUser.id})`,
      );
      skippedExists += 1;
      return;
    }

    try {
      const newMembershipIds = await createMemberships(
        teamEntry.id,
        missingRoles,
        ` for existing user ${label}`,
      );

      foundUser.entry.fields = foundUser.entry.fields || {};

      if (newMembershipIds.length > 0) {
        const existingTeamLinks = (foundUser.entry.fields.teams?.['en-US'] ||
          []) as Array<Link<'Entry'>>;
        foundUser.entry.fields.teams = loc([
          ...existingTeamLinks,
          ...newMembershipIds.map(createEntryLink),
        ]);
        membershipsAddedToExistingUsers += newMembershipIds.length;
        console.log(
          `Linked ${newMembershipIds.length} new membership(s) to existing user ${label} (${foundUser.id}).`,
        );
      }

      if (needsOrcidUpdate) {
        foundUser.entry.fields.orcid = loc(orcid);
        if (existingUserOrcid) {
          orcidMismatchUpdated += 1;
          console.log(
            `Updated ORCID for existing user ${label} (${foundUser.id}): ${existingUserOrcid} -> ${orcid}`,
          );
        } else {
          orcidBackfilled += 1;
          console.log(
            `Backfilled ORCID for existing user ${label} (${foundUser.id}): ${orcid}`,
          );
        }
      }

      if (labBackfillId) {
        const existingLabLinks = (foundUser.entry.fields.labs?.['en-US'] ||
          []) as Array<Link<'Entry'>>;
        foundUser.entry.fields.labs = loc([
          ...existingLabLinks,
          createEntryLink(labBackfillId),
        ]);
        labsBackfilled += 1;
        console.log(
          `Backfilled lab for existing user ${label} (${foundUser.id}): "${lab}"`,
        );
      }

      const updatedUser = await foundUser.entry.update();
      await updatedUser.publish();
    } catch (error: unknown) {
      failed += 1;
      console.error(
        `Failed updating existing user ${label} (${
          foundUser.id
        }): ${getErrorMessage(error)}`,
      );
    }
  };

  /** A user not yet in Contentful. Only created if their team resolves. */
  const createNewUser = async (
    { firstName, lastName, team, position, lab, orcid, email, label }: RowData,
    rowNum: number,
  ): Promise<void> => {
    const teamEntry = await resolveTeam(
      team,
      `Team "${team}" not found - skipping ${label} entirely. User will not be created.`,
    );
    if (!teamEntry) {
      return;
    }

    const roles = parseRoles(position);
    if (roles.length === 0) {
      const message = `Role "${position}" is not a valid teamMembership role - skipping team link for ${label}.`;
      console.log(message);
      warnings.push(message);
      teamLinkSkippedInvalidRole += 1;
    }

    const createdMembershipIds = await createMemberships(
      teamEntry.id,
      roles,
      '',
    );

    const labLinkIds: string[] = [];
    if (lab) {
      const labEntry = await resolveLab(lab, label);
      if (labEntry) {
        labLinkIds.push(labEntry.sys.id);
      }
    }

    try {
      const fields: LocalizedFields = {
        firstName: loc(firstName),
        lastName: loc(lastName),
        orcid: loc(orcid),
        role: loc(DEFAULT_ROLE),
        lastUpdated: loc(new Date().toISOString()),
        email: loc(email),
      };

      if (createdMembershipIds.length > 0) {
        fields.teams = loc(createdMembershipIds.map(createEntryLink));
      }
      if (labLinkIds.length > 0) {
        fields.labs = loc(labLinkIds.map(createEntryLink));
      }

      const entry = await env.createEntry('users', { fields });
      const published = await entry.publish();
      created += 1;
      console.log(`Created and published user: ${label} (${published.sys.id})`);
    } catch (error: unknown) {
      failed += 1;
      console.error(
        `Failed row ${rowNum} (${label}): ${getErrorMessage(error)}`,
      );

      if (createdMembershipIds.length > 0) {
        for (const id of createdMembershipIds) {
          console.warn(
            `  Orphaned published teamMembership left in place: ${id}`,
          );
        }
      }
    }
  };

  const processRow = async (row: string[], rowNum: number) => {
    const firstName = cell(row, columns.firstName);
    const lastName = cell(row, columns.lastName);
    const team = cell(row, columns.team);
    const position = cell(row, columns.position);
    const lab = cell(row, columns.lab);
    const email = cell(row, columns.email).toLowerCase();
    const orcid = cleanOrcid(cell(row, columns.orcid));
    const label = `${firstName} ${lastName}`.trim();
    const rowData: RowData = {
      firstName,
      lastName,
      team,
      position,
      lab,
      email,
      orcid,
      label,
    };

    const byOrcid = await findUserByOrcid(env, orcid);
    const foundUser = byOrcid || (await findUserByEmail(env, email));

    if (foundUser) {
      await updateExistingUser(foundUser, Boolean(byOrcid), rowData);
      return;
    }

    await createNewUser(rowData, rowNum);
  };

  const throttle = pThrottle({ limit: 2, interval: 1000 });
  const throttledProcessRow = throttle(processRow);

  console.log(`\nImporting ${rows.length} team members...\n`);

  for (const [index, row] of rows.entries()) {
    if (!isEmptyRow(row)) {
      await throttledProcessRow(row, index + 2);
    }
  }

  console.log(`\n--- Summary ---`);
  console.log(
    `Created: ${created}, Skipped (exact match): ${skippedExists}, Failed: ${failed}`,
  );
  console.log(
    `Team links skipped (not found): ${teamLinkSkippedNotFound}, Team links skipped (invalid role): ${teamLinkSkippedInvalidRole}, Lab links skipped: ${labLinkSkipped}, Memberships added to existing users: ${membershipsAddedToExistingUsers}, ORCID backfilled: ${orcidBackfilled}, ORCID updated (mismatch corrected): ${orcidMismatchUpdated}, Labs backfilled: ${labsBackfilled}, Email mismatches flagged (ORCID match, not updated): ${emailMismatchFlagged}`,
  );
  if (warnings.length > 0) {
    console.log(`\nWarnings (${warnings.length}):`);
    for (const w of warnings) {
      console.log(`  - ${w}`);
    }
  }
};

if (require.main === module) {
  app().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
