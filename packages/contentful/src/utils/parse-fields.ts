import type { Entry } from 'contentful-management';

export const addLocaleToFields = (payload: Record<string, unknown>) =>
  Object.entries(payload).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: { 'en-US': value },
    }),
    {},
  );

export const updateEntryFields = (
  entry: Entry,
  fields: Record<string, unknown>,
) => {
  const updatedEntry = { ...entry };
  Object.entries(fields).forEach(([fieldName, fieldValue]) => {
    updatedEntry.fields[fieldName] = { 'en-US': fieldValue };
  });
  return updatedEntry;
};
