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
    .reverse()
    .forEach(async ({ name }) => {
      const indexToDelete = client.initIndex(name);
      console.log(indexToDelete.indexName, name);
      const { primary } = await indexToDelete.getSettings();
      try {
        if (primary) {
          await unlinkIndex(primary);
        }
        await indexToDelete.delete();
      } catch (err) {
        console.error(err);
        throw err;
      }
    });
  const unlinkIndex = async (name: string) => {
    const index = client.initIndex(name);
    return index.setSettings({ replicas: [] }).wait();
  };
};
