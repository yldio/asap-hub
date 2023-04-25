/* eslint-disable no-console */

import { InlineIFrameBody } from 'contentful-html-rich-text-converter';
import { Entry, Environment } from 'contentful-management';
import { checkIfEntryAlreadyExistsInContentful } from './entries';

export const createMediaEntries = async (
  contentfulEnvironment: Environment,
  inlineIFramesBodies: InlineIFrameBody[],
) => {
  const entries = await Promise.all(
    inlineIFramesBodies.map(async ([id, fields]) => {
      const isMediaAlreadyInContentful =
        await checkIfEntryAlreadyExistsInContentful(contentfulEnvironment, id);
      if (!isMediaAlreadyInContentful) {
        console.log(`Creating media with id ${id}.`);
        return contentfulEnvironment.createEntryWithId('media', id, fields);
      }
      return null;
    }),
  );

  await Promise.all(
    entries
      .filter((entry): entry is Entry => entry !== null)
      .map(async (entry) => {
        entry.publish();
      }),
  );
};
