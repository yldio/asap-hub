/* istanbul ignore file */
import { algoliasearch } from 'algoliasearch';

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

  await client.deleteBy({
    indexName,
    deleteByParams: { filters: `__meta.type:"${entityType}"` },
  });
};
