import { ListResponse } from '@asap-hub/model';
import {
  RestEvent,
  RestExternalAuthor,
  RestResearchOutput,
  RestTeam,
  RestUser,
  SquidexGraphql,
  SquidexRest,
} from '@asap-hub/squidex';
import { getAccessTokenFactory } from '@asap-hub/squidex/src/auth';
import { promises as fs } from 'fs';
import { appName, baseUrl, clientId, clientSecret } from '../src/config';
import Events from '../src/controllers/events';
import ExternalAuthors from '../src/controllers/external-authors';
import ResearchOutputs from '../src/controllers/research-outputs';
import Users from '../src/controllers/users';
import { AssetSquidexDataProvider } from '../src/data-providers/assets.data-provider';
import { ExternalAuthorSquidexDataProvider } from '../src/data-providers/external-authors.data-provider';
import { ResearchOutputSquidexDataProvider } from '../src/data-providers/research-outputs.data-provider';
import { ResearchTagSquidexDataProvider } from '../src/data-providers/research-tags.data-provider';
import { UserSquidexDataProvider } from '../src/data-providers/users.data-provider';

type Entity = 'users' | 'research-outputs' | 'external-authors' | 'events';
export const exportEntity = async (
  entity: Entity,
  filename?: string,
): Promise<void> => {
  const controller = getController(entity);
  const file = await fs.open(filename || `${entity}.json`, 'w');

  let recordCount = 0;
  let total: number;
  let records: ListResponse<unknown>;
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

    await file.write(JSON.stringify(records.items, null, 2).slice(1, -1));

    page++;
    recordCount += records.items.length;
  } while (total > recordCount);

  await file.write(']');

  console.log(`Finished exporting ${recordCount} records`);
};

function getController(entity: Entity) {
  const getAuthToken = getAccessTokenFactory({
    clientId,
    clientSecret,
    baseUrl,
  });
  const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
    appName,
    baseUrl,
  });
  const userRestClient = new SquidexRest<RestUser>(getAuthToken, 'users', {
    appName,
    baseUrl,
  });
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
  const teamRestClient = new SquidexRest<RestTeam>(getAuthToken, 'teams', {
    appName,
    baseUrl,
  });
  const userDataProvider = new UserSquidexDataProvider(
    squidexGraphqlClient,
    userRestClient,
  );
  const researchOutputDataProvider = new ResearchOutputSquidexDataProvider(
    squidexGraphqlClient,
    researchOutputRestClient,
    teamRestClient,
  );
  const researchTagDataProvider = new ResearchTagSquidexDataProvider(
    squidexGraphqlClient,
  );
  const externalAuthorDataProvider = new ExternalAuthorSquidexDataProvider(
    externalAuthorsRestClient,
  );
  const assetDataProvider = new AssetSquidexDataProvider(userRestClient);

  const controllerMap = {
    users: new Users(userDataProvider, assetDataProvider),
    'research-outputs': new ResearchOutputs(
      researchOutputDataProvider,
      researchTagDataProvider,
      externalAuthorDataProvider,
    ),
    'external-authors': new ExternalAuthors(squidexGraphqlClient),
    events: new Events(squidexGraphqlClient, eventsRestClient),
  };

  return controllerMap[entity];
}
