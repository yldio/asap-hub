import { Environment, Entry } from 'contentful-management';
import { addLocaleToFields, updateEntryFields } from '@asap-hub/contentful';
import pThrottle from 'p-throttle';
import { clearContentfulEntries, publishContentfulEntries } from './entries';
import { logger as loggerFunc } from './logs';

export const migrateFromSquidexToContentfulFactory =
  (contentfulEnvironment: Environment, logger: typeof loggerFunc) =>
  async <DataItem>(
    contentTypeId: string,
    fetchData: () => Promise<DataItem[]>,
    parseData: (
      data: DataItem,
    ) => Promise<{ id: string } & Record<string, unknown>>,
    clearPreviousEntries: boolean = true,
    fallbackParseData?: (
      data: Record<string, unknown>,
    ) => Promise<Record<string, unknown>>,
  ) => {
    const data = await fetchData();

    const throttle = pThrottle({
      limit: 4,
      interval: 1000,
    });

    const throttledCreateOrUpdateEntry = throttle(async (item: DataItem) => {
      const parsed = await parseData(item);

      const { id, updateEntry, ...payload } = parsed;

      try {
        if (updateEntry) {
          const entry = await contentfulEnvironment.getEntry(id);

          updateEntryFields(entry, payload);
          const updatedEntry = await entry.update();
          n += 1;
          logger(`Updated entry with id ${id}. (${n}/${data.length})`, 'INFO');
          return updatedEntry;
        }

        const entry = await contentfulEnvironment.createEntryWithId(
          contentTypeId,
          id,
          {
            fields: addLocaleToFields(payload),
          },
        );
        n += 1;
        logger(`Created entry with id ${id}. (${n}/${data.length})`, 'INFO');
        return entry;
      } catch (err) {
        logger(`Error details of entry ${id}:\n${err}`, 'ERROR');

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
            return fallbackEntry;
          } catch {
            logger(`There is a problem creating entry ${id}`, 'ERROR');
          }
        }
      }
      return null;
    });

    if (clearPreviousEntries) {
      await clearContentfulEntries(contentfulEnvironment, contentTypeId);
    }
    let n = 0;
    const entries = await Promise.all(data.map(throttledCreateOrUpdateEntry));

    await publishContentfulEntries(entries.filter(Boolean) as Entry[]);
  };
