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

type PatchAndPublish = (
  entry: Entry,
  fields: Record<string, unknown>,
) => Promise<Entry>;
export const patchAndPublish: PatchAndPublish = async (entry, fields) => {
  const result = await patch(entry, fields);
  return result.publish();
};

type PatchAndPublishConflict = (
  ...args: Parameters<PatchAndPublish>
) => Promise<Awaited<ReturnType<PatchAndPublish>> | null>;
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
