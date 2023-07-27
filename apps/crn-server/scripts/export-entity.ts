import { EntityRecord, EntityResponses } from '@asap-hub/algolia';
import { ListResponse } from '@asap-hub/model';
import { promises as fs } from 'fs';
import Events from '../src/controllers/event.controller';
import ExternalAuthors from '../src/controllers/external-author.controller';
import ResearchOutputs from '../src/controllers/research-output.controller';
import Users from '../src/controllers/user.controller';
import { getEventDataProvider } from '../src/dependencies/events.dependencies';
import { getExternalAuthorDataProvider } from '../src/dependencies/external-authors.dependencies';
import { getResearchOutputDataProvider } from '../src/dependencies/research-outputs.dependencies';
import { getResearchTagDataProvider } from '../src/dependencies/research-tags.dependencies';
import {
  getAssetDataProvider,
  getUserDataProvider,
} from '../src/dependencies/users.dependencies';

export const exportEntity = async (
  entity: keyof EntityResponses,
  filename?: string,
): Promise<void> => {
  const controller = getController(entity);
  const file = await fs.open(filename || `${entity}.json`, 'w');

  let recordCount = 0;
  let total: number;
  let records: ListResponse<EntityResponses[keyof EntityResponses]>;
  let page = 1;

  await file.write('[\n');

  do {
    records = await controller.fetch({
      take: 20,
      skip: (page - 1) * 20,
    });

    total = records.total;

    if (page != 1) {
      await file.write(',\n');
    }

    await file.write(
      JSON.stringify(
        records.items.map((record) => transformRecords(record, entity)),
        null,
        2,
      ).slice(1, -1),
    );

    page++;
    recordCount += records.items.length;
  } while (total > recordCount);

  await file.write(']');

  console.log(`Finished exporting ${recordCount} records`);
};

const getController = (entity: keyof EntityResponses) => {
  const userDataProvider = getUserDataProvider();

  const researchOutputDataProvider = getResearchOutputDataProvider();
  const researchTagDataProvider = getResearchTagDataProvider();
  const externalAuthorDataProvider = getExternalAuthorDataProvider();

  const assetDataProvider = getAssetDataProvider();

  const eventDataProvider = getEventDataProvider();

  const controllerMap = {
    user: new Users(userDataProvider, assetDataProvider),
    'research-output': new ResearchOutputs(
      researchOutputDataProvider,
      researchTagDataProvider,
      externalAuthorDataProvider,
    ),
    'external-author': new ExternalAuthors(externalAuthorDataProvider),
    event: new Events(eventDataProvider),
  };

  return controllerMap[entity];
};

const transformRecords = <T extends EntityResponses, K extends keyof T>(
  record: T[K] & { id: string },
  type: K,
): EntityRecord<T, K> => ({
  ...record,
  objectID: record.id,
  __meta: {
    type,
  },
});
