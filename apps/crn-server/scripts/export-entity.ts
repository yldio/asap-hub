import { EntityRecord, EntityResponses } from '@asap-hub/algolia';
import { ListResponse } from '@asap-hub/model';
import {
  getAccessTokenFactory,
  RestResearchOutput,
  SquidexGraphql,
  SquidexRest,
} from '@asap-hub/squidex';
import { promises as fs } from 'fs';
import { appName, baseUrl, clientId, clientSecret } from '../src/config';
import Events from '../src/controllers/events.controller';
import ExternalAuthors from '../src/controllers/external-authors.controller';
import Labs from '../src/controllers/labs.controller';
import ResearchOutputs from '../src/controllers/research-outputs.controller';
import Users from '../src/controllers/users.controller';
import { LabSquidexDataProvider } from '../src/data-providers/labs.data-provider';
import { ResearchOutputSquidexDataProvider } from '../src/data-providers/research-outputs.data-provider';
import { ResearchTagSquidexDataProvider } from '../src/data-providers/research-tags.data-provider';
import { getEventDataProvider } from '../src/dependencies/events.dependencies';
import { getExternalAuthorDataProvider } from '../src/dependencies/external-authors.dependencies';
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
  const getAuthToken = getAccessTokenFactory({
    clientId,
    clientSecret,
    baseUrl,
  });
  const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
    appName,
    baseUrl,
  });

  const researchOutputRestClient = new SquidexRest<RestResearchOutput>(
    getAuthToken,
    'research-outputs',
    { appName, baseUrl },
  );

  const userDataProvider = getUserDataProvider();

  const researchOutputDataProvider = new ResearchOutputSquidexDataProvider(
    squidexGraphqlClient,
    researchOutputRestClient,
  );
  const researchTagDataProvider = new ResearchTagSquidexDataProvider(
    squidexGraphqlClient,
  );
  const externalAuthorDataProvider = getExternalAuthorDataProvider();

  const assetDataProvider = getAssetDataProvider();

  const eventDataProvider = getEventDataProvider();

  const labDataProvider = new LabSquidexDataProvider(squidexGraphqlClient);
  const controllerMap = {
    user: new Users(userDataProvider, assetDataProvider),
    'research-output': new ResearchOutputs(
      researchOutputDataProvider,
      researchTagDataProvider,
      externalAuthorDataProvider,
    ),
    'external-author': new ExternalAuthors(externalAuthorDataProvider),
    event: new Events(eventDataProvider),
    lab: new Labs(labDataProvider),
  };

  return controllerMap[entity];
};

const transformRecords = <T extends keyof EntityResponses>(
  record: EntityResponses[T],
  type: T,
): EntityRecord<T> => ({
  ...record,
  objectID: record.id,
  __meta: {
    type,
  },
});
