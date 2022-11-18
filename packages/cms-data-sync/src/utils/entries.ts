import { Environment, Entry } from 'contentful-management';

export const clearContentfulEntries = async (
  contentfulEnvironment: Environment,
  content_type: string,
) => {
  const entries = await contentfulEnvironment.getEntries({
    content_type,
  });
  console.log(
    `Cleaning Contentful Entries from content-type ${content_type}...`,
  );

  const unpublishPromises: Promise<Entry>[] = [];
  entries.items.forEach(async (entry) => {
    if (entry.isPublished()) {
      unpublishPromises.push(entry.unpublish());
    }
  });

  await Promise.all(unpublishPromises);

  const deletePromises: Promise<Entry>[] = [];
  entries.items.forEach(async (entry) => {
    deletePromises.push(entry.delete());
    console.log('entry', entry.sys.id, 'deleted');
  });

  await Promise.all(deletePromises);
};

export const publishContentfulEntries = async (entries: Entry[]) => {
  entries.forEach(async (entry) => {
    try {
      const published = await entry.publish();
      console.log(`Published entry ${published.sys.id}.`);
    } catch {
      console.log(`Entry with id ${entry.sys.id} could not be published.`);
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
