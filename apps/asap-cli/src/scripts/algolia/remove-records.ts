/* istanbul ignore file */
import algoliasearch from 'algoliasearch';

export type RemoveAlgoliaRecordsArgs = {
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
}: RemoveAlgoliaRecordsArgs): Promise<void> => {
  const client = algoliasearch(algoliaAppId, algoliaCiApiKey);
  const index = client.initIndex(indexName);

  await index.deleteBy({
    filters: `__meta.type:"${entityType}"`,
  });
};
