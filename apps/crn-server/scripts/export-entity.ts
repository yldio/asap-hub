import { EntityRecord, EntityResponses } from '@asap-hub/algolia';
import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import { ListResponse } from '@asap-hub/model';
import {
  getAccessTokenFactory,
  InputUser,
  RestEvent,
  RestExternalAuthor,
  RestResearchOutput,
  RestUser,
  SquidexGraphql,
  SquidexRest,
} from '@asap-hub/squidex';
import { promises as fs } from 'fs';
import {
  appName,
  baseUrl,
  clientId,
  clientSecret,
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
  isContentfulEnabled,
} from '../src/config';
import Events from '../src/controllers/events';
import ExternalAuthors from '../src/controllers/external-authors';
import Labs from '../src/controllers/labs';
import ResearchOutputs from '../src/controllers/research-outputs';
import Users from '../src/controllers/users';
import { AssetSquidexDataProvider } from '../src/data-providers/assets.data-provider';
import { ExternalAuthorContentfulDataProvider } from '../src/data-providers/contentful/external-authors.data-provider';
import { UserContentfulDataProvider } from '../src/data-providers/contentful/users.data-provider';
import { EventSquidexDataProvider } from '../src/data-providers/event.data-provider';
import { ExternalAuthorSquidexDataProvider } from '../src/data-providers/external-authors.data-provider';
import { LabSquidexDataProvider } from '../src/data-providers/labs.data-provider';
import { ResearchOutputSquidexDataProvider } from '../src/data-providers/research-outputs.data-provider';
import { ResearchTagSquidexDataProvider } from '../src/data-providers/research-tags.data-provider';
import { UserSquidexDataProvider } from '../src/data-providers/users.data-provider';
import { getContentfulRestClientFactory } from '../src/dependencies/clients.dependencies';

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
      take: 50,
      skip: (page - 1) * 50,
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

  const contentfulGraphQLClient = getContentfulGraphQLClient({
    space: contentfulSpaceId,
    accessToken: contentfulAccessToken,
    environment: contentfulEnvId,
  });

  const userRestClient = new SquidexRest<RestUser, InputUser>(
    getAuthToken,
    'users',
    {
      appName,
      baseUrl,
    },
  );
  const researchOutputRestClient = new SquidexRest<RestResearchOutput>(
    getAuthToken,
    'research-outputs',
    { appName, baseUrl },
  );
  const externalAuthorsRestClient = new SquidexRest<RestExternalAuthor>(
    getAuthToken,
    'external-authors',
    { appName, baseUrl },
  );
  const eventsRestClient = new SquidexRest<RestEvent>(getAuthToken, 'events', {
    appName,
    baseUrl,
  });
  const userDataProvider = isContentfulEnabled
    ? new UserContentfulDataProvider(
        contentfulGraphQLClient,
        getContentfulRestClientFactory,
      )
    : new UserSquidexDataProvider(squidexGraphqlClient, userRestClient);

  const researchOutputDataProvider = new ResearchOutputSquidexDataProvider(
    squidexGraphqlClient,
    researchOutputRestClient,
  );
  const researchTagDataProvider = new ResearchTagSquidexDataProvider(
    squidexGraphqlClient,
  );
  const externalAuthorDataProvider = isContentfulEnabled
    ? new ExternalAuthorContentfulDataProvider(
        contentfulGraphQLClient,
        getContentfulRestClientFactory,
      )
    : new ExternalAuthorSquidexDataProvider(
        externalAuthorsRestClient,
        squidexGraphqlClient,
      );

  const assetDataProvider = new AssetSquidexDataProvider(userRestClient);

  const eventDataProvider = new EventSquidexDataProvider(
    eventsRestClient,
    squidexGraphqlClient,
  );
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
