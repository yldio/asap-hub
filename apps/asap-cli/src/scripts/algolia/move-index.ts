/* istanbul ignore file */
import algoliasearch from 'algoliasearch';

export type MoveAlgoliaIndex = {
  algoliaAppId: string;
  algoliaCiApiKey: string;
  indexNameFrom: string;
  indexNameTo: string;
};

export const moveAlgoliaIndex = async ({
  algoliaAppId,
  algoliaCiApiKey,
  indexNameFrom,
  indexNameTo,
}: MoveAlgoliaIndex): Promise<void> => {
  const client = algoliasearch(algoliaAppId, algoliaCiApiKey);

  await client.moveIndex(indexNameFrom, indexNameTo);
};
