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
  findLabByName,
  getErrorMessage,
  loc,
  REQUIRED_LAB_COLUMNS,
} from './import-utils';

/**
 * This is Phase 1 of a three-phase pipeline (see import-team-users.ts and
 * link-lab-pis.ts) that resolves the circular Lab <-> User reference: labs are
 * created here WITHOUT their PI link, since the PI user may not exist yet.
 * PI columns are read by link-lab-pis.ts, not this script.
 *
 * The "Lab On Hub?" column can sometimes be wrong, i.e it says no but the lab exists in cms or yes but it doesn't, so it's
 * treated as a signal to log for manual reconciliation, not a create/skip gate - every lab
 * named in the CSV ends up created or confirmed already published either way.
 *
 * Entries are created and published immediately (no draft review step).
 *
 * Usage (env vars loaded from .env file):
 *   yarn import:labs <csv-path>
 */

const app = async () => {
  const csvPath = process.argv[2];
  if (!csvPath) {
    throw new Error('Usage: yarn import:labs <csv-path>');
  }

  const env = await getContentfulEnvironment();
  const { rows, headers } = await readCsv(csvPath);

  validateRequiredColumns(headers, REQUIRED_LAB_COLUMNS);

  const columns = {
    labName: col(headers, 'Lab Name'),
    onHub: col(headers, 'Lab On Hub?'),
  };

  let created = 0;
  let skippedCorrect = 0;
  let publishedExistingDraft = 0;
  let failed = 0;
  const mismatches: string[] = [];

  const processRow = async (row: string[], rowNum: number) => {
    const labName = cell(row, columns.labName);
    const sheetSaysOnHub = cell(row, columns.onHub).toLowerCase() === 'yes';

    try {
      const existing = await findLabByName(env, labName);

      if (!existing) {
        if (sheetSaysOnHub) {
          const message = `Reconciliation: "${labName}" marked On Hub but not found in Contentful - creating.`;
          console.log(message);
          mismatches.push(message);
        } else {
          console.log(
            `Creating "${labName}" (sheet correctly said not on Hub).`,
          );
        }

        const entry = await env.createEntry('labs', {
          fields: { name: loc(labName) },
        });
        const published = await entry.publish();
        created += 1;
        console.log(`  Created and published lab: ${published.sys.id}`);
        return;
      }

      const existingEntry = await env.getEntry(existing.id);

      if (existingEntry.isPublished()) {
        if (sheetSaysOnHub) {
          console.log(
            `Skipped (already on Hub, correctly flagged): "${labName}" (${existing.id})`,
          );
          skippedCorrect += 1;
        } else {
          const message = `Reconciliation: sheet says "${labName}" is NOT on Hub but a published entry already exists (${existing.id}) - skipping creation, no changes made.`;
          console.log(message);
          mismatches.push(message);
        }
        return;
      }

      console.log(
        `"${labName}" exists only as a draft (${existing.id}) - publishing existing draft rather than creating a duplicate.`,
      );
      if (!sheetSaysOnHub) {
        mismatches.push(
          `Reconciliation: sheet says "${labName}" is NOT on Hub, but a draft entry (${existing.id}) already existed - publishing it now.`,
        );
      }
      await existingEntry.publish();
      publishedExistingDraft += 1;
    } catch (error: unknown) {
      failed += 1;
      console.error(
        `Failed row ${rowNum} ("${labName}"): ${getErrorMessage(error)}`,
      );
    }
  };

  const throttle = pThrottle({ limit: 2, interval: 1000 });
  const throttledProcessRow = throttle(processRow);

  console.log(`\nImporting ${rows.length} labs...\n`);

  for (const [index, row] of rows.entries()) {
    if (!isEmptyRow(row)) {
      await throttledProcessRow(row, index + 2);
    }
  }

  console.log(`\n--- Summary ---`);
  console.log(
    `Created: ${created}, Published existing draft: ${publishedExistingDraft}, Skipped (already correct): ${skippedCorrect}, Failed: ${failed}`,
  );
  if (mismatches.length > 0) {
    console.log(`\nReconciliation mismatches (${mismatches.length}):`);
    for (const m of mismatches) {
      console.log(`  - ${m}`);
    }
  }
};

if (require.main === module) {
  app().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
