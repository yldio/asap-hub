import { EntityResponses } from '@asap-hub/algolia';
import { ListResponse } from '@asap-hub/model';
import { promises as fs } from 'fs';
import Events from '../src/controllers/event.controller';
import ExternalUsers from '../src/controllers/external-user.controller';
import News from '../src/controllers/news.controller';
import Outputs from '../src/controllers/output.controller';
import Projects from '../src/controllers/project.controller';
import Users from '../src/controllers/user.controller';
import WorkingGroups from '../src/controllers/working-group.controller';
import { AssetContentfulDataProvider } from '../src/data-providers/asset.data-provider';
import { EventContentfulDataProvider } from '../src/data-providers/event.data-provider';
import { ExternalUserContentfulDataProvider } from '../src/data-providers/external-user.data-provider';
import { NewsContentfulDataProvider } from '../src/data-providers/news.data-provider';
import { OutputContentfulDataProvider } from '../src/data-providers/output.data-provider';
import { ProjectContentfulDataProvider } from '../src/data-providers/project.data-provider';
import { UserContentfulDataProvider } from '../src/data-providers/user.data-provider';
import { WorkingGroupContentfulDataProvider } from '../src/data-providers/working-group.data-provider';
import {
  getContentfulGraphQLClientFactory,
  getContentfulRestClientFactory,
} from '../src/dependencies/clients.dependency';

const isWorkingGroupController = (
  controller:
    | Events
    | ExternalUsers
    | News
    | Outputs
    | Projects
    | Users
    | WorkingGroups,
): controller is WorkingGroups => controller instanceof WorkingGroups;

type EntityResponsesGP2 = EntityResponses['gp2'];
export const exportEntity = async (
  entity: keyof EntityResponsesGP2,
  filename?: string,
): Promise<void> => {
  const controller = getController(entity);
  const file = await fs.open(filename || `${entity}.json`, 'w');

  let recordCount = 0;
  let total: number;
  let records: ListResponse<EntityResponsesGP2[keyof EntityResponsesGP2]>;
  let page = 1;

  await file.write('[\n');

  const take = 10;
  do {
    if (isWorkingGroupController(controller)) {
      records = await controller.fetch();
    } else {
      records = await controller.fetch({
        take,
        skip: (page - 1) * take,
      });
    }

    total = records.total;

    if (page != 1 && records.items.length) {
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

const getController = (entity: keyof EntityResponsesGP2) => {
  const graphQLClient = getContentfulGraphQLClientFactory();

  const outputDataProvider = new OutputContentfulDataProvider(
    graphQLClient,
    getContentfulRestClientFactory,
  );
  const externalUserDataProvider = new ExternalUserContentfulDataProvider(
    graphQLClient,
    getContentfulRestClientFactory,
  );
  const projectDataProvider = new ProjectContentfulDataProvider(
    graphQLClient,
    getContentfulRestClientFactory,
  );
  const eventDataProvider = new EventContentfulDataProvider(
    graphQLClient,
    getContentfulRestClientFactory,
  );
  const userDataProvider = new UserContentfulDataProvider(
    graphQLClient,
    getContentfulRestClientFactory,
  );
  const assetDataProvider = new AssetContentfulDataProvider(
    getContentfulRestClientFactory,
  );
  const newsDataProvider = new NewsContentfulDataProvider(graphQLClient);

  const workingGroupDataProvider = new WorkingGroupContentfulDataProvider(
    graphQLClient,
    getContentfulRestClientFactory,
  );

  const controllerMap = {
    output: new Outputs(outputDataProvider, externalUserDataProvider),
    project: new Projects(projectDataProvider),
    event: new Events(eventDataProvider),
    user: new Users(userDataProvider, assetDataProvider),
    news: new News(newsDataProvider),
    'external-user': new ExternalUsers(externalUserDataProvider),
    'working-group': new WorkingGroups(workingGroupDataProvider),
  };

  return controllerMap[entity];
};

const transformRecords = <T extends EntityResponsesGP2, K extends keyof T>(
  record: T[K] extends EntityResponsesGP2[keyof EntityResponsesGP2]
    ? T[K] & { id: string }
    : never,
  type: K extends keyof EntityResponsesGP2 ? K : never,
) => {
  const payload = {
    ...record,
    objectID: record.id,
    __meta: {
      type,
    },
  };

  if ('tags' in record) {
    const tags = record.tags?.map((tag) => {
      if (typeof tag === 'object') {
        return tag.name;
      }
      return tag;
    });

    return {
      ...payload,
      _tags: tags ? tags : [],
    };
  }

  return payload;
};
