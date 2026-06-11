/* istanbul ignore file */
import { algoliasearch, SearchClient } from 'algoliasearch';
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
  appName,
}: SetAlgoliaSettings): Promise<{
  path: string;
  client: SearchClient;
  indexSchema: Record<string, unknown>;
}> => {
  const path = resolve(
    __dirname,
    `../../../../../packages/algolia/schema/${appName}`,
  );
  const client = algoliasearch(algoliaAppId, algoliaCiApiKey);

  const indexSchemaRaw = await fs.readFile(
    `${path}/algolia-schema.json`,
    'utf8',
  );
  const indexSchema = JSON.parse(indexSchemaRaw);

  return {
    path,
    client,
    indexSchema,
  };
};

export const setAlgoliaSettings = async ({
  algoliaAppId,
  algoliaCiApiKey,
  indexName,
  appName,
}: SetAlgoliaSettings): Promise<void> => {
  const { path, client, indexSchema } = await getIndexSchema({
    algoliaAppId,
    algoliaCiApiKey,
    indexName,
    appName,
  });

  const replicaIndexName = `${indexName}-reverse-timestamp`;
  const mainTask = await client.setSettings({
    indexName,
    indexSettings: {
      ...indexSchema,
      replicas: [replicaIndexName],
    },
  });
  await client.waitForTask({ indexName, taskID: mainTask.taskID });

  const replicaIndexSchemaRaw = await fs.readFile(
    `${path}/algolia-reverse-timestamp-schema.json`,
    'utf8',
  );
  const replicaIndexSchema = JSON.parse(replicaIndexSchemaRaw);
  const replicaTask = await client.setSettings({
    indexName: replicaIndexName,
    indexSettings: replicaIndexSchema,
  });
  await client.waitForTask({
    indexName: replicaIndexName,
    taskID: replicaTask.taskID,
  });
};
