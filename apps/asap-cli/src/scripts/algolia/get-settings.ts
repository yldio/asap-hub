/* istanbul ignore file */
import { algoliasearch } from 'algoliasearch';
import fs from 'fs/promises';
import { resolve } from 'path';
import prettier from 'prettier';

export type GetAlgoliaSettings = {
  algoliaAppId: string;
  algoliaCiApiKey: string;
  indexName: string;
  appName: string;
};

export const getAlgoliaSettings = async ({
  algoliaAppId,
  algoliaCiApiKey,
  indexName,
  appName,
}: GetAlgoliaSettings): Promise<void> => {
  const path = resolve(
    __dirname,
    `../../../../../packages/algolia/schema/${appName}`,
  );
  const client = algoliasearch(algoliaAppId, algoliaCiApiKey);
  const { replicas: _, ...indexSettings } = await client.getSettings({
    indexName,
  });
  const formattedIndexSettings = await prettier.format(
    JSON.stringify(indexSettings),
    { parser: 'json' },
  );
  await fs.writeFile(`${path}/algolia-schema.json`, formattedIndexSettings);

  const replicaIndexName = `${indexName}-reverse-timestamp`;

  const { customRanking, attributesForFaceting, searchableAttributes } =
    await client.getSettings({ indexName: replicaIndexName });

  const formattedReplicaSettings = await prettier.format(
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
