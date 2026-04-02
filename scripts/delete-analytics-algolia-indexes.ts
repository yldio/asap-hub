/**
 * Script to delete a CRN analytics Algolia index and its replicas.
 *
 * Can be run via CLI args or environment variables (for GitHub Actions).
 *
 * CLI usage:
 *   npx ts-node scripts/delete-analytics-algolia-indexes.ts \
 *     --app-id <ALGOLIA_APP_ID> \
 *     --api-key <ALGOLIA_ADMIN_API_KEY> \
 *     --index-name <crn-analytics_dev|crn-analytics_prod|crn-analytics_CI-123> \
 *     [--dry-run]
 *
 * Environment variable usage (GitHub Actions):
 *   ALGOLIA_APP_ID=... ALGOLIA_API_KEY=... INDEX_NAME=crn-analytics_dev npx ts-node scripts/delete-analytics-algolia-indexes.ts
 *
 * Part of ASAP-1451: Migrate CRN Analytics from Algolia to OpenSearch.
 */

import algoliasearch from 'algoliasearch';

const parseArgs = () => {
  const args = process.argv.slice(2);
  let appId = process.env.ALGOLIA_APP_ID || '';
  let apiKey = process.env.ALGOLIA_API_KEY || '';
  let indexName = process.env.INDEX_NAME || '';
  let dryRun = process.env.DRY_RUN === 'true';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--app-id' && args[i + 1]) {
      appId = args[++i]!;
    } else if (args[i] === '--api-key' && args[i + 1]) {
      apiKey = args[++i]!;
    } else if (args[i] === '--index-name' && args[i + 1]) {
      indexName = args[++i]!;
    } else if (args[i] === '--dry-run') {
      dryRun = true;
    }
  }

  if (!appId || !apiKey || !indexName) {
    console.error(
      'Usage: ts-node scripts/delete-analytics-algolia-indexes.ts --app-id <ID> --api-key <KEY> --index-name <NAME> [--dry-run]',
    );
    console.error('Or set ALGOLIA_APP_ID, ALGOLIA_API_KEY, and INDEX_NAME env vars.');
    process.exit(1);
  }

  if (!indexName.startsWith('crn-analytics_')) {
    console.error(
      `Invalid index name "${indexName}". Must start with "crn-analytics_" (e.g. crn-analytics_dev, crn-analytics_prod, crn-analytics_CI-1234).`,
    );
    process.exit(1);
  }

  return { appId, apiKey, indexName, dryRun };
};

const isRelatedIndex = (name: string, indexName: string): boolean =>
  name === indexName || name.startsWith(`${indexName}_`) || name.startsWith(`${indexName}-`);

const main = async () => {
  const { appId, apiKey, indexName, dryRun } = parseArgs();
  const client = algoliasearch(appId, apiKey);

  console.log(`Index name: ${indexName}`);
  console.log('Listing all Algolia indexes...');

  const { items: allIndexes } = await client.listIndices();
  const matchingIndexes = allIndexes.filter(({ name }) => isRelatedIndex(name, indexName));

  if (matchingIndexes.length === 0) {
    console.log('No matching indexes found. Nothing to delete.');
    return;
  }

  console.log(`\nFound ${matchingIndexes.length} index(es) to delete:`);
  matchingIndexes.forEach(({ name, entries }) => {
    console.log(`  - ${name} (${entries} records)`);
  });

  if (dryRun) {
    console.log('\n[DRY RUN] No indexes were deleted.');
    return;
  }

  console.log('\nDeleting indexes...');

  // First, unlink replicas from primary indexes to avoid deletion errors
  for (const { name } of matchingIndexes) {
    const index = client.initIndex(name);
    const settings = await index.getSettings();
    if (settings.replicas && settings.replicas.length > 0) {
      console.log(`  Unlinking ${settings.replicas.length} replicas from ${name}...`);
      await index.setSettings({ replicas: [] }).wait();
    }
  }

  // Then delete all indexes
  for (const { name } of matchingIndexes) {
    const index = client.initIndex(name);
    console.log(`  Deleting ${name}...`);
    await index.delete().wait();
  }

  console.log(`\nDone. Deleted ${matchingIndexes.length} index(es).`);
};

main().catch((err) => {
  console.error('Failed to delete indexes:', err);
  process.exit(1);
});
