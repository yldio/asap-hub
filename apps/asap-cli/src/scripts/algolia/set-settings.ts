/* istanbul ignore file */
import { Settings } from '@algolia/client-search';
import algoliasearch, { SearchClient, SearchIndex } from 'algoliasearch';
import fs from 'fs/promises';
import { resolve } from 'path';

export type SetAlgoliaSettings = {
  algoliaAppId: string;
  algoliaCiApiKey: string;
  indexName: string;
  appName: string;
};

export const getIndexSchema = async ({
  algoliaAppId,
  algoliaCiApiKey,
  indexName,
  appName,
}: SetAlgoliaSettings): Promise<{
  path: string;
  client: SearchClient;
  index: SearchIndex;
  indexSchema: Settings;
}> => {
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

  return {
    path,
    client,
    index,
    indexSchema,
  };
};

export const setAlgoliaSettings = async ({
  algoliaAppId,
  algoliaCiApiKey,
  indexName,
  appName,
}: SetAlgoliaSettings): Promise<void> => {
  const { path, client, index, indexSchema } = await getIndexSchema({
    algoliaAppId,
    algoliaCiApiKey,
    indexName,
    appName,
  });

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
  await replicaIndex.setSettings({
    ...replicaIndexSchema,
    attributesForFaceting: indexSchema.attributesForFaceting,
  });
};
