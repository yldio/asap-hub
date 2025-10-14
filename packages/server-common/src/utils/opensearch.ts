/* eslint-disable no-restricted-syntax, no-console, */
import { Client } from '@opensearch-project/opensearch';
import {
  extractDomainFromEndpoint,
  getOpensearchEndpoint,
} from './opensearch-endpoint';
import type { OpensearchMapping, AliasAction } from './types';

interface IndexConfig<T> {
  awsRegion: string;
  stage: string;
  opensearchUsername?: string;
  opensearchPassword?: string;
  indexAlias: string;
  getData: () => Promise<{
    documents: T[];
    mapping: OpensearchMapping['mappings'];
  }>;
  batchSize?: number; // Number of documents to index per batch (default: 1000)
}

export const getClient = async (
  awsRegion: string,
  stage: string,
  opensearchUsername: string | undefined,
  opensearchPassword: string | undefined,
): Promise<Client> => {
  if (!opensearchUsername || !opensearchPassword) {
    throw new Error('OPENSEARCH_USERNAME and OPENSEARCH_PASSWORD must be set');
  }

  const endpoint = await getOpensearchEndpoint({ awsRegion, stage });
  const domainEndpoint = extractDomainFromEndpoint(endpoint);

  return new Client({
    node: `https://${domainEndpoint}`,
    auth: {
      username: opensearchUsername,
      password: opensearchPassword,
    },
    ssl: {
      rejectUnauthorized: true,
    },
  });
};

export const indexOpensearchData = async <T>({
  awsRegion,
  stage,
  opensearchUsername,
  opensearchPassword,
  indexAlias,
  getData,
  batchSize = 5000,
}: IndexConfig<T>) => {
  const client = await getClient(
    awsRegion,
    stage,
    opensearchUsername,
    opensearchPassword,
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
        'index.max_ngram_diff': 10,
        analysis: {
          filter: {
            ngram_filter: {
              type: 'ngram',
              min_gram: 1,
              max_gram: 10,
            },
          },
          analyzer: {
            ngram_analyzer: {
              type: 'custom',
              tokenizer: 'standard',
              filter: ['lowercase', 'ngram_filter'],
            },
            ngram_search_analyzer: {
              type: 'custom',
              tokenizer: 'standard',
              filter: ['lowercase'],
            },
          },
        },
      },
      mappings: mapping,
    },
  });

  // Index documents in batches
  if (documents.length > 0) {
    console.log(
      `Indexing ${documents.length} documents in batches of ${batchSize}`,
    );
    let totalIndexed = 0;
    let totalErrors = 0;

    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize);
      const batchNumber = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(documents.length / batchSize);

      console.log(
        `Processing batch ${batchNumber}/${totalBatches} (${batch.length} documents)`,
      );

      const bulkBody = batch.flatMap((doc) => [
        {
          index: { _index: newIndexName },
        },
        doc as Record<string, unknown>,
      ]);

      const bulkResponse = await client.bulk({ body: bulkBody });

      if (bulkResponse.body.errors) {
        console.error(`Batch ${batchNumber} had indexing errors:`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        bulkResponse.body.items.forEach((item: any, index: number) => {
          if (item.index?.error) {
            totalErrors += 1;
            console.error(
              `  Document ${i + index}: ${item.index.error.reason}`,
            );
          }
        });
      }

      totalIndexed += batch.length;
      console.log(
        `Batch ${batchNumber}/${totalBatches} completed. Progress: ${totalIndexed}/${documents.length}`,
      );
    }
    /* eslint-enable no-await-in-loop */

    if (totalErrors > 0) {
      console.error(
        `Completed with ${totalErrors} errors. Successfully indexed ${
          totalIndexed - totalErrors
        }/${documents.length} documents`,
      );
    } else {
      console.log(`Successfully indexed all ${totalIndexed} documents`);
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
