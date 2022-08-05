import {
  Entity,
  Rest,
  Results,
  SquidexRest,
  SquidexRestClient,
} from '@asap-hub/squidex';
import { appName, baseUrl } from '../config';
import { getAuthToken } from './auth';

export const applyToAllItemsInCollection = async <
  T extends Entity & Rest<unknown>,
>(
  entityName: string,
  processEntity: (
    entity: T,
    squidexClient: SquidexRestClient<T>,
  ) => Promise<void>,
): Promise<void> => {
  const squidexClient = new SquidexRest<T>(
    getAuthToken,
    entityName,
    { appName, baseUrl },
    {
      unpublished: true,
    },
  );

  let pointer = 0;
  let result: Results<T>;

  do {
    result = await squidexClient.fetch({
      $top: 10,
      $skip: pointer,
      $orderby: 'created asc',
    });

    for (const item of result.items) {
      await processEntity(item, squidexClient);
    }

    pointer += 10;
  } while (pointer < result.total);
};
