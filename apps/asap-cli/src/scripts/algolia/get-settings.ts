/* istanbul ignore file */
import algoliasearch from 'algoliasearch';
import fs from 'fs/promises';
import { resolve } from 'path';

export type GetSettings = {
  algoliaAppId: string;
  algoliaCiApiKey: string;
  indexName: string;
};

export const getAlgoliaSettings = async ({
  algoliaAppId,
  algoliaCiApiKey,
  indexName,
}: GetSettings): Promise<void> => {
  const path = resolve(__dirname, '../../../../../schema');
  const client = algoliasearch(algoliaAppId, algoliaCiApiKey);
  const index = client.initIndex(indexName);
  const { replicas: _, ...indexSettings } = await index.getSettings();
  await fs.writeFile(
    `${path}/algolia-schema.json`,
    JSON.stringify(indexSettings, null, 2),
  );

  const replicaIndexName = `algolia-${indexName}-end-date-timestamp-desc`;
  const replicaIndex = client.initIndex(replicaIndexName);

  const { customRanking } = await replicaIndex.getSettings();

  await fs.writeFile(
    `${path}/algolia-end-date-timestamp-desc-schema.json`,
    JSON.stringify({ customRanking }, null, 2),
  );
};
