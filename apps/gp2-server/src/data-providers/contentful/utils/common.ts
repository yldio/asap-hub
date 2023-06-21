import { Entry, Environment } from '@asap-hub/contentful';

export const deleteEntities = async (
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
  previousEntry: Entry,
  entities: { id?: string }[] | undefined,
  fieldName: string,
): string[] => {
  const previousMembers = previousEntry.fields[fieldName];
  if (!previousMembers?.['en-US']) {
    return [];
  }
  const existingIds: string[] = previousMembers['en-US'].map(
    ({ sys: { id } }: { sys: { id: string } }) => id,
  );
  const nextIds = (entities || []).map(({ id }) => id);

  return existingIds.filter((id) => !nextIds.includes(id));
};
