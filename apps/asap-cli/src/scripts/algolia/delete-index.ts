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
  const unlinkIndex = async (name: string) => {
    const index = client.initIndex(name);
    return index.setSettings({ replicas: [] }).wait();
  };
  const indices = await client.listIndices();
  indices.items
    .filter(({ name }) => name.startsWith(indexName))
    .forEach(async ({ name }) => {
      const indexToDelete = client.initIndex(name);
      const { primary, replicas } = await indexToDelete.getSettings();
      if (primary || replicas) {
        await unlinkIndex(primary || name);
      }
      await indexToDelete.delete().wait();
    });
};
