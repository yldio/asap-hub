/* istanbul ignore file */
import algoliasearch from 'algoliasearch';

export type MoveAlgoliaArgs = {
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
}: MoveAlgoliaArgs): Promise<void> => {
  const client = algoliasearch(algoliaAppId, algoliaCiApiKey);

  await client.moveIndex(indexNameFrom, indexNameTo);
};
