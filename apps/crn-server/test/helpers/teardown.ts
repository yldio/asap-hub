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
  const toDelete: RecordToDelete[] = [];

  for (const client of clients) {
    const create = client.create;
    client.create = async (...args) => {
      const result: Response = await create.apply(client, args);
      toDelete.push({ client, id: result.id });
      return result;
    };
  }

  return async () => {
    while (toDelete.length) {
      const record: RecordToDelete = toDelete.pop();
      await record.client.delete(record.id);
    }
  };
};
