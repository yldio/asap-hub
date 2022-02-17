import { promises as fs } from 'fs';
import { ListResponse } from '@asap-hub/model';
import { SquidexGraphql } from '@asap-hub/squidex';
import ResearchOutputs from '../src/controllers/research-outputs';
import Users from '../src/controllers/users';
import ExternalAuthors from '../src/controllers/external-authors';

export const exportEntity = async (
  entity: 'users' | 'research-outputs',
  filename?: string,
): Promise<void> => {
  const controllerMap = {
    users: Users,
    'research-outputs': ResearchOutputs,
    'external-authors': ExternalAuthors,
  };
  const controller = new controllerMap[entity](new SquidexGraphql());
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
