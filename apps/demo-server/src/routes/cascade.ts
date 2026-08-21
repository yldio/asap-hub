import { videoEntity } from '../data/entities';
import {
  abortMultipartUploadsUnder,
  deletePrefix,
  mediaPrefix,
} from '../storage';

export const deleteVideoCascade = async (id: string): Promise<void> => {
  const rawPrefix = `raw/${id}/`;

  // aborting first: a part that lands between the list and the delete would
  // otherwise be completed into an object nothing is left to clean up
  await abortMultipartUploadsUnder(rawPrefix).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(`failed to abort uploads under ${rawPrefix}`, error);
  });

  await Promise.all(
    [rawPrefix, mediaPrefix(id)].map((prefix) =>
      deletePrefix(prefix).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(`failed to delete ${prefix}`, error);
      }),
    ),
  );
  await videoEntity.delete({ id }).go();
};
