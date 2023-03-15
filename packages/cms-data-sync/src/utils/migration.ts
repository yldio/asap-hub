import { Environment } from 'contentful-management';
import { addLocaleToFields } from '@asap-hub/contentful';
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
    fallbackParseData?: (
      data: Record<string, unknown>,
    ) => Promise<Record<string, unknown>>,
  ) => {
    const data = await fetchData();

    console.log('\n\n\n\n', data, '\n\n\n\n');
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
      } catch (err) {
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
          }
        }
      }
    }

    await publishContentfulEntries(entries);
  };
