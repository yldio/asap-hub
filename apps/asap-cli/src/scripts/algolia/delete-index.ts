/* istanbul ignore file */
import algoliasearch from 'algoliasearch';

export type DeleteAlgoliaIndex = {
  algoliaAppId: string;
  algoliaCiApiKey: string;
  indexName: string;
};

export const deleteAlgoliaIndex = async ({
  algoliaAppId,
  algoliaCiApiKey,
  indexName,
}: DeleteAlgoliaIndex): Promise<void> => {
  const client = algoliasearch(algoliaAppId, algoliaCiApiKey);
  const indices = await client.listIndices();
  indices.items
    .filter(({ name }) => name.startsWith(indexName))
    .forEach(({ name }) => {
      const indexToDelete = client.initIndex(name);
      indexToDelete.delete();
    });
};
