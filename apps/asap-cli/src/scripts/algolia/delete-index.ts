/* istanbul ignore file */
import { algoliasearch } from 'algoliasearch';

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
    const taskResponse = await client.setSettings({
      indexName: name,
      indexSettings: { replicas: [] },
    });
    await client.waitForTask({
      indexName: name,
      taskID: taskResponse.taskID,
    });
  };

  const { items } = await client.listIndices();
  await Promise.all(
    items
      .filter(({ name }) => name.startsWith(indexName))
      .map(async ({ name, primary, replicas }) => {
        if (primary || (replicas && replicas.length > 0)) {
          await unlinkIndex(primary || name);
        }
        const taskResponse = await client.deleteIndex({ indexName: name });
        await client.waitForTask({
          indexName: name,
          taskID: taskResponse.taskID,
        });
      }),
  );
};
