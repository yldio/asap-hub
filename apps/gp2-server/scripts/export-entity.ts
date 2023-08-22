import { EntityResponses } from '@asap-hub/algolia';
import { ListResponse } from '@asap-hub/model';
import { promises as fs } from 'fs';
import Outputs from '../src/controllers/output.controller';
import Projects from '../src/controllers/project.controller';
import { ExternalUserContentfulDataProvider } from '../src/data-providers/external-user.data-provider';
import { OutputContentfulDataProvider } from '../src/data-providers/output.data-provider';
import { ProjectContentfulDataProvider } from '../src/data-providers/project.data-provider';
import {
  getContentfulGraphQLClientFactory,
  getContentfulRestClientFactory,
} from '../src/dependencies/clients.dependency';

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
  const controllerMap = {
    output: new Outputs(outputDataProvider, externalUserDataProvider),
    project: new Projects(projectDataProvider),
  };

  return controllerMap[entity];
};

const transformRecords = <T extends EntityResponsesGP2, K extends keyof T>(
  record: T[K] & { id: string },
  type: K,
) => ({
  ...record,
  objectID: record.id,
  __meta: {
    type,
  },
});
