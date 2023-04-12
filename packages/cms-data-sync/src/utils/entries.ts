import { Environment, Entry } from 'contentful-management';
import { logger } from './logs';

export const checkIfEntryAlreadyExistsInContentful = async (
  contentfulEnvironment: Environment,
  id: string,
) => {
  try {
    const entry = await contentfulEnvironment.getEntry(id);
    return !!entry;
  } catch (error) {
    if (error instanceof Error) {
      const errorParsed = JSON.parse(error?.message);
      if (errorParsed.status === 404) {
        return false;
      }
    }

    throw error;
  }
};

export const fetchContentfulEntries = async (
  contentfulEnvironment: Environment,
  contentType: string,
  skip: number = 0,
): Promise<Entry[]> => {
  const PAGE_SIZE = 100;
  const entries = await contentfulEnvironment.getEntries({
    content_type: contentType,
    skip,
    limit: PAGE_SIZE,
  });
  if (entries.total > skip + entries.items.length) {
    const nextPage = await fetchContentfulEntries(
      contentfulEnvironment,
      contentType,
      skip + PAGE_SIZE,
    );
    return [...(entries.items || []), ...nextPage];
  }
  return entries.items || [];
};

export const clearContentfulEntries = async (
  contentfulEnvironment: Environment,
  contentType: string,
) => {
  const entries = await fetchContentfulEntries(
    contentfulEnvironment,
    contentType,
  );
  logger(
    `Cleaning ${entries.length} Contentful entries from content-type ${contentType}...`,
    'INFO',
  );
  const total = entries.length;
  let n = 0;
  await Promise.all(
    entries.map(async (entry) => {
      if (entry.isPublished()) {
        await entry.unpublish();
      }
      await entry.delete();
      n += 1;
      logger(`Entry with ID ${entry.sys.id} deleted. (${n}/${total})`, 'INFO');
    }),
  );
};

export const publishContentfulEntries = async (entries: Entry[]) => {
  const total = entries.length;
  let n = 0;
  await Promise.all(
    entries.map(async (entry) => {
      try {
        const published = await entry.publish();
        n += 1;
        logger(`Published entry ${published.sys.id}. (${n}/${total})`, 'INFO');
      } catch (err) {
        logger(
          `Entry with ID ${entry.sys.id} could not be published.`,
          'ERROR',
        );
      }
    }),
  );
};

// Leaving it here because we could use
// bulk publish after we sort it out the
// issues with rich text
// Now if one promise fails the other
// entries are not published

// const bulkPublishEntries = async (
//   contentfulEnvironment: Environment,
//   entries: Entry[],
// ) => {
//   const payload: VersionedLink<'Entry'>[] = entries.map((entry) => ({
//     sys: {
//       linkType: 'Entry',
//       type: 'Link',
//       id: entry.sys.id,
//       version: entry.sys.version,
//     },
//   }));

//   const bulkActionInProgress =
//     await contentfulEnvironment.createPublishBulkAction({
//       entities: {
//         sys: { type: 'Array' },
//         items: payload,
//       },
//     });

//   const bulkActionCompleted = await bulkActionInProgress.waitProcessing();
//   console.log(bulkActionCompleted);
// };
