/* istanbul ignore file */
import algoliasearch from 'algoliasearch';
import fs from 'fs/promises';
import { resolve } from 'path';
import prettier from 'prettier';

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
  const formattedIndexSettings = prettier.format(
    JSON.stringify(indexSettings),
    { parser: 'json' },
  );
  await fs.writeFile(`${path}/algolia-schema.json`, formattedIndexSettings);

  const replicaIndexName = `${indexName}-reverse-timestamp`;
  const replicaIndex = client.initIndex(replicaIndexName);

  const { customRanking, attributesForFaceting, searchableAttributes } =
    await replicaIndex.getSettings();

  const formattedReplicaSettings = prettier.format(
    JSON.stringify({
      customRanking,
      attributesForFaceting,
      searchableAttributes,
    }),
    {
      parser: 'json',
    },
  );
  await fs.writeFile(
    `${path}/algolia-reverse-timestamp-schema.json`,
    formattedReplicaSettings,
  );
};
