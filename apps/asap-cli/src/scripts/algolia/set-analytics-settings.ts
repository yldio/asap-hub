/* istanbul ignore file */
import algoliasearch from 'algoliasearch';
import fs from 'fs/promises';
import { resolve } from 'path';

export type SetAlgoliaAnalyticsSettings = {
  algoliaAppId: string;
  algoliaCiApiKey: string;
  indexName: string;
};

export const setAlgoliaAnalyticsSettings = async ({
  algoliaAppId,
  algoliaCiApiKey,
  indexName,
}: SetAlgoliaAnalyticsSettings): Promise<void> => {
  const path = resolve(
    __dirname,
    `../../../../../packages/algolia/schema/crn-analytics`,
  );
  const client = algoliasearch(algoliaAppId, algoliaCiApiKey);

  const index = client.initIndex(indexName);
  const indexSchemaRaw = await fs.readFile(
    `${path}/algolia-schema.json`,
    'utf8',
  );
  const indexSchema = JSON.parse(indexSchemaRaw);

  const replicas = [
    `${indexName}_team_desc`,

    `${indexName}_wg_current_leadership_asc`,
    `${indexName}_wg_current_leadership_desc`,
    `${indexName}_wg_previous_leadership_asc`,
    `${indexName}_wg_previous_leadership_desc`,
    `${indexName}_wg_current_membership_asc`,
    `${indexName}_wg_current_membership_desc`,
    `${indexName}_wg_previous_membership_asc`,
    `${indexName}_wg_previous_membership_desc`,

    `${indexName}_ig_current_leadership_asc`,
    `${indexName}_ig_current_leadership_desc`,
    `${indexName}_ig_previous_leadership_asc`,
    `${indexName}_ig_previous_leadership_desc`,
    `${indexName}_ig_current_membership_asc`,
    `${indexName}_ig_current_membership_desc`,
    `${indexName}_ig_previous_membership_asc`,
    `${indexName}_ig_previous_membership_desc`,
  ];
  await index.setSettings({ ...indexSchema, replicas }).wait();

  replicas.forEach(async (replica) => {
    const replicaIndex = client.initIndex(replica);
    const replicaNameSuffix = replica.replace(`${indexName}_`, '');
    const replicaIndexSchemaRaw = await fs.readFile(
      `${path}/${replicaNameSuffix}-schema.json`,
      'utf8',
    );
    const replicaIndexSchema = JSON.parse(replicaIndexSchemaRaw);
    await replicaIndex.setSettings(replicaIndexSchema);
  });
};
