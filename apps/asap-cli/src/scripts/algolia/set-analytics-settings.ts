/* istanbul ignore file */
import fs from 'fs/promises';
import { getIndexSchema } from './set-settings';

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
  const { path, client, index, indexSchema } = await getIndexSchema({
    algoliaAppId,
    algoliaCiApiKey,
    indexName,
    appName: 'crn-analytics',
  });

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
