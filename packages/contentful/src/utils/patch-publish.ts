import type { Entry } from 'contentful-management';

export const patch = async (
  entry: Entry,
  fields: Record<string, unknown>,
): Promise<Entry> => {
  const diff: Parameters<Entry['patch']>[0] = Object.entries(fields).map(
    ([key, value]) => ({
      op: Object.prototype.hasOwnProperty.call(entry.fields, key)
        ? 'replace'
        : 'add',
      path: `/fields/${key}`,
      value: {
        'en-US': value,
      },
    }),
  );
  return entry.patch(diff);
};

export const patchAndPublish = async (
  entry: Entry,
  fields: Record<string, unknown>,
): Promise<Entry> => {
  const result = await patch(entry, fields);
  return result.publish();
};
