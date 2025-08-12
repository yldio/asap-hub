/* eslint-disable no-restricted-syntax, no-console, */
import { Client } from '@opensearch-project/opensearch';
import {
  extractDomainFromEndpoint,
  getOpenSearchEndpoint,
} from './opensearch-endpoint';
import type { OpenSearchMapping, AliasAction } from './types';

interface IndexConfig<T> {
  awsRegion: string;
  stage: string;
  openSearchUsername?: string;
  openSearchPassword?: string;
  indexAlias: string;
  getData: () => Promise<{
    documents: T[];
    mapping: OpenSearchMapping['mappings'];
  }>;
}

export const getClient = async (
  awsRegion: string,
  stage: string,
  openSearchUsername: string | undefined,
  openSearchPassword: string | undefined,
): Promise<Client> => {
  if (!openSearchUsername || !openSearchPassword) {
    throw new Error('OPENSEARCH_USERNAME and OPENSEARCH_PASSWORD must be set');
  }

  const endpoint = await getOpenSearchEndpoint({ awsRegion, stage });
  const domainEndpoint = extractDomainFromEndpoint(endpoint);

  return new Client({
    node: `https://${domainEndpoint}`,
    auth: {
      username: openSearchUsername,
      password: openSearchPassword,
    },
    ssl: {
      rejectUnauthorized: true,
    },
  });
};

export const indexOpenSearchData = async <T>({
  awsRegion,
  stage,
  openSearchUsername,
  openSearchPassword,
  indexAlias,
  getData,
}: IndexConfig<T>) => {
  const client = await getClient(
    awsRegion,
    stage,
    openSearchUsername,
    openSearchPassword,
  );

  const { documents, mapping } = await getData();

  const newIndexName = `${indexAlias}-${Date.now()}`;
  console.log(`Creating new index: ${newIndexName}`);

  await client.indices.create({
    index: newIndexName,
    body: {
      settings: {
        number_of_shards: 1,
        number_of_replicas: 1,
      },
      mappings: mapping,
    },
  });

  const bulkBody = documents.flatMap((doc) => [
    {
      index: { _index: newIndexName },
    },
    doc as Record<string, unknown>,
  ]);

  if (bulkBody.length > 0) {
    const bulkResponse = await client.bulk({ body: bulkBody });
    console.log(bulkResponse);
    if (bulkResponse.body.errors) {
      console.error('Some documents had indexing errors:');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      bulkResponse.body.items.forEach((item: any, index: number) => {
        if (item.index?.error) {
          console.error(`  Document ${index}: ${item.index.error.reason}`);
        }
      });
    } else {
      console.log(`Successfully indexed ${documents.length} documents`);
    }
  }

  await client.indices.refresh({ index: newIndexName });

  const aliasActions: AliasAction[] = [
    { add: { index: newIndexName, alias: indexAlias } },
  ];
  const oldIndicesToDelete: string[] = [];

  try {
    const currentAlias = await client.indices.getAlias({ name: indexAlias });
    const oldIndices = Object.keys(currentAlias.body);

    for (const oldIndex of oldIndices) {
      aliasActions.unshift({
        remove: { index: oldIndex, alias: indexAlias },
      });
      oldIndicesToDelete.push(oldIndex);
    }
  } catch {
    console.log(`No existing alias found for ${indexAlias}`);
  }

  await client.indices.updateAliases({ body: { actions: aliasActions } });
  console.log(`Alias '${indexAlias}' now points to '${newIndexName}'`);

  if (oldIndicesToDelete.length > 0) {
    for (const oldIndex of oldIndicesToDelete) {
      try {
        await client.indices.delete({ index: oldIndex });
        console.log(`Deleted old index: ${oldIndex}`);
      } catch (error) {
        console.error(`Failed to delete old index ${oldIndex}:`, error);
      }
    }
  }
};
