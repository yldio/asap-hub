/* eslint-disable no-continue */
import { Entry } from '@asap-hub/contentful';
import {
  cell,
  col,
  findUserByEmailCaseInsensitive,
  getContentfulEnvironment,
  isEmptyRow,
  readCsv,
  validateRequiredColumns,
} from '@asap-hub/server-common';
import fs from 'fs';

const REQUIRED_ALUMNI_COLUMNS = [
  'First Name',
  'Last Name',
  'Full Name',
  'Email',
  'Alumni Since',
  'Alumni New Location',
];

type AlumniImport = {
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  alumniSinceDate: string;
  alumniLocation: string;
  entry?: Entry;
};

// Parses a `DD.MM.YYYY` alumni date
const parseAlumniDate = (value: string): string => {
  const match = value.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (!match) {
    throw new Error(
      `Unexpected "Alumni Since" format: "${value}" (expected DD.MM.YYYY)`,
    );
  }

  const [, dayStr, monthStr, yearStr] = match;
  const day = Number(dayStr);
  const month = Number(monthStr);
  const year = Number(yearStr);

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    throw new Error(`Invalid "Alumni Since" date: "${value}"`);
  }

  return new Date(Date.UTC(year, month - 1, day)).toISOString();
};

/**
 * Import flow:
 *
 * 1. Read the alumni CSV file.
 * 2. Build an in-memory alumni model, keyed by email, parsing the alumni date.
 * 3. Resolve each row against an existing Contentful `users` entry by email.
 * 4. For each resolved user, set `alumniSinceDate` and `alumniLocation` and
 *    update + publish the entry.
 *
 * Notes:
 * - Users must already exist in Contentful; unmatched rows are reported and skipped.
 * - `alumniLastUpdated` is stamped automatically by the field-as-updated-at app
 *   when `alumniSinceDate` / `alumniLocation` change, so it is not set here.
 */
const app = async () => {
  const csvPath = process.argv[2];
  if (!csvPath) {
    throw new Error('Usage: yarn import:alumni <alumni-csv-path>');
  }
  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV file not found: ${csvPath}`);
  }

  const env = await getContentfulEnvironment();
  const { rows, headers } = await readCsv(csvPath);

  validateRequiredColumns(headers, REQUIRED_ALUMNI_COLUMNS);

  const columns = {
    firstName: col(headers, 'First Name'),
    lastName: col(headers, 'Last Name'),
    fullName: col(headers, 'Full Name'),
    email: col(headers, 'Email'),
    alumniSince: col(headers, 'Alumni Since'),
    alumniLocation: col(headers, 'Alumni New Location'),
  };

  console.log(`\n--- Building in-memory model ---`);

  const alumniByEmail: Record<string, AlumniImport> = {};

  for (const row of rows) {
    if (!isEmptyRow(row)) {
      const email = cell(row, columns.email).toLowerCase();

      if (!email) {
        console.warn(
          `  Skipping row with missing email: ${cell(row, columns.fullName)}`,
        );
        continue;
      }

      alumniByEmail[email] = {
        email,
        firstName: cell(row, columns.firstName),
        lastName: cell(row, columns.lastName),
        fullName: cell(row, columns.fullName),
        alumniSinceDate: parseAlumniDate(cell(row, columns.alumniSince)),
        alumniLocation: cell(row, columns.alumniLocation),
      };
    }
  }

  const alumni = Object.values(alumniByEmail);
  console.log(`Loaded ${alumni.length} alumni from CSV`);

  console.log('\n--- Resolving Contentful users ---');

  const unresolved: AlumniImport[] = [];
  for (const person of alumni) {
    const user = await findUserByEmailCaseInsensitive(env, person.email);

    if (!user) {
      console.warn(
        `  Could not find user with email ${person.email} (${person.fullName})`,
      );
      unresolved.push(person);
      continue;
    }

    person.entry = user.entry;
  }

  // Import data
  let updated = 0;
  const failed: { person: AlumniImport; error: unknown }[] = [];
  for (const person of alumni) {
    const { entry } = person;
    if (!entry) {
      continue;
    }

    console.log(
      `\n=== Marking ${person.fullName} (${person.email}) as alumni ===`,
    );

    entry.fields.alumniSinceDate = { 'en-US': person.alumniSinceDate };

    if (person.alumniLocation) {
      entry.fields.alumniLocation = { 'en-US': person.alumniLocation };
    }

    try {
      const updatedEntry = await entry.update();
      await updatedEntry.publish();

      updated += 1;
      console.log(`✓ Completed ${person.email}`);
    } catch (error) {
      failed.push({ person, error });
      console.error(`✗ Failed ${person.email}:`, error);
    }
  }

  console.log('\n--- Import complete ---');
  console.log(
    `Updated ${updated} users, ${unresolved.length} unresolved (${
      unresolved.map((p) => p.email).join(', ') || 'none'
    })`,
  );

  if (failed.length > 0) {
    console.log(`\n--- ${failed.length} failed to update/publish ---`);
    for (const { person, error } of failed) {
      console.error(
        `  ${person.email} (${person.fullName}): ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }
};

app().catch((err) => {
  console.error(err);
  process.exit(1);
});
