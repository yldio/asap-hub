import type { Entry, Link, VersionedLink } from 'contentful-management';

export const addLocaleToFields = (payload: Record<string, unknown>) =>
  Object.entries(payload).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: { 'en-US': value },
    }),
    {},
  );

export const createLink = (id: string) => ({
  sys: {
    type: 'Link',
    linkType: 'Entry',
    id,
  },
});

export const updateEntryFields = (
  entry: Entry,
  fields: Record<string, unknown>,
) => {
  Object.entries(fields).forEach(([fieldName, fieldValue]) => {
    // eslint-disable-next-line no-param-reassign
    entry.fields[fieldName] = { 'en-US': fieldValue };
  });
  return entry;
};

export function getLinkEntity<Version extends boolean>(
  id: string,
  version?: Version,
): Version extends true ? VersionedLink<'Entry'> : Link<'Entry'>;
// eslint-disable-next-line no-redeclare
export function getLinkEntity(id: string, version: boolean = false): unknown {
  return {
    sys: {
      type: 'Link',
      linkType: 'Entry',
      id,
      ...(version ? { version: 1 } : {}),
    },
  };
}

export const getLinkEntities = <Version extends boolean>(
  entities: string[],
  version?: Version,
) => entities.map((id) => getLinkEntity<Version>(id, version));

export const getBulkPayload = <Version extends boolean>(
  entities: string[],
  version?: Version,
) => ({
  entities: {
    sys: { type: 'Array' as const },
    items: getLinkEntities<Version>(entities, version),
  },
});
