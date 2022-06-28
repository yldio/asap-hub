/* istanbul ignore file */
import algoliasearch from 'algoliasearch';

export type RemoveAlgoliaRecords = {
  algoliaAppId: string;
  algoliaCiApiKey: string;
  indexName: string;
  entityType: string;
};

export const removeAlgoliaRecords = async ({
  algoliaAppId,
  algoliaCiApiKey,
  indexName,
  entityType,
}: RemoveAlgoliaRecords): Promise<void> => {
  const client = algoliasearch(algoliaAppId, algoliaCiApiKey);
  const index = client.initIndex(indexName);

  await index.deleteBy({
    filters: `__meta.type:"${entityType}"`,
  });
};
