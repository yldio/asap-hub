/* eslint-disable no-console */
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
  batchSize?: number;
}

interface BulkIndexResult {
  totalIndexed: number;
  totalErrors: number;
}

const DEFAULT_BATCH_SIZE = 5000;

const createIndexSettings = () => ({
  number_of_shards: 1,
  number_of_replicas: 1,
  'index.max_ngram_diff': 10,
  analysis: {
    filter: {
      ngram_filter: {
        type: 'ngram' as const,
        min_gram: 1,
        max_gram: 10,
      },
    },
    analyzer: {
      ngram_analyzer: {
        type: 'custom' as const,
        tokenizer: 'standard' as const,
        filter: ['lowercase', 'ngram_filter'],
      },
      ngram_search_analyzer: {
        type: 'custom' as const,
        tokenizer: 'standard' as const,
        filter: ['lowercase'],
      },
    },
    normalizer: {
      lowercase_normalizer: {
        type: 'custom' as const,
        filter: ['lowercase'],
      },
    },
  },
});

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

const createIndex = async (
  client: Client,
  indexName: string,
  mapping: OpensearchMapping['mappings'],
): Promise<void> => {
  console.log(`Creating new index: ${indexName}`);

  await client.indices.create({
    index: indexName,
    body: {
      settings: createIndexSettings(),
      mappings: mapping,
    },
  });
};

const indexBatch = async <T>(
  client: Client,
  indexName: string,
  batch: T[],
  batchNumber: number,
  totalBatches: number,
  startIndex: number,
): Promise<{ indexed: number; errors: number }> => {
  console.log(
    `Processing batch ${batchNumber}/${totalBatches} (${batch.length} documents)`,
  );

  const bulkBody = batch.flatMap((doc) => [
    { index: { _index: indexName } },
    doc as Record<string, unknown>,
  ]);

  const bulkResponse = await client.bulk({ body: bulkBody });

  let errors = 0;

  if (bulkResponse.body.errors) {
    console.error(`Batch ${batchNumber} had indexing errors:`);
    bulkResponse.body.items.forEach(
      (item: { index?: { error?: { reason?: string } } }, index: number) => {
        if (item.index?.error) {
          errors += 1;
          console.error(
            `  Document ${startIndex + index}: ${item.index.error.reason}`,
          );
        }
      },
    );
  }

  return { indexed: batch.length, errors };
};

const bulkIndexDocuments = async <T>(
  client: Client,
  indexName: string,
  documents: T[],
  batchSize: number,
): Promise<BulkIndexResult> => {
  if (documents.length === 0) {
    return { totalIndexed: 0, totalErrors: 0 };
  }

  console.log(
    `Indexing ${documents.length} documents in batches of ${batchSize}`,
  );

  const totalBatches = Math.ceil(documents.length / batchSize);
  let totalIndexed = 0;
  let totalErrors = 0;

  for (let i = 0; i < documents.length; i += batchSize) {
    const batch = documents.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;

    const { indexed, errors } = await indexBatch(
      client,
      indexName,
      batch,
      batchNumber,
      totalBatches,
      i,
    );

    totalIndexed += indexed;
    totalErrors += errors;

    console.log(
      `Batch ${batchNumber}/${totalBatches} completed. Progress: ${totalIndexed}/${documents.length}`,
    );
  }

  if (totalErrors > 0) {
    console.error(
      `Completed with ${totalErrors} errors. Successfully indexed ${
        totalIndexed - totalErrors
      }/${documents.length} documents`,
    );
  } else {
    console.log(`Successfully indexed all ${totalIndexed} documents`);
  }

  return { totalIndexed, totalErrors };
};

const getOldIndices = async (
  client: Client,
  indexAlias: string,
): Promise<string[]> => {
  try {
    const currentAlias = await client.indices.getAlias({ name: indexAlias });
    return Object.keys(currentAlias.body);
  } catch {
    console.log(`No existing alias found for ${indexAlias}`);
    return [];
  }
};

const updateAliasAndCleanup = async (
  client: Client,
  newIndexName: string,
  indexAlias: string,
): Promise<void> => {
  const oldIndices = await getOldIndices(client, indexAlias);

  const aliasActions: AliasAction[] = [
    ...oldIndices.map((oldIndex) => ({
      remove: { index: oldIndex, alias: indexAlias },
    })),
    { add: { index: newIndexName, alias: indexAlias } },
  ];

  await client.indices.updateAliases({ body: { actions: aliasActions } });
  console.log(`Alias '${indexAlias}' now points to '${newIndexName}'`);

  if (oldIndices.length > 0) {
    await Promise.allSettled(
      oldIndices.map(async (oldIndex) => {
        try {
          await client.indices.delete({ index: oldIndex });
          console.log(`Deleted old index: ${oldIndex}`);
        } catch (error) {
          console.error(`Failed to delete old index ${oldIndex}:`, error);
        }
      }),
    );
  }
};

export const indexOpensearchData = async <T>({
  awsRegion,
  stage,
  opensearchUsername,
  opensearchPassword,
  indexAlias,
  getData,
  batchSize = DEFAULT_BATCH_SIZE,
}: IndexConfig<T>): Promise<void> => {
  const client = await getClient(
    awsRegion,
    stage,
    opensearchUsername,
    opensearchPassword,
  );

  const { documents, mapping } = await getData();
  const newIndexName = `${indexAlias}-${Date.now()}`;

  await createIndex(client, newIndexName, mapping);
  await bulkIndexDocuments(client, newIndexName, documents, batchSize);
  await client.indices.refresh({ index: newIndexName });
  await updateAliasAndCleanup(client, newIndexName, indexAlias);
};
