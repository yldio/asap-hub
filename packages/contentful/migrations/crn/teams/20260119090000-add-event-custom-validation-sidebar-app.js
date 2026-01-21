module.exports.description =
  'Placeholder (no-op): previously referenced migration file';

/**
 * This file exists to keep the migration history consistent.
 *
 * At some point the migration runner recorded this filename as part of the
 * applied/pending migrations list for CRN environments. If the file is missing,
 * `contentful-migrate` fails with "Missing migration file".
 *
 * Intentionally no-op: we are not attaching event-custom-validation to Teams.
 */
module.exports.up = () => {};

module.exports.down = () => {};

