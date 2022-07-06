/* istanbul ignore file */
import algoliasearch from 'algoliasearch';

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
  const index = algoliasearch(algoliaAppId, algoliaCiApiKey).initIndex(
    indexName,
  );

  await index.clearObjects();
};
