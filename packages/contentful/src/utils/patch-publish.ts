import type { Entry } from 'contentful-management';

export const patchAndPublish = async (
  entry: Entry,
  fields: Record<string, unknown>,
): Promise<Entry> => {
  const patch: Parameters<Entry['patch']>[0] = Object.entries(fields).map(
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
  const result = await entry.patch(patch);
  return result.publish();
};
