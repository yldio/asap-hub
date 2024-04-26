/* istanbul ignore file */
import algoliasearch from 'algoliasearch';
import fs from 'fs/promises';
import { resolve } from 'path';

export type SetAlgoliaSettings = {
  algoliaAppId: string;
  algoliaCiApiKey: string;
  indexName: string;
  appName: string;
};

export const setAlgoliaSettings = async ({
  algoliaAppId,
  algoliaCiApiKey,
  indexName,
  appName,
}: SetAlgoliaSettings): Promise<void> => {
  const path = resolve(
    __dirname,
    `../../../../../packages/algolia/schema/${appName}`,
  );
  const client = algoliasearch(algoliaAppId, algoliaCiApiKey);

  const index = client.initIndex(indexName);
  const indexSchemaRaw = await fs.readFile(
    `${path}/algolia-schema.json`,
    'utf8',
  );
  const indexSchema = JSON.parse(indexSchemaRaw);

  const replicaIndexName = `${indexName}-reverse-timestamp`;
  await index
    .setSettings({
      ...indexSchema,
      replicas: [replicaIndexName],
    })
    .wait();

  const replicaIndex = client.initIndex(replicaIndexName);
  const replicaIndexSchemaRaw = await fs.readFile(
    `${path}/algolia-reverse-timestamp-schema.json`,
    'utf8',
  );

  const replicaIndexSchema = JSON.parse(replicaIndexSchemaRaw);
  await replicaIndex.setSettings(replicaIndexSchema);
};
