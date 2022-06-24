/* istanbul ignore file */
import algoliasearch from 'algoliasearch';

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
  const index = algoliasearch(algoliaAppId, algoliaCiApiKey).initIndex(
    indexName,
  );

  const settings = await index.getSettings();
  console.log(settings);
};
