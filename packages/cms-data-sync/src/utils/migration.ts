import { addLocaleToFields, updateEntryFields } from '@asap-hub/contentful';
import { Environment, Entry } from 'contentful-management';
import { clearContentfulEntries, publishContentfulEntries } from './entries';
import { logger as loggerFunc } from './logs';
import { safeParse } from './error';
import { upsertInPlace } from './setup';

export const migrateFromSquidexToContentfulFactory =
  (contentfulEnvironment: Environment, logger: typeof loggerFunc) =>
  async <DataItem extends { status?: string }>(
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

    if (clearPreviousEntries && !upsertInPlace) {
      await clearContentfulEntries(contentfulEnvironment, contentTypeId);
    }
    let n = 0;
    const entries = await Promise.all(
      data.map(async (item) => {
        const parsed = await parseData(item);

        const { id, updateEntry, ...payload } = parsed;

        const createEntry = async () => {
          const createdEntry = await contentfulEnvironment.createEntryWithId(
            contentTypeId,
            id,
            {
              fields: addLocaleToFields(payload),
            },
          );

          n += 1;
          logger(`Created entry with id ${id}. (${n}/${data.length})`, 'INFO');
          if (item.status === 'PUBLISHED') {
            return createdEntry;
          }
          return null;
        };

        const updateExistingEntry = async () => {
          const contentfulEntry = await contentfulEnvironment.getEntry(id);
          updateEntryFields(contentfulEntry, payload);
          const updatedEntry = await contentfulEntry.update();

          n += 1;
          logger(`Updated entry with id ${id}. (${n}/${data.length})`, 'INFO');
          if (item.status === 'PUBLISHED') {
            return updatedEntry;
          }
          return null;
        };

        try {
          return updateEntry || upsertInPlace
            ? await updateExistingEntry()
            : await createEntry();
        } catch (err) {
          if (err instanceof Error) {
            const errorParsed = safeParse(err.message);
            // this is a fallback when it should have updated the entry
            // but it does not exist
            if (upsertInPlace && errorParsed && errorParsed.status === 404) {
              try {
                const entry = await createEntry();
                return entry;
              } catch (createError) {
                logger(
                  `(Fallback update) Error creating entry ${id}:\n${createError}`,
                  'ERROR',
                );
                return null;
              }
            }
          }

          logger(`Error details of entry ${id}:\n${err}`, 'ERROR');

          if (fallbackParseData) {
            try {
              const fallbackParsed = await fallbackParseData(payload);
              const { id: _id, ...fallbackPayload } = fallbackParsed;
              const fallbackEntry =
                await contentfulEnvironment.createEntryWithId(
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
      }),
    );

    await publishContentfulEntries(entries.filter(Boolean) as Entry[]);
  };
