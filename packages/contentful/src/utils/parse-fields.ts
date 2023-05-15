import type { Entry } from 'contentful-management';

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
