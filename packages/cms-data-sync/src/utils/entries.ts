import { Environment, Entry } from 'contentful-management';
import { logger } from './logs';

export const clearContentfulEntries = async (
  contentfulEnvironment: Environment,
  contentType: string,
) => {
  const entries = await contentfulEnvironment.getEntries({
    content_type: contentType,
  });
  logger(
    `Cleaning Contentful Entries from content-type ${contentType}...`,
    'INFO',
  );

  await Promise.all(
    entries.items.map(async (entry) => {
      if (entry.isPublished()) {
        await entry.unpublish();
      }
    }),
  );

  await Promise.all(
    entries.items.map(async (entry) => {
      await entry.delete();
      logger(`Entry ${entry.sys.id} deleted`, 'INFO');
    }),
  );
};

export const publishContentfulEntries = async (entries: Entry[]) => {
  entries.forEach(async (entry) => {
    try {
      const published = await entry.publish();
      logger(`Published entry ${published.sys.id}.`, 'INFO');
    } catch (err) {
      logger(`Entry with id ${entry.sys.id} could not be published.`, 'ERROR');
    }
  });
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
