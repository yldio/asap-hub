/* istanbul ignore file */
import algoliasearch from 'algoliasearch';

export type RemoveAlgoliaArgs = {
  algoliaAppId: string;
  algoliaCiApiKey: string;
  indexName: string;
};

export const removeAlgoliaIndex = async ({
  algoliaAppId,
  algoliaCiApiKey,
  indexName,
}: RemoveAlgoliaArgs): Promise<void> => {
  const index = algoliasearch(algoliaAppId, algoliaCiApiKey).initIndex(
    indexName,
  );

  await index.clearObjects();
};
