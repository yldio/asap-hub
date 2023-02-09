import { Environment } from 'contentful-management';
import { clearContentfulEntries, publishContentfulEntries } from './entries';
import { logger as loggerFunc } from './logs';

const addLocaleToFields = (payload: Record<string, unknown>) =>
  Object.entries(payload).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: { 'en-US': value },
    }),
    {},
  );

export const migrateFromSquidexToContentfulFactory =
  (contentfulEnvironment: Environment, logger: typeof loggerFunc) =>
  async <DataItem>(
    contentTypeId: string,
    fetchData: () => Promise<DataItem[]>,
    parseData: (
      data: DataItem,
    ) => Promise<{ id: string } & Record<string, unknown>>,
    fallbackParseData?: (
      data: Record<string, unknown>,
    ) => Promise<Record<string, unknown>>,
    onComplete?: (error?: unknown) => Promise<void>,
  ) => {
    const data = await fetchData();

    await clearContentfulEntries(contentfulEnvironment, contentTypeId);

    const entries = [];
    for (const item of data) {
      const parsed = await parseData(item);

      const { id, ...payload } = parsed;

      try {
        const entry = await contentfulEnvironment.createEntryWithId(
          contentTypeId,
          id,
          {
            fields: addLocaleToFields(payload),
          },
        );
        entries.push(entry);

        onComplete && (await onComplete());
      } catch (err) {
        console.log('got error');
        logger(`Error details of entry ${id}:\n${err}`, 'ERROR-DEBUG');

        if (fallbackParseData) {
          try {
            const fallbackParsed = await fallbackParseData(payload);
            const { id: _id, ...fallbackPayload } = fallbackParsed;
            const fallbackEntry = await contentfulEnvironment.createEntryWithId(
              contentTypeId,
              id,
              {
                fields: addLocaleToFields(fallbackPayload),
              },
            );
            logger(
              `Entry with ID ${id} was uploaded with fallback data`,
              'ERROR',
            );
            entries.push(fallbackEntry);
          } catch {
            logger(`There is a problem creating entry ${id}`, 'ERROR');
            onComplete && (await onComplete(err));
          }
        } else {
          onComplete && (await onComplete(err));
        }
      }
    }

    await publishContentfulEntries(entries);
  };
