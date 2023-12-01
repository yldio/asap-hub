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

const parseError = ({ message }: Error) => {
  try {
    const { status } = JSON.parse(message);
    return status;
  } catch {
    return message;
  }
};

export const patchAndPublish = async (
  entry: Entry,
  fields: Record<string, unknown>,
): Promise<Entry> => {
  const result = await patch(entry, fields);
  return result.publish();
};

type PatchAndPublishConflict = (
  ...args: Parameters<typeof patchAndPublish>
) => Promise<Awaited<ReturnType<typeof patchAndPublish>> | null>;
export const patchAndPublishConflict: PatchAndPublishConflict = async (
  entry,
  fields,
) => {
  try {
    return await patchAndPublish(entry, fields);
  } catch (err) {
    if (err instanceof Error) {
      const status = parseError(err);
      if (status === 409) {
        return null;
      }
    }
    throw err;
  }
};
