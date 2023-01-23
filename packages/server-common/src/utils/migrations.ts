import {
  Entity,
  Rest,
  Results,
  SquidexGraphql,
  SquidexGraphqlClient,
  SquidexRest,
  SquidexRestClient,
} from '@asap-hub/squidex';

export const applyToAllItemsInCollectionFactory =
  (appName: string, baseUrl: string, getAuthToken: () => Promise<string>) =>
  async <T extends Entity & Rest<unknown>>(
    entityName: string,
    processEntity: (
      entity: T,
      squidexRestClient: SquidexRestClient<T>,
      squidexGraphqlClient: SquidexGraphqlClient,
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
    const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
      appName,
      baseUrl,
    });

    let pointer = 0;
    let result: Results<T>;

    /* eslint-disable no-await-in-loop */
    /* eslint-disable no-restricted-syntax */
    do {
      result = await squidexClient.fetch({
        $top: 10,
        $skip: pointer,
        $orderby: 'created asc',
      });

      for (const item of result.items) {
        await processEntity(item, squidexClient, squidexGraphqlClient);
      }

      pointer += 10;
    } while (pointer < result.total);
    /* eslint-enable no-await-in-loop */
    /* eslint-enable no-restricted-syntax */
  };
