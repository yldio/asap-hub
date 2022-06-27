/* istanbul ignore file */
import algoliasearch from 'algoliasearch';
import fs from 'fs/promises';
import { resolve } from 'path';

export type SetSettings = {
  algoliaAppId: string;
  algoliaCiApiKey: string;
  indexName: string;
};

export const setAlgoliaSettings = async ({
  algoliaAppId,
  algoliaCiApiKey,
  indexName,
}: SetSettings): Promise<void> => {
  const path = resolve(__dirname, '../../../../../schema');
  const client = algoliasearch(algoliaAppId, algoliaCiApiKey);

  const index = client.initIndex(indexName);
  const indexSchemaRaw = await fs.readFile(
    `${path}/algolia-schema.json`,
    'utf8',
  );
  const indexSchema = JSON.parse(indexSchemaRaw);

  const replicaIndexName = `${indexName}-end-date-timestamp-desc`;
  await index
    .setSettings({
      ...indexSchema,
      replicas: [replicaIndexName],
    })
    .wait();
  const replicaIndex = client.initIndex(replicaIndexName);
  const replicaIndexSchemaRaw = await fs.readFile(
    `${path}/algolia-end-date-timestamp-desc-schema.json`,
    'utf8',
  );

  const replicaIndexSchema = JSON.parse(replicaIndexSchemaRaw);
  await replicaIndex.setSettings(replicaIndexSchema);
};
