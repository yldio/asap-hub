import { GenericError } from '@asap-hub/errors';
import { SquidexRest } from '@asap-hub/squidex';

type Response = { id: string; data: Record<string, unknown> };
type SquidexRestClient = SquidexRest<Response>;
type RecordToDelete = {
  client: SquidexRestClient;
  id: string;
};

export const teardownHelper = (
  clients: SquidexRestClient[],
): (() => Promise<void>) => {
  let toDelete: RecordToDelete[] = [];

  for (const client of clients) {
    const { create } = client;
    client.create = async (...args) => {
      const result: Response = await create.apply(client, args);
      // eslint-disable-next-line no-loop-func
      toDelete.push({ client, id: result.id });
      return result;
    };
  }

  return async () => {
    for (const record of toDelete) {
      try {
        await record.client.delete(record.id);
      } catch (err) {
        if (
          err instanceof GenericError &&
          (err.httpResponseBody as { statusCode: number }).statusCode === 410
        ) {
          // This 410 (Gone) is an expected error as we delete some events
          // while tests are still running (before the teardown)
          // So when teardown happens, some records were already deleted
        } else {
          // eslint-disable-next-line no-console
          console.log(`Fail to delete entry ${record.id}: ${err}`);
        }
      }
    }
    toDelete = [];
  };
};
