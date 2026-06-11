/* istanbul ignore file */
import { algoliasearch } from 'algoliasearch';

export type ClearAlgoliaIndex = {
  algoliaAppId: string;
  algoliaCiApiKey: string;
  indexName: string;
};

export const clearAlgoliaIndex = async ({
  algoliaAppId,
  algoliaCiApiKey,
  indexName,
}: ClearAlgoliaIndex): Promise<void> => {
  const client = algoliasearch(algoliaAppId, algoliaCiApiKey);
  await client.clearObjects({ indexName });
};
