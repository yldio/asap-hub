import { ListResponse } from '@asap-hub/model';
import { SquidexGraphql } from '@asap-hub/squidex';
import { promises as fs } from 'fs';
import Events from '../src/controllers/events';
import ExternalAuthors from '../src/controllers/external-authors';
import ResearchOutputs from '../src/controllers/research-outputs';
import Users from '../src/controllers/users';
import AssetDataProvider from '../src/data-providers/assets.data-provider';
import UserDataProvider from '../src/data-providers/users.data-provider';

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
  const controllerMap = {
    users: Users,
    'research-outputs': ResearchOutputs,
    'external-authors': ExternalAuthors,
    events: Events,
  };
  const squidexGraphqlClient = new SquidexGraphql();
  if (entity === 'users') {
    const userDataProvider = new UserDataProvider(squidexGraphqlClient);
    const assetDataProvider = new AssetDataProvider();
    return new controllerMap[entity](userDataProvider, assetDataProvider);
  }

  return new controllerMap[entity](squidexGraphqlClient);
}
