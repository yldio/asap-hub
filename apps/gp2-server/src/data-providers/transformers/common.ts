import { Environment } from '@asap-hub/contentful';

export const deleteEntries = async (
  idsToDelete: string[],
  environment: Environment,
) =>
  Promise.all(
    idsToDelete.map(async (id) => {
      const deletable = await environment.getEntry(id);
      await deletable.unpublish();
      return deletable.delete();
    }),
  );
export const getIdsToDelete = (
  previous: { id?: string }[] | undefined,
  entities: { id?: string }[] | undefined,
): string[] => {
  if (!previous || previous.length === 0) {
    return [];
  }
  const existingIds = previous
    .filter((existing): existing is { id: string } => !!existing.id)
    .map(({ id }) => id);
  const nextIds = (entities || []).map(({ id }) => id);

  return existingIds.filter((id) => !nextIds.includes(id));
};
