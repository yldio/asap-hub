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
      await record.client.delete(record.id);
    }
    toDelete = [];
  };
};
