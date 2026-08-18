import { videoEntity } from '../data/entities';
import { deletePrefix, mediaPrefix } from '../storage';

export const deleteVideoCascade = async (id: string): Promise<void> => {
  await Promise.all(
    [`raw/${id}/`, mediaPrefix(id)].map((prefix) =>
      deletePrefix(prefix).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(`failed to delete ${prefix}`, error);
      }),
    ),
  );
  await videoEntity.delete({ id }).go();
};
