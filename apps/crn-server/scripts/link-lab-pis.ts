import { type Link } from '@asap-hub/contentful';
import {
  cell,
  col,
  getContentfulEnvironment,
  isEmptyRow,
  readCsv,
  validateRequiredColumns,
} from '@asap-hub/server-common';
import pThrottle from 'p-throttle';
import {
  createEntryLink,
  findLabByName,
  findUsersByName,
  getErrorMessage,
  isArchivedResource,
  loc,
  REQUIRED_LAB_COLUMNS,
} from './import-utils';

/**
 * Re-reads the Labs CSV (same file as import-labs.ts) and sets each lab's
 * `labPI` link, using the `PI First Name` / `PI Last Name` / `PI Team`
 * columns.
 *
 * This is Phase 3 of a three-phase pipeline (see import-labs.ts and
 * import-lab-team-users.ts). It must run after both: labs need to already
 * exist and be published (Phase 1), and PI users need to already exist
 * (Phase 2) before they can be linked as a lab's PI.
 *
 * A PI name that matches more than one user is resolved using `PI Team`
 * against each candidate's team memberships; if that still doesn't resolve to
 * exactly one user, the lab is logged and skipped.
 *
 * Labs are updated and re-published immediately. Safe to re-run: a lab whose
 * `labPI` is already correct is left untouched.
 *
 * Usage (env vars loaded from .env file):
 *   yarn import:link-lab-pis <csv-path>
 */

const app = async () => {
  const csvPath = process.argv[2];
  if (!csvPath) {
    throw new Error('Usage: yarn import:link-lab-pis <csv-path>');
  }

  const env = await getContentfulEnvironment();
  const { rows, headers } = await readCsv(csvPath);

  validateRequiredColumns(headers, REQUIRED_LAB_COLUMNS);

  const columns = {
    labName: col(headers, 'Lab Name'),
    piFirstName: col(headers, 'PI First Name'),
    piLastName: col(headers, 'PI Last Name'),
    piTeam: col(headers, 'PI Team'),
  };

  let linked = 0;
  let alreadyCorrect = 0;
  let labNotFound = 0;
  let piNotFound = 0;
  let piAmbiguous = 0;
  let skippedEmpty = 0;
  let failed = 0;
  const warnings: string[] = [];

  const findCandidateTeamMatch = async (
    teamLinks: Array<Link<'Entry'>>,
    piTeam: string,
  ): Promise<boolean> => {
    for (const teamLink of teamLinks) {
      try {
        const membership = await env.getEntry(teamLink.sys.id);
        if (isArchivedResource(membership.sys)) {
          continue;
        }
        const teamLinkField = membership.fields?.team?.['en-US'] as
          | Link<'Entry'>
          | undefined;
        if (!teamLinkField) {
          continue;
        }
        const teamEntry = await env.getEntry(teamLinkField.sys.id);
        const displayName = teamEntry.fields?.displayName?.['en-US'] as
          | string
          | undefined;
        if (displayName === piTeam) {
          return true;
        }
      } catch {
        // Membership or team entry might not exist or be inaccessible.
      }
    }
    return false;
  };

  const processRow = async (row: string[], rowNum: number) => {
    const labName = cell(row, columns.labName);
    const piFirstName = cell(row, columns.piFirstName);
    const piLastName = cell(row, columns.piLastName);
    const piTeam = cell(row, columns.piTeam);

    try {
      const lab = await findLabByName(env, labName);
      if (!lab) {
        const message = `Lab "${labName}" not found - was import-labs run? Skipping PI link.`;
        console.log(message);
        warnings.push(message);
        labNotFound += 1;
        return;
      }

      const labEntry = await env.getEntry(lab.id);
      const candidates = await findUsersByName(env, piFirstName, piLastName);

      if (candidates.length === 0) {
        const message = `PI "${piFirstName} ${piLastName}" for lab "${labName}" not found - was import-lab-team-users run, and does this PI have an ORCID? Skipping.`;
        console.log(message);
        warnings.push(message);
        piNotFound += 1;
        return;
      }

      let piUserId: string | undefined;

      if (candidates.length === 1) {
        piUserId = candidates[0]?.id;
      } else {
        const matches: string[] = [];
        for (const candidate of candidates) {
          const teamLinks = (candidate.entry.fields?.teams?.['en-US'] ||
            []) as Array<Link<'Entry'>>;
          const belongsToTeam = await findCandidateTeamMatch(teamLinks, piTeam);
          if (belongsToTeam) {
            matches.push(candidate.id);
          }
        }

        if (matches.length === 1) {
          piUserId = matches[0];
        } else {
          const message = `AMBIGUOUS PI: "${piFirstName} ${piLastName}" for lab "${labName}" (PI Team: "${piTeam}") - ${candidates.length} name-matches found, ${matches.length} matched by team. Skipping labPI for this lab.`;
          console.log(message);
          warnings.push(message);
          piAmbiguous += 1;
          return;
        }
      }

      if (!piUserId) {
        const message = `PI "${piFirstName} ${piLastName}" for lab "${labName}" could not be resolved to a single user. Skipping.`;
        console.log(message);
        warnings.push(message);
        piNotFound += 1;
        return;
      }

      const currentLabPI = labEntry.fields?.labPI?.['en-US']?.sys?.id as
        | string
        | undefined;
      if (currentLabPI === piUserId) {
        console.log(`labPI already set correctly for "${labName}", skipping`);
        alreadyCorrect += 1;
        return;
      }

      labEntry.fields = labEntry.fields || {};
      labEntry.fields.labPI = loc(createEntryLink(piUserId));
      const updated = await labEntry.update();
      await updated.publish();
      linked += 1;
      console.log(`Linked labPI for "${labName}" -> ${piUserId}`);
    } catch (error: unknown) {
      failed += 1;
      console.error(
        `Failed row ${rowNum} ("${labName}"): ${getErrorMessage(error)}`,
      );
    }
  };

  const throttle = pThrottle({ limit: 2, interval: 1000 });
  const throttledProcessRow = throttle(processRow);

  console.log(`\nLinking lab PIs for ${rows.length} labs...\n`);

  for (const [index, row] of rows.entries()) {
    if (!isEmptyRow(row)) {
      await throttledProcessRow(row, index + 2);
    }
  }

  console.log(`\n--- Summary ---`);
  console.log(
    `Linked: ${linked}, Already correct: ${alreadyCorrect}, Lab not found: ${labNotFound}, PI not found: ${piNotFound}, PI ambiguous: ${piAmbiguous}, Skipped (empty): ${skippedEmpty}, Failed: ${failed}`,
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
